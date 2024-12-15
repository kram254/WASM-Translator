import React from 'react';
import Translator from './components/Translator';
import ProductList from './components/ProductList';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <h1>Product Translator</h1>
            <Translator />
            <ProductList />
        </div>
    );
};

export default App;
