import fs from 'fs';
import path from 'path';

const localesDir = './server/locales';
const languages = ['en', 'fr', 'ar'];

const auditTranslations = () => {
    console.log('🚀 Starting Translation Audit...');

    const translations = {};
    languages.forEach(lang => {
        const filePath = path.join(localesDir, lang, 'translation.json');
        if (fs.existsSync(filePath)) {
            translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    });

    const enKeys = Object.keys(translations['en'] || {});
    console.log(`Found ${enKeys.length} keys in English (Master).`);

    languages.slice(1).forEach(lang => {
        const currentKeys = Object.keys(translations[lang] || {});
        const missing = enKeys.filter(key => !currentKeys.includes(key));
        const extra = currentKeys.filter(key => !enKeys.includes(key));

        console.log(`\n--- Language: ${lang.toUpperCase()} ---`);
        if (missing.length > 0) {
            console.log(`❌ Missing ${missing.length} keys:`, missing.join(', '));
        } else {
            console.log('✅ All master keys present.');
        }

        if (extra.length > 0) {
            console.log(`⚠️  Extra keys present (not in English):`, extra.join(', '));
        }
    });

    console.log('\nAudit complete.');
};

auditTranslations();
