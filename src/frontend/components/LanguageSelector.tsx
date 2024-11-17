import React from 'react';

interface Props {
    selectedLanguages: string[];
    setSelectedLanguages: (langs: string[]) => void;
}

const availableLanguages = ['turkmen', 'english', 'russian', 'ukrainian'];

const LanguageSelector: React.FC<Props> = ({ selectedLanguages, setSelectedLanguages }) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const selected: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelectedLanguages(selected);
    };

    return (
        <div className="language-selector">
            <label>Select Target Languages:</label>
            <select multiple value={selectedLanguages} onChange={handleChange}>
                {availableLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;