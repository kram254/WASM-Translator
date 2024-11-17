export async function loadTranslatorModule(): Promise<any> {
    const wasm = await import('../wasm/translator.wasm');
    // Assuming the WASM exports a translate function
    return wasm;
}