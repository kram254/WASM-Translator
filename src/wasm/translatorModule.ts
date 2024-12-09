export interface TranslatorModule {
    /**
     * *Slightly Modified* - Translates the input text to the specified target language using Argos Translate via Pyodide.
     * @param text The text to translate.
     * @param targetLang The target language code (e.g., 'en' for English).
     * @returns The translated text.
     */
    translate: (text: string, targetLang: string) => Promise<string>; // *Slightly Modified* - Changed method signature
}

let pyodide: any = null;
let loaded: boolean = false;

/**
 * *Slightly Modified* - Loads Pyodide and installs Argos Translate for offline translations.
 */
export async function loadTranslatorModule(): Promise<TranslatorModule> {
    if (loaded && pyodide) {
        return {
            translate
        };
    }

    // Load Pyodide
    pyodide = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
    });

    // Load micropip for installing Python packages
    await pyodide.loadPackage('micropip');

    // Install Argos Translate and its dependencies
    await pyodide.runPythonAsync(`
import micropip
await micropip.install('argos-translate')
await micropip.install('sentencepiece')  # Dependency for Argos Translate
import argostranslate.package
import argostranslate.translate

# Function to install specific language packages if not already installed
def install_language_package(from_code, to_code):
    packages = argostranslate.package.get_available_packages()
    for package in packages:
        if package.from_code == from_code and package.to_code == to_code:
            package.install()
            return

# Example: Install Chinese to English package
install_language_package('zh', 'en')
`);

    loaded = true;

    return {
        translate
    };
}

/**
 * *Slightly Modified* - Translates text using Argos Translate via Pyodide.
 * @param text The text to translate.
 * @param targetLang The target language code (e.g., 'en' for English).
 * @returns The translated text.
 */
async function translate(text: string, targetLang: string): Promise<string> {
    try {
        // Escape backticks, backslashes, and dollar signs to prevent issues in the Python string
        const escapedText = text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        const translated = await pyodide.runPythonAsync(`
from argostranslate import translate

# Get installed languages
installed_languages = translate.get_installed_languages()
from_lang = next(lang for lang in installed_languages if lang.code == "zh")
to_lang = next(lang for lang in installed_languages if lang.code == "${targetLang}")

# Perform translation
translation = from_lang.get_translation(to_lang)
result = translation.translate("${escapedText}")
result
`);
        return translated;
    } catch (error: any) {
        console.error('*Debug* - Translation error:', error);
        throw new Error('Translation failed.');
    }
}








































// export interface TranslatorModule {
//     translate: (textPtr: number, langPtr: number, textLen: number, langLen: number) => number;
//     loadModel: (modelPtr: number, modelLen: number) => void;
//     loadVocab: (vocabPtr: number, vocabLen: number) => void;
//     isModelLoaded: () => boolean;
//     freeMemory: (ptr: number) => void;
//     memory: WebAssembly.Memory;
// }

// let cachedModule: TranslatorModule | null = null;
// let modelLoaded = false;

// async function loadModelData(): Promise<ArrayBuffer> {
//     const modelResponse = await fetch('/models/mbart-50-many-to-many.onnx');
//     if (!modelResponse.ok) {
//         throw new Error(`Failed to load model: ${modelResponse.statusText}`);
//     }
//     return modelResponse.arrayBuffer();
// }

// async function loadVocabularyData(): Promise<ArrayBuffer> {
//     const vocabResponse = await fetch('/models/mbart-50-vocab.json');
//     if (!vocabResponse.ok) {
//         throw new Error(`Failed to load vocabulary: ${vocabResponse.statusText}`);
//     }
//     return vocabResponse.arrayBuffer();
// }

// export async function loadTranslatorModule(): Promise<TranslatorModule> {
//     if (cachedModule && modelLoaded) {
//         return cachedModule;
//     }

//     try {
//         const [wasmResponse, modelData, vocabData] = await Promise.all([
//             fetch('translator.wasm'),
//             loadModelData(),
//             loadVocabularyData()
//         ]);

//         if (!wasmResponse.ok) {
//             throw new Error(`Failed to load WASM module: ${wasmResponse.statusText}`);
//         }

//         const wasmBytes = await wasmResponse.arrayBuffer();
//         const wasmModule = await WebAssembly.instantiate(wasmBytes, {
//             env: {
//                 memory: new WebAssembly.Memory({ 
//                     initial: 256,
//                     maximum: 512,
//                     shared: true
//                 }),
//                 abort: (msg: number, file: number, line: number, column: number) => {
//                     console.error(`Abort called from WASM: ${msg} at ${file}:${line}:${column}`);
//                     throw new Error('WASM execution aborted');
//                 }
//             }
//         });

//         const wasm = wasmModule.instance.exports;
        
//         const module: TranslatorModule = {
//             translate: wasm.translate as any,
//             loadModel: wasm.loadModel as any,
//             loadVocab: wasm.loadVocab as any,
//             isModelLoaded: wasm.isModelLoaded as any,
//             freeMemory: wasm.freeMemory as any,
//             memory: wasm.memory as WebAssembly.Memory,
//         };

//         const modelBuffer = new Uint8Array(modelData);
//         const vocabBuffer = new Uint8Array(vocabData);

//         const modelPtr = allocateWasmMemory(module.memory, modelBuffer);
//         const vocabPtr = allocateWasmMemory(module.memory, vocabBuffer);

//         module.loadModel(modelPtr, modelBuffer.length);
//         module.loadVocab(vocabPtr, vocabBuffer.length);

//         module.freeMemory(modelPtr);
//         module.freeMemory(vocabPtr);

//         modelLoaded = true;
//         cachedModule = module;
//         return module;
//     } catch (error) {
//         console.error('Failed to load translator module:', error);
//         throw error;
//     }
// }

// export function encodeString(str: string, memory: WebAssembly.Memory): { ptr: number; len: number } {
//     const encoder = new TextEncoder();
//     const encoded = encoder.encode(str);
//     const ptr = allocateWasmMemory(memory, encoded);
//     return { ptr, len: encoded.length };
// }

// function allocateWasmMemory(memory: WebAssembly.Memory, data: Uint8Array): number {
//     const memoryBuffer = new Uint8Array(memory.buffer);
//     let ptr = 0;
    
//     // Find free memory (simple allocation strategy)
//     while (ptr < memoryBuffer.length) {
//         if (memoryBuffer[ptr] === 0) {
//             let free = true;
//             for (let i = 0; i < data.length; i++) {
//                 if (memoryBuffer[ptr + i] !== 0) {
//                     free = false;
//                     break;
//                 }
//             }
//             if (free) {
//                 memoryBuffer.set(data, ptr);
//                 return ptr;
//             }
//         }
//         ptr++;
//     }
    
//     throw new Error('Out of memory');
// }


















