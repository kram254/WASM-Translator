import { allocate, free } from "./memory";

// *Modified* - Updated constants with proper typing
const MAX_LENGTH: i32 = 400;
const PAD_TOKEN_ID: i32 = 1;
const BOS_TOKEN_ID: i32 = 0;
const EOS_TOKEN_ID: i32 = 2;
const VOCAB_SIZE: i32 = 250054;

// *Modified* - Added proper state management
let vocabularyData: Map<i32, string> | null = null;
let modelLoaded: bool = false;
let onnxSession: i32 = 0;

const LANGUAGE_CODES = new Map<string, i32>();
LANGUAGE_CODES.set("tr_TR", 250001);
LANGUAGE_CODES.set("en_XX", 250004);
LANGUAGE_CODES.set("ru_RU", 250020);
LANGUAGE_CODES.set("uk_UA", 250034);
    // Start of Selection
    LANGUAGE_CODES.set("zh_CN", 250052);
    
    declare function initializeOnnxRuntime(): i32;
    
    declare function loadOnnxModel(modelPtr: i32, modelLen: i32): i32;

    external("env", "runInference")
    export declare function runInference(
        sessionHandle: i32,
        inputIds: i32,
        attentionMask: i32,
        length: i32,
        targetLangId: i32
    ): i32;
    

// *Modified* - Added proper model loading with error handling
export function loadModel(modelPtr: i32, modelLen: i32): bool {
    if (modelLoaded) return true;
    
    const runtimeHandle = initializeOnnxRuntime();
    if (runtimeHandle <= 0) return false;
    
    onnxSession = loadOnnxModel(modelPtr, modelLen);
    if (onnxSession <= 0) return false;
    
    modelLoaded = true;
    return true;
}

export function loadVocab(vocabPtr: i32, vocabLen: i32): bool {
    const vocabBuffer = new Uint8Array(vocabLen);
    for (let i = 0; i < vocabLen; i++) {
        vocabBuffer[i] = load<u8>(vocabPtr + i);
    }
    
    try {
        vocabularyData = new Map<i32, string>();
        let currentPos: i32 = 0;
        
        while (currentPos < vocabLen) {
            // Read token ID (4 bytes)
            const tokenId = load<i32>(vocabPtr + currentPos);
            currentPos += 4;
            
            // Read string length (4 bytes)
            const strLen = load<i32>(vocabPtr + currentPos);
            currentPos += 4;
            
            // Read string data
            const strBytes = new Uint8Array(strLen);
            for (let i = 0; i < strLen; i++) {
                strBytes[i] = load<u8>(vocabPtr + currentPos + i);
            }
            currentPos += strLen;
            
            // Convert bytes to string and store in vocabulary
            if (tokenId >= 0 && tokenId < VOCAB_SIZE) {
                const token = String.UTF8.decode(strBytes.buffer);
                vocabularyData.set(tokenId, token);
            }
        }
        
        return true;
    } catch {
        vocabularyData = null;
        return false;
    }
}

// *Modified* - Added proper translation implementation
export function translate(
    textPtr: i32,
    textLen: i32,
    langPtr: i32,
    langLen: i32
): i32 {
    if (!modelLoaded || !vocabularyData || onnxSession <= 0) return 0;

    const textBytes = new Uint8Array(textLen);
    const langBytes = new Uint8Array(langLen);
    
    memory.copy(changetype<i32>(textBytes), textPtr, textLen);
    memory.copy(changetype<i32>(langBytes), langPtr, langLen);

    const inputText = String.UTF8.decode(textBytes.buffer);
    const targetLang = String.UTF8.decode(langBytes.buffer);

    const targetLangId = LANGUAGE_CODES.get(targetLang);
    if (targetLangId === null) return 0;

    const tokens = new Int32Array(MAX_LENGTH);
    const attentionMask = new Int32Array(MAX_LENGTH);
    
    // Initialize with padding
    tokens.fill(PAD_TOKEN_ID);
    attentionMask.fill(1);
    
    // Add BOS token
    tokens[0] = BOS_TOKEN_ID;
    
    // Tokenize input text (simplified character-based tokenization)
    let position: i32 = 1;
    for (let i = 0; i < inputText.length && position < MAX_LENGTH - 1; i++) {
        const charCode = inputText.charCodeAt(i);
        tokens[position++] = charCode;
    }
    
    // Add EOS token
    tokens[position] = EOS_TOKEN_ID;

    const resultPtr = runInference(
        onnxSession,
        changetype<i32>(tokens),
        changetype<i32>(attentionMask),
        position + 1,
        targetLangId
    );

    return resultPtr;
}

// *Modified* - Added proper memory cleanup
export function cleanup(): void {
    vocabularyData = null;
    modelLoaded = false;
    if (onnxSession > 0) {
        // Cleanup ONNX session
        onnxSession = 0;
    }
}



























// import { allocate, free } from "./memory";

// // Constants for the translation model
// const MAX_LENGTH: i32 = 400;
// const PAD_TOKEN_ID: i32 = 1;
// const BOS_TOKEN_ID: i32 = 0;
// const EOS_TOKEN_ID: i32 = 2;
// const VOCAB_SIZE: i32 = 250054;  // mBART-50 vocabulary size

// // *Modified* - Added vocabulary storage
// let vocabularyData: Map<i32, string> | null = null;
// let modelLoaded: bool = false;

