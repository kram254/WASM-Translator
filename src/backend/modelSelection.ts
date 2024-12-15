import fs from 'fs';
import path from 'path';

export type Language = 'turkmen' | 'english' | 'russian' | 'ukrainian';

export class ModelSelector {
    private modelsPath: string;

    constructor() {
        this.modelsPath = path.resolve(__dirname, '../../models');
    }

    getModelPath(language: Language): string {
        const modelDir = path.join(this.modelsPath, `chinese-to-${language}-model`);
        if (!fs.existsSync(modelDir)) {
            throw new Error(`Model for language ${language} not found.`);
        }
        // Assuming model.bin is the model file
        return path.join(modelDir, 'model.bin');
    }

    listAvailableLanguages(): Language[] {
        const dirs = fs.readdirSync(this.modelsPath);
        return dirs.map(dir => {
            const match = dir.match(/chinese-to-(\w+)-model/);
            if (match && match[1]) {
                return match[1] as Language;
            }
            return null;
        }).filter(lang => lang !== null) as Language[];
    }
}
