import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

if (!HUGGINGFACE_API_KEY) {
    console.error('HUGGINGFACE_API_KEY is not set in .env file');
    process.exit(1);
}

// Added language code mappings for the mBART model
const LANGUAGE_CODES: { [key: string]: string } = {
    'tr': 'tr_TR',  // Turkish (closest to Turkmen)
    'en': 'en_XX',
    'ru': 'ru_RU',
    'uk': 'uk_UA',
    'zh': 'zh_CN'
};

// Defined supported language types
type SupportedLanguage = 'tr' | 'en' | 'ru' | 'uk' | 'zh';

app.get('/', (req, res) => {
    res.send('Translation Service is running.');
});

// Updated translation endpoint to handle short language codes with type safety
app.post('/api/translate', async (req, res) => {
    console.log('*Debug* - Received /api/translate request'); // *jinx jinx* - Modified debug log
    const { text, targetLang } = req.body;  // *jinx jinx* - Removed sourceLang requirement

    console.log('*Debug* - Request Body:', req.body); // *jinx jinx* - Modified debug log

    if (!text || !targetLang) {
        console.log('*Debug* - Missing required fields'); // *jinx jinx* - Modified debug log
        return res.status(400).json({ 
            error: 'Missing required fields: text, targetLang' 
        });
    }

    try {
        // Always use Chinese as source language
        const sourceCode = 'zh_CN';
        console.log('*Debug* - Source Language Code:', sourceCode); // *jinx jinx* - Modified debug log

        // Ensure targetLang is one of the supported languages
        const normalizedTargetLang = typeof targetLang === 'string' ? targetLang.toLowerCase() : '';
        const targetCode = LANGUAGE_CODES[normalizedTargetLang as SupportedLanguage]; // *jinx jinx* - Added type assertion

        console.log('*Debug* - Target Language Code:', targetCode); // *jinx jinx* - Modified debug log

        if (!targetCode) {
            console.log(`*Debug* - Unsupported target language: ${targetLang}`); // *jinx jinx* - Modified debug log
            return res.status(400).json({ 
                error: `Unsupported target language: ${targetLang}` 
            });
        }

        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                console.log(`*Debug* - Attempt ${retryCount + 1} to translate`); // *jinx jinx* - Modified debug log

                const response = await axios.post(
                    'https://api-inference.huggingface.co/models/facebook/mbart-large-50-many-to-many-mmt',
                    {
                        inputs: text,
                        parameters: {
                            src_lang: sourceCode,
                            tgt_lang: targetCode,
                            max_length: 400,
                            num_beams: 5,
                            length_penalty: 1.0
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`*Debug* - HuggingFace API response:`, response.data); // *jinx jinx* - Modified debug log

                if (response.data.error) {
                    if (response.data.error.includes('currently loading')) {
                        console.log('*Debug* - Model is loading, retrying...'); // *jinx jinx* - Modified debug log
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    console.log('*Debug* - HuggingFace API returned an error:', response.data.error); // *jinx jinx* - Modified debug log
                    return res.status(500).json({ error: response.data.error });
                }

                const translatedText = response.data[0]?.translation_text || 'Translation not available';
                console.log('*Debug* - Translated Text:', translatedText); // *jinx jinx* - Modified debug log
                return res.json({ translatedText });

            } catch (error: any) {
                console.error('*Debug* - Translation error:', error.response?.data || error.message); // *jinx jinx* - Modified debug log

                if (error.response?.data?.error?.includes('currently loading')) {
                    console.log('*Debug* - Model is loading, retrying...'); // *jinx jinx* - Modified debug log
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }

                if (error.response?.status === 401) {
                    console.log('*Debug* - Invalid API token'); // *jinx jinx* - Modified debug log
                    return res.status(401).json({ 
                        error: 'Invalid API token. Please check your HUGGINGFACE_API_KEY.' 
                    });
                }

                return res.status(500).json({ error: 'Translation failed' });
            }
        }

        console.log('*Debug* - Max retries reached, service unavailable'); // *jinx jinx* - Modified debug log
        return res.status(503).json({ 
            error: 'Service temporarily unavailable. Please try again later.' 
        });
    } catch (error: any) {
        console.error('*Debug* - Translation setup error:', error.message); // *jinx jinx* - Modified debug log
        return res.status(500).json({ error: 'Translation setup failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Translation service is running on port ${PORT}`);
});

































// import express from 'express';
// import axios from 'axios';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

// if (!HUGGINGFACE_API_KEY) {
//     console.error('HUGGINGFACE_API_KEY is not set in .env file');
//     process.exit(1);
// }

// // Added language code mappings for the mBART model
// const LANGUAGE_CODES: { [key: string]: string } = {
//     'tr': 'tr_TR',  // Turkish (closest to Turkmen)
//     'en': 'en_XX',
//     'ru': 'ru_RU',
//     'uk': 'uk_UA',
//     'zh': 'zh_CN'
// };

// // Defined supported language types
// type SupportedLanguage = 'tr' | 'en' | 'ru' | 'uk' | 'zh';

// app.get('/', (req, res) => {
//     res.send('Translation Service is running.');
// });

// // Updated translation endpoint to handle short language codes with type safety
// app.post('/api/translate', async (req, res) => {
//     console.log('*Debug* - Received /api/translate request'); // *Modified*
//     const { text, targetLang } = req.body;  // *Modified* - Removed sourceLang requirement

//     console.log('*Debug* - Request Body:', req.body); // *Modified*

//     if (!text || !targetLang) {
//         console.log('*Debug* - Missing required fields'); // *Modified*
//         return res.status(400).json({ 
//             error: 'Missing required fields: text, targetLang' 
//         });
//     }

//     try {
//         // Always use Chinese as source language
//         const sourceCode = 'zh_CN';
//         console.log('*Debug* - Source Language Code:', sourceCode); // *Modified*

//         // Ensure targetLang is one of the supported languages
//         const normalizedTargetLang = typeof targetLang === 'string' ? targetLang.toLowerCase() : '';
//         const targetCode = LANGUAGE_CODES[normalizedTargetLang as SupportedLanguage]; // *Modified* - Added type assertion

//         console.log('*Debug* - Target Language Code:', targetCode); // *Modified*

//         if (!targetCode) {
//             console.log(`*Debug* - Unsupported target language: ${targetLang}`); // *Modified*
//             return res.status(400).json({ 
//                 error: `Unsupported target language: ${targetLang}` 
//             });
//         }

//         const maxRetries = 3;
//         let retryCount = 0;

//         while (retryCount < maxRetries) {
//             try {
//                 console.log(`*Debug* - Attempt ${retryCount + 1} to translate`); // *Modified*

//                 const response = await axios.post(
//                     'https://api-inference.huggingface.co/models/facebook/mbart-large-50-many-to-many-mmt',
//                     {
//                         inputs: text,
//                         parameters: {
//                             src_lang: sourceCode,
//                             tgt_lang: targetCode,
//                             max_length: 400,
//                             num_beams: 5,
//                             length_penalty: 1.0
//                         }
//                     },
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );

//                 console.log(`*Debug* - HuggingFace API response:`, response.data); // *Modified*

//                 if (response.data.error) {
//                     if (response.data.error.includes('currently loading')) {
//                         console.log('*Debug* - Model is loading, retrying...'); // *Modified*
//                         retryCount++;
//                         await new Promise(resolve => setTimeout(resolve, 2000));
//                         continue;
//                     }
//                     console.log('*Debug* - HuggingFace API returned an error:', response.data.error); // *Modified*
//                     return res.status(500).json({ error: response.data.error });
//                 }

//                 const translatedText = response.data[0]?.translation_text || 'Translation not available';
//                 console.log('*Debug* - Translated Text:', translatedText); // *Modified*
//                 return res.json({ translatedText });

//             } catch (error: any) {
//                 console.error('*Debug* - Translation error:', error.response?.data || error.message); // *Modified*

//                 if (error.response?.data?.error?.includes('currently loading')) {
//                     console.log('*Debug* - Model is loading, retrying...'); // *Modified*
//                     retryCount++;
//                     await new Promise(resolve => setTimeout(resolve, 2000));
//                     continue;
//                 }

//                 if (error.response?.status === 401) {
//                     console.log('*Debug* - Invalid API token'); // *Modified*
//                     return res.status(401).json({ 
//                         error: 'Invalid API token. Please check your HUGGINGFACE_API_KEY.' 
//                     });
//                 }

//                 return res.status(500).json({ error: 'Translation failed' });
//             }
//         }

//         console.log('*Debug* - Max retries reached, service unavailable'); // *Modified*
//         return res.status(503).json({ 
//             error: 'Service temporarily unavailable. Please try again later.' 
//         });
//     } catch (error: any) {
//         console.error('*Debug* - Translation setup error:', error.message); // *Modified*
//         return res.status(500).json({ error: 'Translation setup failed' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Translation service is running on port ${PORT}`);
// });
