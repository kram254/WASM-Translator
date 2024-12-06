export interface Product {
    item: {
        itemIdStr: string;
        title: string;
        image: string;
        sku: {
            def: {
                price: string;
                promotionPrice: string;
            }
        }
    };
    delivery: {
        shippingFrom: string;
    };
    seller: {
        storeTitle: string;
        storeType: string;
    };
}

// *Modified* - Updated fetchProducts to use the actual API
export const fetchProducts = async (searchText: string, pageNumber: string = "1", pageSize: string = "50"): Promise<Product[]> => {
    try {
        const response = await fetch("https://b9a3-20-56-141-57.ngrok-free.app/api/v1/search/text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                text: searchText,
                pageNumber,
                pageSize
            })
        });

        const data = await response.json();
        return data.result.resultList;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};