import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { translateTexts } from '../utils/translator';

const Translator: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const handleTranslate = async () => {
        if (inputText.trim() === '' || targetLanguages.length === 0) return;
        const result = await translateTexts([inputText], targetLanguages);
        setTranslations(result[inputText]);
    };

    return (
        <div className="translator">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text in Chinese..."
            />
            <LanguageSelector selectedLanguages={targetLanguages} setSelectedLanguages={setTargetLanguages} />
            <button onClick={handleTranslate}>Translate</button>
            <div className="translations">
                {Object.entries(translations).map(([lang, text]) => (
                    <p key={lang}><strong>{lang}:</strong> {text}</p>
                ))}
            </div>
        </div>
    );
};

export default Translator;