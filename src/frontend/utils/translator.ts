import { loadTranslatorModule, encodeString, TranslatorModule } from '../../wasm/translatorModule';
import axios from 'axios';

/**
 * Translates an array of texts into the specified target languages using the WASM translator module.
 * @param texts Array of strings to translate.
 * @param targetLanguages Array of target language strings (e.g., 'english', 'russian').
 * @returns A promise that resolves to an object mapping each text to its translations.
 */


export async function translateTexts(
    texts: string[],
    targetLanguages: string[],
    sourceLanguage: string = 'chinese' // *Modified* - Specify source language
): Promise<Record<string, Record<string, string>>> {
    const translations: Record<string, Record<string, string>> = {};

    for (const text of texts) {
        translations[text] = {};
        for (const lang of targetLanguages) {
            try {
                const response = await axios.post('http://localhost:5000/api/translate', { 
                    text,
                    sourceLang: sourceLanguage,
                    targetLang: lang
                });

                translations[text][lang] = response.data.translatedText;
            } catch (error) {
                console.error(`Translation error for ${lang}:`, error);
                translations[text][lang] = 'Translation failed';
            }
        }
    }

    return translations;
}