// // Language code mappings using AssemblyScript types
// const LANGUAGE_CODES = new Map<string, i32>();
// LANGUAGE_CODES.set("tr_TR", 250001); // Turkish
// LANGUAGE_CODES.set("en_XX", 250004); // English
// LANGUAGE_CODES.set("ru_RU", 250020); // Russian
// LANGUAGE_CODES.set("uk_UA", 250034); // Ukrainian
// LANGUAGE_CODES.set("zh_CN", 250052); // Chinese

// // *Modified* - Added model loading function
// export function loadModel(modelPtr: i32, modelLen: i32): void {
//     // Initialize ONNX runtime with model data
//     initializeOnnxRuntime();
//     const modelBuffer = new Uint8Array(modelLen);
//     for (let i = 0; i < modelLen; i++) {
//         modelBuffer[i] = load<u8>(modelPtr + i);
//     }
//     loadOnnxModel(changetype<i32>(modelBuffer), modelLen);
//     modelLoaded = true;
// }

// // *Modified* - Added vocabulary loading function
// export function loadVocab(vocabPtr: i32, vocabLen: i32): void {
//     const vocabBuffer = new Uint8Array(vocabLen);
//     for (let i = 0; i < vocabLen; i++) {
//         vocabBuffer[i] = load<u8>(vocabPtr + i);
//     }
//     const vocabJson = String.UTF8.decode(vocabBuffer.buffer);
//     vocabularyData = new Map<i32, string>();
//     const vocab = JSON.parse<Map<string, i32>>(vocabJson);
//     vocab.forEach((value: i32, key: string) => {
//         vocabularyData!.set(value, key);
//     });
// }

// // *Modified* - Added model status check
// export function isModelLoaded(): bool {
//     return modelLoaded && vocabularyData !== null;
// }

// @external("env", "initializeOnnxRuntime")
// declare function initializeOnnxRuntime(): void;

// @external("env", "loadOnnxModel")
// declare function loadOnnxModel(modelPtr: i32, modelLen: i32): void;

// @external("env", "runInference")
// declare function runInference(
//     inputIds: i32,
//     attentionMask: i32,
//     length: i32,
//     targetLangId: i32
// ): i32;

// // *Modified* - Updated translation function with proper tokenization
// export function translate(
//     textPtr: i32,
//     textLen: i32,
//     langPtr: i32,
//     langLen: i32
// ): i32 {
//     if (!modelLoaded || !vocabularyData) {
//         return 0;
//     }

//     // Get input text and language
//     const textBytes = new Uint8Array(textLen);
//     const langBytes = new Uint8Array(langLen);
    
//     for (let i = 0; i < textLen; i++) {
//         textBytes[i] = load<u8>(textPtr + i);
//     }
//     for (let i = 0; i < langLen; i++) {
//         langBytes[i] = load<u8>(langPtr + i);
//     }

//     const inputText = String.UTF8.decode(textBytes.buffer);
//     const targetLang = String.UTF8.decode(langBytes.buffer);

//     // Tokenize input text
//     const tokens = tokenize(inputText);
//     const attentionMask = new Array<i32>(MAX_LENGTH).fill(1);
    
//     // Get target language ID
//     const targetLangId = LANGUAGE_CODES.get(targetLang);
//     if (targetLangId === null) {
//         return 0;
//     }

//     // Run inference
//     const outputPtr = runInference(
//         changetype<i32>(tokens),
//         changetype<i32>(attentionMask),
//         tokens.length,
//         targetLangId
//     );

//     if (outputPtr <= 0) {
//         return 0;
//     }

//     // Decode output tokens
//     const output = decodeTokens(outputPtr);
//     const resultBytes = String.UTF8.encode(output);
//     const resultPtr = allocate(resultBytes.byteLength + 1) as i32;
    
//     memory.copy(resultPtr, changetype<i32>(resultBytes), resultBytes.byteLength);
//     store<u8>(resultPtr + resultBytes.byteLength, 0);

//     return resultPtr;
// }

// // *Modified* - Added tokenization function
// function tokenize(text: string): Int32Array {
//     const tokens = new Int32Array(MAX_LENGTH);
//     tokens.fill(PAD_TOKEN_ID);
//     tokens[0] = BOS_TOKEN_ID;
    
//     // Simple character-based tokenization for now
//     let position: i32 = 1;
//     for (let i = 0; i < text.length && position < MAX_LENGTH - 1; i++) {
//         const char = text.charAt(i);
//         const tokenId = getTokenId(char);
//         tokens[position++] = tokenId;
//     }
    
//     tokens[position] = EOS_TOKEN_ID;
//     return tokens;
// }

// // *Modified* - Added token decoding function
// function decodeTokens(outputPtr: i32): string {
//     const length = load<i32>(outputPtr);
//     const tokens = new Int32Array(length);
    
//     for (let i = 0; i < length; i++) {
//         tokens[i] = load<i32>(outputPtr + 4 + i * 4);
//     }

//     let result = "";
//     for (let i = 0; i < length; i++) {
//         const token = tokens[i];
//         if (token !== PAD_TOKEN_ID && token !== BOS_TOKEN_ID && token !== EOS_TOKEN_ID) {
//             const word = vocabularyData!.get(token);
//             if (word !== null) {
//                 result += word;
//             }
//         }
//     }

//     return result;
// }

// export function freeMemory(ptr: i32): void {
//     if (ptr != 0) {
//         free(ptr);
//     }
// }


































