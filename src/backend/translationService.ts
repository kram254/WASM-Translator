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

app.get('/', (req, res) => {
    res.send('Translation Service is running.');
});


app.post('/api/translate', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
        return res.status(400).json({ error: 'Missing required fields: text, sourceLang, targetLang' });
    }

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/m2m100_418M',
            {
                inputs: text,
                parameters: {
                    forced_bos_token_id: getLanguageCode(targetLang)
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.error) {
            return res.status(500).json({ error: response.data.error });
        }

        const translatedText = response.data[0]?.translation_text;
        return res.json({ translatedText });
    } catch (error: any) {
        console.error('Translation error:', error.message);
        return res.status(500).json({ error: 'Translation failed' });
    }
});

function getLanguageCode(language: string): number {
    const languageCodes: Record<string, number> = {
        turkmen: 475,    
        english: 1,
        russian: 2,
        ukrainian: 3
    };

    return languageCodes[language.toLowerCase()] || 1; 
}

app.listen(PORT, () => {
    console.log(`Translation service is running on port ${PORT}`);
});