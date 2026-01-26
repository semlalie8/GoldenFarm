<#
.SYNOPSIS
    Automated MongoDB Backup Script for Golden Farm (Dockerized)
.DESCRIPTION
    Connects to the running 'golden-farm-db' container, performs a mongodump,
    compresses the archive, and manages local retention polices.
    Designed to be run via Windows Task Scheduler.
.NOTES
    File Name      : backup_db.ps1
    Author         : Golden Farm DevSecOps
    Prerequisite   : Docker Desktop must be running.
#>

$ErrorActionPreference = "Stop"

# Configuration
$ContainerName = "golden-farm-db"
$DbName = "goldenfarm"
$BackupDir = "..\backups" # Relative to scripts/
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupName = "backup_$Timestamp"
$RetentionDays = 30

# Ensure Backup Directory Exists
$AbsBackupDir = Join-Path $PSScriptRoot $BackupDir
if (-not (Test-Path $AbsBackupDir)) {
    New-Item -ItemType Directory -Path $AbsBackupDir | Out-Null
}

Write-Host "[Backup] Starting Sovereign Dump for $DbName..." -ForegroundColor Cyan

try {
    # 1. Execute Dump inside Container
    # We dump to a verified path inside the container first
    docker exec $ContainerName mongodump --db $DbName --out /tmp/dump_$Timestamp 2>&1 | Out-Null

    # 2. Copy Dump to Host
    $HostDumpPath = Join-Path $AbsBackupDir $BackupName
    docker cp "$ContainerName`:/tmp/dump_$Timestamp/$DbName" $HostDumpPath

    # 3. Cleanup inside Container
    docker exec $ContainerName rm -rf /tmp/dump_$Timestamp

    # 4. Compress (Zip) for Cold Storage
    $ZipPath = Join-Path $AbsBackupDir "$BackupName.zip"
    Compress-Archive -Path $HostDumpPath -DestinationPath $ZipPath
    Remove-Item -Path $HostDumpPath -Recurse -Force

    Write-Host "[Backup] Success! Archive saved to: $ZipPath" -ForegroundColor Green

    # 5. Retention Policy (Cleanup old backups)
    $Limit = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -Path $AbsBackupDir -Filter "*.zip" | Where-Object { $_.CreationTime -lt $Limit } | Remove-Item
    Write-Host "[Policy] Pruned backups older than $RetentionDays days." -ForegroundColor Yellow

} catch {
    Write-Error "[Backup Failed] Error: $_"
    exit 1
}
