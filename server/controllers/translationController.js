import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get translations for a language
// @route   GET /api/translations/:lang/:ns
// @access  Public
const getTranslations = asyncHandler(async (req, res) => {
    const { lang, ns } = req.params;

    try {
        // Read from JSON file
        const translationPath = path.join(__dirname, `../locales/${lang}/${ns}.json`);

        if (fs.existsSync(translationPath)) {
            const translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
            res.json(translations);
        } else {
            // Return empty object if file doesn't exist
            res.json({});
        }
    } catch (error) {
        console.error('Translation error:', error);
        res.json({});
    }
});

// @desc    Update/Add translation key
// @route   POST /api/translations
// @access  Private/Admin
const updateTranslation = asyncHandler(async (req, res) => {
    const { language, namespace, key, value } = req.body;

    try {
        const translationPath = path.join(__dirname, `../locales/${language}/${namespace}.json`);

        let translations = {};
        if (fs.existsSync(translationPath)) {
            translations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
        }

        translations[key] = value;

        fs.writeFileSync(translationPath, JSON.stringify(translations, null, 2));

        res.json({ success: true, message: 'Translation updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating translation' });
    }
});

// @desc    Get missing keys (for admin review)
// @route   GET /api/translations/missing
// @access  Private/Admin
const getMissingTranslations = asyncHandler(async (req, res) => {
    res.json({ message: "Feature to list missing keys" });
});

export {
    getTranslations,
    updateTranslation,
    getMissingTranslations
};
