import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../utils/api';
import { translateTexts } from '../utils/translator';

interface Product {
    id: number;
    title: string;
}

const targetLanguages = ['turkmen', 'english', 'russian', 'ukrainian'];

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [translatedTitles, setTranslatedTitles] = useState<Record<number, Record<string, string>>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            const fetchedProducts = await fetchProducts(50);
            setProducts(fetchedProducts);
        };
        getProducts();
    }, []);

    useEffect(() => {
        const translateProductTitles = async () => {
            setLoading(true);
            const titles = products.map(p => p.title);
            const translations = await translateTexts(titles, targetLanguages);
            const translated: Record<number, Record<string, string>> = {};
            products.forEach((product, index) => {
                translated[product.id] = translations[titles[index]];
            });
            setTranslatedTitles(translated);
            setLoading(false);
        };

        if (products.length > 0) {
            translateProductTitles();
        }
    }, [products]);

    return (
        <div className="product-list">
            <h2>Products</h2>
            {loading && <p>Translating titles...</p>}
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <h3>{product.title}</h3>
                        {translatedTitles[product.id] && (
                            <ul>
                                {Object.entries(translatedTitles[product.id]).map(([lang, translatedText]) => (
                                    <li key={lang}><strong>{lang}:</strong> {translatedText}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;