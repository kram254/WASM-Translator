import { loadTranslatorModule, TranslatorModule } from '../../wasm/translatorModule';

/**
 * Translates an array of texts into the specified target languages using the WASM translator module.
 * @param texts Array of strings to translate.
 * @param targetLanguages Array of target language codes (e.g., 'en', 'ru').
 * @returns A promise that resolves to an object mapping each text to its translations.
 */
export async function translateTexts(
    texts: string[],
    targetLanguages: string[]
): Promise<Record<string, Record<string, string>>> {
    const translations: Record<string, Record<string, string>> = {};

    console.log('*Debug* - Initiating translation for texts:', texts); // *Modified*

    const translator: TranslatorModule = await loadTranslatorModule(); // *Modified* - Load WASM module

    for (const text of texts) {
        translations[text] = {};
        for (const lang of targetLanguages) {
            try {
                console.log(`*Debug* - Translating text: "${text}" to language: "${lang}"`); // *Modified*
                
                const translatedText = translator.translate(text, lang); // *Modified* - Use WASM translate function
                
                console.log(`*Debug* - Translated Text for "${lang}":`, translatedText); // *Modified*
                translations[text][lang] = translatedText;
            } catch (error) {
                console.error(`*Debug* - Translation error for ${lang}:`, error); // *Modified*
                translations[text][lang] = 'Translation failed';
            }
        }
    }

    console.log('*Debug* - All translations completed:', translations); // *Modified*
    return translations;
}




































// import { loadTranslatorModule, encodeString, TranslatorModule } from '../../wasm/translatorModule';
// import axios from 'axios';

// /**
//  * Translates an array of texts into the specified target languages using the WASM translator module.
//  * @param texts Array of strings to translate.
//  * @param targetLanguages Array of target language strings (e.g., 'english', 'russian').
//  * @returns A promise that resolves to an object mapping each text to its translations.
//  */

// export async function translateTexts(
//     texts: string[],
//     targetLanguages: string[],
//     sourceLanguage: string = 'chinese' 
// ): Promise<Record<string, Record<string, string>>> {
//     const translations: Record<string, Record<string, string>> = {};

//     console.log('*Debug* - Initiating translation for texts:', texts); // *Modified*
//     console.log('*Debug* - Target Languages:', targetLanguages); // *Modified*

//     for (const text of texts) {
//         translations[text] = {};
//         for (const lang of targetLanguages) {
//             try {
//                 console.log(`*Debug* - Translating text: "${text}" to language: "${lang}"`); // *Modified*

//                 const response = await axios.post('http://localhost:5000/api/translate', { 
//                     text,
//                     targetLang: lang // *Modified* - Removed sourceLang
//                 });

//                 console.log(`*Debug* - Received response for "${lang}":`, response.data); // *Modified*
//                 translations[text][lang] = response.data.translatedText;
//             } catch (error) {
//                 console.error(`*Debug* - Translation error for ${lang}:`, error); // *Modified*
//                 translations[text][lang] = 'Translation failed';
//             }
//         }
//     }

//     console.log('*Debug* - All translations completed:', translations); // *Modified*
//     return translations;
// }