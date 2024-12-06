import React from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select'; // *Modified* - Imported MultiValue and ActionMeta from react-select

interface LanguageSelectorProps {
    selectedLanguages: string[];
    setSelectedLanguages: (languages: string[]) => void;
}

interface LanguageOption {
    value: string;
    label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguages, setSelectedLanguages }) => {
    /* *Modified* - Updated availableLanguages to match react-select format */
    const availableLanguages: LanguageOption[] = [
        { value: 'tr', label: 'Turkish' },
        { value: 'en', label: 'English' },
        { value: 'ru', label: 'Russian' },
        { value: 'uk', label: 'Ukrainian' }
    ];

    /* *Modified* - Updated handleChange to match react-select's expected types */
    const handleChange = (
        selectedOptions: MultiValue<LanguageOption>,
        actionMeta: ActionMeta<LanguageOption>
    ) => {
        const languages = selectedOptions.map(option => option.value);
        console.log('*Debug* - Selected Languages:', languages); // *Modified*
        setSelectedLanguages(languages);
    };

    return (
        <div className="language-selector">
            <label htmlFor="languages">Select Target Languages:</label>
            {/* *Modified* - Replaced native select with react-select dropdown */}
            <Select
                id="languages"
                isMulti
                options={availableLanguages}
                value={availableLanguages.filter(option => selectedLanguages.includes(option.value))}
                onChange={handleChange} // *Modified* - Updated onChange handler
                className="language-dropdown"
                placeholder="Select languages..."
            />
        </div>
    );
};

export default LanguageSelector;











// import React from 'react';
// import Select, { MultiValue, ActionMeta } from 'react-select'; // *Modified* - Imported MultiValue and ActionMeta from react-select

// interface LanguageSelectorProps {
//     selectedLanguages: string[];
//     setSelectedLanguages: (languages: string[]) => void;
// }

// interface LanguageOption {
//     value: string;
//     label: string;
// }

// const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguages, setSelectedLanguages }) => {
//     /* *Modified* - Updated availableLanguages to match react-select format */
//     const availableLanguages: LanguageOption[] = [
//         { value: 'tr', label: 'Turkish' },
//         { value: 'en', label: 'English' },
//         { value: 'ru', label: 'Russian' },
//         { value: 'uk', label: 'Ukrainian' }
//     ];

//     /* *Modified* - Updated handleChange to match react-select's expected types */
//     const handleChange = (
//         selectedOptions: MultiValue<LanguageOption>,
//         actionMeta: ActionMeta<LanguageOption>
//     ) => {
//         setSelectedLanguages(selectedOptions.map(option => option.value));
//     };

//     return (
//         <div className="language-selector">
//             <label htmlFor="languages">Select Target Languages:</label>
//             {/* *Modified* - Replaced native select with react-select dropdown */}
//             <Select
//                 id="languages"
//                 isMulti
//                 options={availableLanguages}
//                 value={availableLanguages.filter(option => selectedLanguages.includes(option.value))}
//                 onChange={handleChange} // *Modified* - Updated onChange handler
//                 className="language-dropdown"
//                 placeholder="Select languages..."
//             />
//         </div>
//     );
// };

// export default LanguageSelector;