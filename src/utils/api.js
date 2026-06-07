export const fetchNutritionalData = async (query) => {
  try {
    // Open Food Facts API
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      // Find the first product with some reasonable nutrient data
      const product = data.products.find(p => p.nutriments && Object.keys(p.nutriments).length > 0) || data.products[0];
      
      return {
        success: true,
        productName: product.product_name || query,
        nutriments: product.nutriments || {},
        image: product.image_url || null,
      };
    } else {
      return {
        success: false,
        error: "No nutritional information found for this item."
      };
    }
  } catch (error) {
    console.error("Error fetching nutritional data:", error);
    return {
      success: false,
      error: "Failed to connect to the nutritional database."
    };
  }
};