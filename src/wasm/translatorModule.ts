// src/wasm/translatorModule.ts

export interface TranslatorModule {
    translate: (textPtr: number, langPtr: number, textLen: number, langLen: number) => number;
    memory: WebAssembly.Memory;
}

let cachedModule: TranslatorModule | null = null;

/**
 * Loads the WebAssembly translator module asynchronously.
 * Caches the module after the first load for subsequent uses.
 * @returns Promise resolving to the TranslatorModule
 */
export async function loadTranslatorModule(): Promise<TranslatorModule> {
    if (cachedModule) {
        return cachedModule;
    }

    const wasmResponse = await fetch('translator.wasm');
    const wasmBytes = await wasmResponse.arrayBuffer();
    const wasmModule = await WebAssembly.instantiate(wasmBytes);
    const wasm = wasmModule.instance.exports;

    const module: TranslatorModule = {
        translate: wasm.translate as any,
        memory: wasm.memory as WebAssembly.Memory,
    };

    cachedModule = module;
    return module;
}

/**
 * Utility function to convert a JavaScript string to WASM memory.
 * @param str The string to convert.
 * @param memory The WASM Memory object.
 * @returns An object containing the pointer and length of the string in WASM memory.
 */
export function encodeString(str: string, memory: WebAssembly.Memory): { ptr: number; len: number } {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    const len = encoded.length;

    const buffer = new Uint8Array(memory.buffer);
    const ptr = buffer.length;

    // Extend the buffer if necessary
    // Note: In a real scenario, you'd want to manage memory more carefully
    const newBuffer = new Uint8Array(buffer.length + len);
    newBuffer.set(buffer);
    newBuffer.set(encoded, buffer.length);
    // Normally, you'd write back to memory, but this is a placeholder

    return { ptr, len };
}