/**
 * Startup Validator
 * Ensures the platform has all critical environment components 
 * before ignition.
 */
export const validateEnvironment = () => {
    const criticalVars = [
        'MONGO_URI',
        'JWT_SECRET',
        'CLIENT_URL',
        'OLLAMA_URL'
    ];

    const missing = criticalVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------');
        console.error('\x1b[31m%s\x1b[0m', 'CRITICAL DEPLOYMENT ERROR: MISSING ENVIRONMENT VARS');
        console.error('\x1b[31m%s\x1b[0m', 'The following keys are required for Phase 10:');
        missing.forEach(m => console.error('\x1b[31m%s\x1b[0m', ` - ${m}`));
        console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------');

        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    } else {
        console.log('\x1b[32m%s\x1b[0m', '✓ Deployment environment validated. Neural components ready.');
    }
};
