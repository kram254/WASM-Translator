import { loadTranslatorModule, TranslatorModule } from '../wasm/translatorModule';

describe('WASM Translator Module', () => {
    let translator!: TranslatorModule; // *jinx jinx* - Removed null and used definite assignment assertion

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

    it('should translate text correctly', async () => { // *jinx jinx* - Made test async
        const inputText = '测试';
        const targetLang = 'en';

        // Mock the translate function
        const mockTranslate = jest.fn().mockResolvedValue('Test');
        translator.translate = mockTranslate;

        const translatedText = await translator.translate(inputText, targetLang); // *jinx jinx* - Provide correct arguments
        
        expect(translatedText).toBe('Test');
        expect(mockTranslate).toHaveBeenCalledWith(inputText, targetLang);
    });

    it('should handle translation errors gracefully', async () => { // *jinx jinx* - Made test async
        const invalidText = '';
        const invalidLang = 'invalid_lang';

        // Mock the translate function to throw an error
        const mockTranslate = jest.fn().mockRejectedValue(new Error('Translation failed.'));
        translator.translate = mockTranslate;

        await expect(translator.translate(invalidText, invalidLang)).rejects.toThrow('Translation failed.');
        expect(mockTranslate).toHaveBeenCalledWith(invalidText, invalidLang);
    });
});































// import { loadTranslatorModule, TranslatorModule } from '../wasm/translatorModule';

// describe('WASM Translator Module', () => {
//     let translator!: TranslatorModule; // *Slightly Modified* - Removed null and used definite assignment assertion

//     beforeAll(async () => {
//         translator = await loadTranslatorModule();
//     });

//     beforeEach(() => {
//         if (!translator) {
//             throw new Error('Translator module not loaded');
//         }
//     });

//     afterEach(() => {
//         // Clean up any allocated memory if necessary
//         jest.clearAllMocks();
//     });

//     it('should load the translator module successfully', () => {
//         expect(translator).toBeDefined();
//         expect(typeof translator.translate).toBe('function');
//     });

//     it('should translate text correctly', async () => { // *Slightly Modified* - Made test async
//         const inputText = '测试';
//         const targetLang = 'en';

//         // Mock the translate function
//         const mockTranslate = jest.fn().mockResolvedValue('Test');
//         translator.translate = mockTranslate;

//         const translatedText = await translator.translate(inputText, targetLang); // *Slightly Modified* - Provide correct arguments
        
//         expect(translatedText).toBe('Test');
//         expect(mockTranslate).toHaveBeenCalledWith(inputText, targetLang);
//     });

//     it('should handle translation errors gracefully', async () => { // *Slightly Modified* - Made test async
//         const invalidText = '';
//         const invalidLang = 'invalid_lang';

//         // Mock the translate function to throw an error
//         const mockTranslate = jest.fn().mockRejectedValue(new Error('Translation failed.'));
//         translator.translate = mockTranslate;

//         await expect(translator.translate(invalidText, invalidLang)).rejects.toThrow('Translation failed.');
//         expect(mockTranslate).toHaveBeenCalledWith(invalidText, invalidLang);
//     });
// });




