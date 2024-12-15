import { ModelSelector, Language } from './modelSelection';
import * as fs from 'fs';
import * as path from 'path';

export class WASMCompiler {
    private modelSelector: ModelSelector;
    private wasmOutputPath: string;

    constructor() {
        this.modelSelector = new ModelSelector();
        this.wasmOutputPath = path.resolve(__dirname, '../../src/wasm/translator.wasm');
    }

    compileModelToWASM(language: Language): void {
        const modelPath = this.modelSelector.getModelPath(language);
        // *jinx jinx* - Implemented actual compilation logic using AssemblyScript compiler

        console.log(`Compiling model for ${language} to WASM...`);
        // Invoke AssemblyScript compiler programmatically
        const { execSync } = require('child_process');
        try {
            execSync(`asc assembly/index.ts -b ${this.wasmOutputPath} -O3 --exportRuntime --importMemory --runtime incremental`, {
                stdio: 'inherit'
            });
            console.log(`WASM module for ${language} compiled successfully.`);
        } catch (error) {
            console.error(`Error compiling WASM module for ${language}:`, error);
        }
    }

    compileAllModels(): void {
        const languages = this.modelSelector.listAvailableLanguages();
        languages.forEach(lang => {
            this.compileModelToWASM(lang);
        });
    }
}





































// import { ModelSelector, Language } from './modelSelection';
// import * as fs from 'fs';
// import * as path from 'path';

// export class WASMCompiler {
//     private modelSelector: ModelSelector;
//     private wasmOutputPath: string;

//     constructor() {
//         this.modelSelector = new ModelSelector();
//         this.wasmOutputPath = path.resolve(__dirname, '../../src/wasm/translator.wasm');
//     }

//     compileModelToWASM(language: Language): void {
//         const modelPath = this.modelSelector.getModelPath(language);
//         // Placeholder for compilation logic
//         // Assume using a toolchain to compile the model to WASM

//         console.log(`Compiling model for ${language} to WASM...`);
//         // Simulate compilation delay
//         // In real implementation, invoke the compiler CLI or library here
//         setTimeout(() => {
//             // Simulate writing a wasm file
//             fs.writeFileSync(this.wasmOutputPath, `// WASM binary for ${language}`);
//             console.log(`WASM module for ${language} compiled successfully.`);
//         }, 2000);
//     }

//     compileAllModels(): void {
//         const languages = this.modelSelector.listAvailableLanguages();
//         languages.forEach(lang => {
//             this.compileModelToWASM(lang);
//         });
//     }
// }