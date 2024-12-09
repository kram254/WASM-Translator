import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { translateTexts } from '../utils/translator';

const Translator: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        console.log('*Debug* - Translate button clicked'); // *Modified*
        console.log('*Debug* - Input Text:', inputText);     // *Modified*
        console.log('*Debug* - Target Languages:', targetLanguages); // *Modified*

        if (inputText.trim() === '' || targetLanguages.length === 0) {
            console.log('*Debug* - Translation aborted: Empty input or no target languages'); // *Modified*
            return;
        }
        setIsLoading(true); 
        setError(null);     

        try {
            const result = await translateTexts([inputText], targetLanguages, 'zh'); // *Modified* - Use updated translateTexts with source language
            console.log('*Debug* - Translation result:', result); // *Modified*
            setTranslations(result[inputText]);
        } catch (err: any) {
            console.error('*Debug* - Translation error:', err); // *Modified*
            setError('An error occurred during translation.');
        } finally {
            setIsLoading(false); 
            console.log('*Debug* - Translation process completed'); // *Modified*
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