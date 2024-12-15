import { loadTranslatorModule, TranslatorModule } from '../../wasm/translatorModule';

/**
 * *jinx jinx* - Updated translateTexts to use Argos Translate via Pyodide for offline translations.
 */
export async function translateTexts(
    texts: string[],
    targetLanguages: string[],
    sourceLanguage: string = 'zh' // *jinx jinx* - Using language codes compatible with Argos
): Promise<Record<string, Record<string, string>>> {
    const translations: Record<string, Record<string, string>> = {};
    
    try {
        const translator = await loadTranslatorModule();
        
        for (const text of texts) {
            translations[text] = {};
            for (const lang of targetLanguages) {
                try {
                    const translatedText = await translator.translate(text, lang); // *jinx jinx* - Await the async translate
                    translations[text][lang] = translatedText;
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error 
                        ? error.message 
                        : 'An unknown error occurred';
                    translations[text][lang] = `Translation failed: ${errorMessage}`;
                }
            }
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
        console.error('Translation module error:', errorMessage);
        throw new Error(errorMessage);
    }

    return translations;
}





























// import { loadTranslatorModule, TranslatorModule } from '../../wasm/translatorModule';

// /**
//  * *Slightly Modified* - Updated translateTexts to use Argos Translate via Pyodide for offline translations.
//  */
// export async function translateTexts(
//     texts: string[],
//     targetLanguages: string[],
//     sourceLanguage: string = 'zh' // *Slightly Modified* - Using language codes compatible with Argos
// ): Promise<Record<string, Record<string, string>>> {
//     const translations: Record<string, Record<string, string>> = {};
    
//     try {
//         const translator = await loadTranslatorModule();
        
//         for (const text of texts) {
//             translations[text] = {};
//             for (const lang of targetLanguages) {
//                 try {
//                     const translatedText = await translator.translate(text, lang); // *Slightly Modified* - Await the async translate
//                     translations[text][lang] = translatedText;
//                 } catch (error: unknown) {
//                     const errorMessage = error instanceof Error 
//                         ? error.message 
//                         : 'An unknown error occurred';
//                     translations[text][lang] = `Translation failed: ${errorMessage}`;
//                 }
//             }
//         }
//     } catch (error: unknown) {
//         const errorMessage = error instanceof Error 
//             ? error.message 
//             : 'An unknown error occurred';
//         console.error('Translation module error:', errorMessage);
//         throw new Error(errorMessage);
//     }

//     return translations;
// }

