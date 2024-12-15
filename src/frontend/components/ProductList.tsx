import React, { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../utils/api';
import { translateTexts } from '../utils/translator';

// const targetLanguages = ['turkmen', 'english', 'russian', 'ukrainian'];
const targetLanguages = ['tr', 'en', 'ru', 'uk'];

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [translatedTitles, setTranslatedTitles] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('shoe'); // *jinx jinx* - Added search functionality

    useEffect(() => {
        const getProducts = async () => {
            console.log('*Debug* - Fetching products with searchText:', searchText); // *jinx jinx* - Modified debug log
            const fetchedProducts = await fetchProducts(searchText);
            console.log('*Debug* - Fetched Products:', fetchedProducts); // *jinx jinx* - Modified debug log
            setProducts(fetchedProducts);
        };
        getProducts();
    }, [searchText]);

    useEffect(() => {
        const translateProductTitles = async () => {
            if (products.length === 0) {
                console.log('*Debug* - No products to translate'); // *jinx jinx* - Modified debug log
                return;
            }

            setLoading(true);
            console.log('*Debug* - Translating product titles'); // *jinx jinx* - Modified debug log

            const titles = products.map(p => p.item.title);
            console.log('*Debug* - Product Titles:', titles); // *jinx jinx* - Modified debug log

            const translations = await translateTexts(titles, targetLanguages); // *jinx jinx* - Use updated translateTexts

            console.log('*Debug* - Translations:', translations); // *jinx jinx* - Modified debug log

            const translated: Record<string, Record<string, string>> = {};
            products.forEach((product, index) => {
                translated[product.item.itemIdStr] = translations[titles[index]];
            });
            setTranslatedTitles(translated);
            setLoading(false);
            console.log('*Debug* - Translated Titles:', translated); // *jinx jinx* - Modified debug log
        };

        translateProductTitles();
    }, [products]);

    return (
        <div className="product-list">
            <h2>Products</h2>
            {/* *jinx jinx* - Added search input */}
            <input 
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
            />
            {loading && <p>Translating titles...</p>}
            <ul>
                {products.map(product => (
                    <li key={product.item.itemIdStr}>
                        {/* *jinx jinx* - Updated product display structure */}
                        <img src={product.item.image} alt={product.item.title} />
                        <h3>{product.item.title}</h3>
                        <p>Price: ¥{product.item.sku.def.promotionPrice}</p>
                        <p>Store: {product.seller.storeTitle}</p>
                        <p>Shipping from: {product.delivery.shippingFrom}</p>
                        {translatedTitles[product.item.itemIdStr] && (
                            <div className="translations">
                                {Object.entries(translatedTitles[product.item.itemIdStr]).map(([lang, translatedText]) => (
                                    <p key={lang}><strong>{lang}:</strong> {translatedText}</p>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;





























// import React, { useEffect, useState } from 'react';
// import { fetchProducts, Product } from '../utils/api';
// import { translateTexts } from '../utils/translator';

// // const targetLanguages = ['turkmen', 'english', 'russian', 'ukrainian'];
// const targetLanguages = ['tr', 'en', 'ru', 'uk'];

// const ProductList: React.FC = () => {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [translatedTitles, setTranslatedTitles] = useState<Record<string, Record<string, string>>>({});
//     const [loading, setLoading] = useState(false);
//     const [searchText, setSearchText] = useState('shoe'); // *Modified* - Added search functionality

//     useEffect(() => {
//         const getProducts = async () => {
//             console.log('*Debug* - Fetching products with searchText:', searchText); // *Modified*
//             const fetchedProducts = await fetchProducts(searchText);
//             console.log('*Debug* - Fetched Products:', fetchedProducts); // *Modified*
//             setProducts(fetchedProducts);
//         };
//         getProducts();
//     }, [searchText]);

//     useEffect(() => {
//         const translateProductTitles = async () => {
//             if (products.length === 0) {
//                 console.log('*Debug* - No products to translate'); // *Modified*
//                 return;
//             }

//             setLoading(true);
//             console.log('*Debug* - Translating product titles'); // *Modified*

//             const titles = products.map(p => p.item.title);
//             console.log('*Debug* - Product Titles:', titles); // *Modified*

//             const translations = await translateTexts(titles, targetLanguages); // *Modified* - Use updated translateTexts

//             console.log('*Debug* - Translations:', translations); // *Modified*

//             const translated: Record<string, Record<string, string>> = {};
//             products.forEach((product, index) => {
//                 translated[product.item.itemIdStr] = translations[titles[index]];
//             });
//             setTranslatedTitles(translated);
//             setLoading(false);
//             console.log('*Debug* - Translated Titles:', translated); // *Modified*
//         };

//         translateProductTitles();
//     }, [products]);

//     return (
//         <div className="product-list">
//             <h2>Products</h2>
//             {/* *Modified* - Added search input */}
//             <input 
//                 type="text"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 placeholder="Search products..."
//             />
//             {loading && <p>Translating titles...</p>}
//             <ul>
//                 {products.map(product => (
//                     <li key={product.item.itemIdStr}>
//                         {/* *Modified* - Updated product display structure */}
//                         <img src={product.item.image} alt={product.item.title} />
//                         <h3>{product.item.title}</h3>
//                         <p>Price: ¥{product.item.sku.def.promotionPrice}</p>
//                         <p>Store: {product.seller.storeTitle}</p>
//                         <p>Shipping from: {product.delivery.shippingFrom}</p>
//                         {translatedTitles[product.item.itemIdStr] && (
//                             <div className="translations">
//                                 {Object.entries(translatedTitles[product.item.itemIdStr]).map(([lang, translatedText]) => (
//                                     <p key={lang}><strong>{lang}:</strong> {translatedText}</p>
//                                 ))}
//                             </div>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default ProductList;
















