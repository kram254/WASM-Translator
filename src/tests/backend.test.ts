import { ModelSelector, Language } from '../backend/modelSelection';
import fs from 'fs';
import path from 'path';


describe('ModelSelector', () => {
    const selector = new ModelSelector();

    beforeAll(() => {
        // Setup mock models directory
        const modelsPath = path.resolve(__dirname, '../../models'); // *jinx jinx* - Corrected path
        if (!fs.existsSync(modelsPath)) {
            fs.mkdirSync(modelsPath, { recursive: true });
        }

        const languages: Language[] = ['turkmen', 'english', 'russian', 'ukrainian'];

        languages.forEach(lang => {
            const modelDir = path.join(modelsPath, `chinese-to-${lang}-model`);
            if (!fs.existsSync(modelDir)) {
                fs.mkdirSync(modelDir);
                fs.writeFileSync(path.join(modelDir, 'model.bin'), `// Mock model for ${lang}`);
            }
        });
    });

    afterAll(() => {
        
        const modelsPath = path.resolve(__dirname, '../../models'); // *jinx jinx* - Corrected path
        fs.rmdirSync(modelsPath, { recursive: true });
    });


    it('should list available languages', () => {
        const languages = selector.listAvailableLanguages();
        expect(languages).toEqual(['turkmen', 'english', 'russian', 'ukrainian']);
    });

    // it('should list available languages', () => {
    //     const languages = selector.listAvailableLanguages();
    //     expect(languages).toEqual(['turkmen', 'english', 'russian', 'ukrainian']);
    // });

    it('should return correct model path', () => {
        const modelPath = selector.getModelPath('english');
        const expectedPath = path.join('chinese-to-english-model', 'model.bin');
        expect(modelPath).toContain(expectedPath); 
        expect(fs.existsSync(modelPath)).toBe(true);
    });

    it('should throw an error for unavailable language', () => {
        expect(() => selector.getModelPath('spanish' as Language)).toThrow('Model for language spanish not found.');
    });
});




























// import { ModelSelector, Language } from '../backend/modelSelection';
// import fs from 'fs';
// import path from 'path';

// describe('ModelSelector', () => {
//     const selector = new ModelSelector();

//     beforeAll(() => {
//         // Setup mock models directory
//         const modelsPath = path.resolve(__dirname, '../models');
//         if (!fs.existsSync(modelsPath)) {
//             fs.mkdirSync(modelsPath, { recursive: true });
//         }

//         const languages: Language[] = ['turkmen', 'english', 'russian', 'ukrainian'];

//         languages.forEach(lang => {
//             const modelDir = path.join(modelsPath, `chinese-to-${lang}-model`);
//             if (!fs.existsSync(modelDir)) {
//                 fs.mkdirSync(modelDir);
//                 fs.writeFileSync(path.join(modelDir, 'model.bin'), `// Mock model for ${lang}`);
//             }
//         });
//     });

//     afterAll(() => {
//         // Cleanup mock models directory
//         const modelsPath = path.resolve(__dirname, '../models');
//         fs.rmdirSync(modelsPath, { recursive: true });
//     });

//     it('should list available languages', () => {
//         const languages = selector.listAvailableLanguages();
//         expect(languages).toEqual(['turkmen', 'english', 'russian', 'ukrainian']);
//     });

//     it('should return correct model path', () => {
//         const modelPath = selector.getModelPath('english');
//         expect(modelPath).toContain('chinese-to-english-model/model.bin');
//         expect(fs.existsSync(modelPath)).toBe(true);
//     });

//     it('should throw an error for unavailable language', () => {
//         expect(() => selector.getModelPath('spanish' as Language)).toThrow('Model for language spanish not found.');
//     });
// });