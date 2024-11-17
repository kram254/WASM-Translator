export interface Product {
    id: number;
    title: string;
}

export const fetchProducts = async (limit: number): Promise<Product[]> => {
    // Placeholder for API call
    // Simulate fetching products
    const products: Product[] = [];
    for (let i = 1; i <= limit; i++) {
        products.push({
            id: i,
            title: `产品标题 ${i}` // "Product Title" in Chinese
        });
    }
    return new Promise(resolve => setTimeout(() => resolve(products), 1000));
};