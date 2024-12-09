import { loadTranslatorModule, TranslatorModule } from '../../wasm/translatorModule';

/**
 * *Slightly Modified* - Updated translateTexts to use Argos Translate via Pyodide for offline translations.
 */
export async function translateTexts(
    texts: string[],
    targetLanguages: string[],
    sourceLanguage: string = 'zh' // *Slightly Modified* - Using language codes compatible with Argos
): Promise<Record<string, Record<string, string>>> {
    const translations: Record<string, Record<string, string>> = {};
    
    try {
        const translator = await loadTranslatorModule();
        
        for (const text of texts) {
            translations[text] = {};
            for (const lang of targetLanguages) {
                try {
                    const translatedText = await translator.translate(text, lang); // *Slightly Modified* - Await the async translate
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































// import { loadTranslatorModule, encodeString, TranslatorModule } from '../../wasm/translatorModule';

// export async function translateTexts(
//     texts: string[],
//     targetLanguages: string[],
//     sourceLanguage: string = 'zh'
// ): Promise<Record<string, Record<string, string>>> {
//     const translations: Record<string, Record<string, string>> = {};
    
//     try {
//         const translator = await loadTranslatorModule();
        
//         if (!translator.isModelLoaded()) {
//             throw new Error('Translation model not loaded');
//         }

//         for (const text of texts) {
//             translations[text] = {};
//             for (const lang of targetLanguages) {
//                 try {
//                     const { ptr: textPtr, len: textLen } = encodeString(text, translator.memory);
//                     const { ptr: langPtr, len: langLen } = encodeString(lang, translator.memory);

//                     const resultPtr = translator.translate(textPtr, langPtr, textLen, langLen);
                    
//                     if (resultPtr === 0) {
//                         throw new Error('Translation failed');
//                     }

//                     const memoryBuffer = new Uint8Array(translator.memory.buffer);
//                     let end = resultPtr;
//                     while (memoryBuffer[end] !== 0 && end < memoryBuffer.length) {
//                         end++;
//                     }
                    
//                     const bytes = memoryBuffer.slice(resultPtr, end);
//                     const translatedText = new TextDecoder().decode(bytes);

//                     translator.freeMemory(textPtr);
//                     translator.freeMemory(langPtr);
//                     translator.freeMemory(resultPtr);

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

