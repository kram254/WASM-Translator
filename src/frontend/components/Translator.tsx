import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { translateTexts } from '../utils/translator';

const Translator: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); // *Modified* - Add error state

    const handleTranslate = async () => {
        if (inputText.trim() === '' || targetLanguages.length === 0) return;
        setIsLoading(true); // *Modified*
        setError(null);     // *Modified*
        try {
            const result = await translateTexts([inputText], targetLanguages);
            setTranslations(result[inputText]);
        } catch (err: any) {
            setError('An error occurred during translation.');
        } finally {
            setIsLoading(false); // *Modified*
        }
    };

    return (
        <div className="translator">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text in Chinese..."
            />
            <LanguageSelector selectedLanguages={targetLanguages} setSelectedLanguages={setTargetLanguages} />
            <button onClick={handleTranslate} disabled={isLoading}>Translate</button> {/* *Modified* */}
            {isLoading && <p>Translating...</p>} {/* *Modified* */}
            {error && <p className="error">{error}</p>} {/* *Modified* */}
            <div className="translations">
                {Object.entries(translations).map(([lang, text]) => (
                    <p key={lang}><strong>{lang}:</strong> {text}</p>
                ))}
            </div>
        </div>
    );
};

export default Translator;