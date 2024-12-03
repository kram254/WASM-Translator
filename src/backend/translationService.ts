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

app.get('/', (req, res) => {
    res.send('Translation Service is running.');
});


app.post('/api/translate', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
        return res.status(400).json({ error: 'Missing required fields: text, sourceLang, targetLang' });
    }

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/facebook/m2m100_418M',
                {
                    inputs: text,
                    parameters: {                        
                        forced_bos_token_id: getLanguageId(targetLang)
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json',
                        'X-Source-Lang': getLanguageCode(sourceLang) 
                    }
                }
            );

            if (response.data.error) {
                if (response.data.error.includes('currently loading')) {
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 2000)); 
                    continue;
                }
                return res.status(500).json({ error: response.data.error });
            }

            const translatedText = response.data[0]?.translation_text || response.data[0]?.generated_text || 'Translation not available';

            // const translatedText = response.data[0]?.translation_text || response.data[0];
            return res.json({ translatedText });
        } catch (error: any) {
            console.error('Translation error:', error.response?.data || error.message);

            if (error.response?.data?.error?.includes('currently loading')) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                continue;
            }

            if (error.response?.data?.error?.includes('token')) {
                return res.status(401).json({ error: 'Invalid API token. Please check your HUGGINGFACE_API_KEY.' });
            }

            return res.status(500).json({ error: 'Translation failed' });
        }
    }

    return res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' });
});



function getLanguageId(language: string): number {
    
    const languageIds: Record<string, number> = {
        'turkmen': 128022,  
        'english': 128021, 
        'russian': 128019,  
        'ukrainian': 128020, 
        'chinese': 128023   
    };

    const id = languageIds[language.toLowerCase()];
    if (id === undefined) {
        throw new Error(`Language ID not found for: ${language}`);
    }
    return id;
}



function getLanguageCode(language: string): string {
    const languageCodes: Record<string, string> = {
        turkmen: 'tk',    
        english: 'en',
        russian: 'ru',
        ukrainian: 'uk',
        chinese: 'zh'
    };

    const code = languageCodes[language.toLowerCase()];
    if (!code) {
        throw new Error(`Unsupported language: ${language}`);
    }
    return code;
}


app.listen(PORT, () => {
    console.log(`Translation service is running on port ${PORT}`);
});