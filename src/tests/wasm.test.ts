import { loadTranslatorModule, encodeString, TranslatorModule } from '../wasm/translatorModule';

describe('WASM Translator Module', () => {
    let translator: TranslatorModule | null = null;

    beforeAll(async () => {
        translator = await loadTranslatorModule();
    });

    it('should load the translator module', () => {
        expect(translator).toBeDefined();
        expect(typeof translator!.translate).toBe('function');
        expect(translator!.memory).toBeInstanceOf(WebAssembly.Memory);
    });

    it('should translate text correctly', () => {
        if (!translator) {
            throw new Error('Translator module not loaded');
        }

        const inputText = '测试';
        const targetLang = 'english';

        // Encode input text and language
        const { ptr: textPtr, len: textLen } = encodeString(inputText, translator.memory);
        const { ptr: langPtr, len: langLen } = encodeString(targetLang, translator.memory);

        // Call the translate function
        const resultPtr = translator.translate(textPtr, langPtr, textLen, langLen);
        
        // Decode the result from memory
        const memoryBuffer = new Uint8Array(translator.memory.buffer);
        let end = resultPtr;
        while (memoryBuffer[end] !== 0) { // Assuming null-terminated string
            end++;
        }
        const bytes = memoryBuffer.slice(resultPtr, end);
        const decoder = new TextDecoder();
        const translatedText = decoder.decode(bytes);

        expect(translatedText).toBe(`Translated (${targetLang}): ${inputText}`);
    });
});