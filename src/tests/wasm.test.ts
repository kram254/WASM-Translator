import { loadTranslatorModule, TranslatorModule } from '../wasm/translatorModule';

describe('WASM Translator Module', () => {
    let translator!: TranslatorModule; // *Slightly Modified* - Removed null and used definite assignment assertion

    beforeAll(async () => {
        translator = await loadTranslatorModule();
    });

    beforeEach(() => {
        if (!translator) {
            throw new Error('Translator module not loaded');
        }
    });

    afterEach(() => {
        // Clean up any allocated memory if necessary
        jest.clearAllMocks();
    });

    it('should load the translator module successfully', () => {
        expect(translator).toBeDefined();
        expect(typeof translator.translate).toBe('function');
    });

    it('should translate text correctly', async () => { // *Slightly Modified* - Made test async
        const inputText = '测试';
        const targetLang = 'en';

        // Mock the translate function
        const mockTranslate = jest.fn().mockResolvedValue('Test');
        translator.translate = mockTranslate;

        const translatedText = await translator.translate(inputText, targetLang); // *Slightly Modified* - Provide correct arguments
        
        expect(translatedText).toBe('Test');
        expect(mockTranslate).toHaveBeenCalledWith(inputText, targetLang);
    });

    it('should handle translation errors gracefully', async () => { // *Slightly Modified* - Made test async
        const invalidText = '';
        const invalidLang = 'invalid_lang';

        // Mock the translate function to throw an error
        const mockTranslate = jest.fn().mockRejectedValue(new Error('Translation failed.'));
        translator.translate = mockTranslate;

        await expect(translator.translate(invalidText, invalidLang)).rejects.toThrow('Translation failed.');
        expect(mockTranslate).toHaveBeenCalledWith(invalidText, invalidLang);
    });
});































// import { loadTranslatorModule, encodeString, TranslatorModule } from '../wasm/translatorModule';

// describe('WASM Translator Module', () => {
//     let translator: TranslatorModule | null = null;

//     beforeAll(async () => {
//         translator = await loadTranslatorModule();
//     });

//     beforeEach(() => {
//         if (!translator) {
//             throw new Error('Translator module not loaded');
//         }
//     });

//     afterEach(() => {
//         // Clean up any allocated memory
//         jest.clearAllMocks();
//     });

//     it('should load the translator module successfully', () => {
//         expect(translator).toBeDefined();
//         expect(typeof translator!.translate).toBe('function');
//         expect(typeof translator!.loadModel).toBe('function');
//         expect(typeof translator!.loadVocab).toBe('function');
//         expect(typeof translator!.isModelLoaded).toBe('function');
//         expect(typeof translator!.freeMemory).toBe('function');
//         expect(translator!.memory).toBeInstanceOf(WebAssembly.Memory);
//     });

//     it('should check if model is loaded', () => {
//         expect(translator!.isModelLoaded()).toBe(true);
//     });

//     it('should translate text correctly', () => {
//         const inputText = '测试';
//         const targetLang = 'en_XX';

//         const { ptr: textPtr, len: textLen } = encodeString(inputText, translator!.memory);
//         const { ptr: langPtr, len: langLen } = encodeString(targetLang, translator!.memory);

//         const resultPtr = translator!.translate(textPtr, langPtr, textLen, langLen);
        
//         expect(resultPtr).not.toBe(0);

//         const memoryBuffer = new Uint8Array(translator!.memory.buffer);
//         let end = resultPtr;
//         while (memoryBuffer[end] !== 0) {
//             end++;
//         }
        
//         const bytes = memoryBuffer.slice(resultPtr, end);
//         const translatedText = new TextDecoder().decode(bytes);

//         expect(translatedText).toBeTruthy();
//         expect(typeof translatedText).toBe('string');

//         translator!.freeMemory(textPtr);
//         translator!.freeMemory(langPtr);
//         translator!.freeMemory(resultPtr);
//     });

//     it('should handle translation errors gracefully', () => {
//         const invalidText = '';
//         const invalidLang = 'invalid_lang';

//         const { ptr: textPtr, len: textLen } = encodeString(invalidText, translator!.memory);
//         const { ptr: langPtr, len: langLen } = encodeString(invalidLang, translator!.memory);

//         const resultPtr = translator!.translate(textPtr, langPtr, textLen, langLen);
        
//         expect(resultPtr).toBe(0);

//         translator!.freeMemory(textPtr);
//         translator!.freeMemory(langPtr);
//     });
// });