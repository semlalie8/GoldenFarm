import fs from 'fs';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.join(__dirname, '../server/.env');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Key Rotation Manager
 * Securely updates the .env file with live production keys.
 */
async function rotateKeys() {
    console.log('\x1b[36m%s\x1b[0m', '=== Golden Farm Security: Key Rotation Protocol ===');

    if (!fs.existsSync(ENV_PATH)) {
        console.error('CRITICAL: server/.env not found!');
        process.exit(1);
    }

    let envContent = fs.readFileSync(ENV_PATH, 'utf8');
    const existingLines = envContent.split('\n');

    const updates = {};

    console.log('\n[Instructions] Press ENTER to skip a key (keep current value).');

    // 1. Google OAuth
    updates['GOOGLE_CLIENT_ID'] = await question('Enter Live GOOGLE_CLIENT_ID: ');
    updates['GOOGLE_CLIENT_SECRET'] = await question('Enter Live GOOGLE_CLIENT_SECRET: ');

    // 2. EmailJS
    updates['EMAILJS_SERVICE_ID'] = await question('Enter Live EMAILJS_SERVICE_ID: ');
    updates['EMAILJS_PUBLIC_KEY'] = await question('Enter Live EMAILJS_PUBLIC_KEY: ');

    // 3. Admin Email
    updates['ADMIN_EMAIL'] = await question('Enter Admin Alert Email: ');

    // 4. JWT Rotation (Generating fresh high-entropy secrets)
    const rotateJwt = await question('Rotate JWT Secrets? (y/n): ');

    if (rotateJwt.toLowerCase() === 'y') {
        console.log('Generating high-entropy cryptographic seeds...');
        updates['JWT_SECRET'] = crypto.randomBytes(64).toString('hex');
        updates['JWT_ACCESS_SECRET'] = crypto.randomBytes(64).toString('hex');
        updates['JWT_REFRESH_SECRET'] = crypto.randomBytes(64).toString('hex');
    }

    rl.close();

    // Apply Updates
    let newContent = existingLines.map(line => {
        const [key, val] = line.split('=');
        if (updates[key] && updates[key].trim() !== '') {
            console.log(`✓ Updated ${key}`);
            return `${key}=${updates[key].trim()}`;
        }
        return line;
    }).join('\n');

    // Append missing keys if any
    Object.keys(updates).forEach(key => {
        if (updates[key] && !newContent.includes(key + '=')) {
            newContent += `\n${key}=${updates[key].trim()}`;
            console.log(`+ Added ${key}`);
        }
    });

    // Create Backup of old env
    fs.writeFileSync(`${ENV_PATH}.backup.${Date.now()}`, envContent);
    fs.writeFileSync(ENV_PATH, newContent);

    console.log('\n\x1b[32m%s\x1b[0m', 'SUCCESS: .env refreshed. Old configuration backed up.');
    console.log('You must restart the Docker containers for changes to take effect.');
}

rotateKeys();
