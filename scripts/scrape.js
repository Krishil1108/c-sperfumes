const fs = require('fs');
const path = require('path');

async function scrapeProducts() {
  console.log("Fetching products from Bella Vita Organic...");
  try {
    const url = "https://bellavitaorganic.com/products.json?limit=50";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Fetched ${data.products.length} products successfully!`);

    // Filter and map to our custom perfume schema
    const rawProducts = data.products.filter(p => {
      const type = p.product_type ? p.product_type.toLowerCase() : "";
      const title = p.title.toLowerCase();
      return type.includes("perfume") || type.includes("attar") || type.includes("cologne") || title.includes("perfume") || title.includes("parfum") || title.includes("scent") || title.includes("luxury");
    });

    console.log(`Filtered down to ${rawProducts.length} perfume-related products.`);

    const perfumes = rawProducts.map((p, idx) => {
      // Find prices from variants
      const basePrice = parseFloat(p.variants[0]?.compare_at_price || p.variants[0]?.price || "599");
      const salePrice = parseFloat(p.variants[0]?.price || "399");
      const discount = basePrice > salePrice ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;

      // Extract notes from description if present, otherwise assign realistic notes
      const desc = p.body_html || "";
      const textDesc = desc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      let notes = ["Woody", "Spicy", "Amber"];
      if (textDesc.toLowerCase().includes("rose") || textDesc.toLowerCase().includes("floral") || textDesc.toLowerCase().includes("jasmine")) {
        notes = ["Floral", "Rose", "Jasmine"];
      } else if (textDesc.toLowerCase().includes("citrus") || textDesc.toLowerCase().includes("lemon") || textDesc.toLowerCase().includes("bergamot")) {
        notes = ["Citrus", "Bergamot", "Mandarin"];
      } else if (textDesc.toLowerCase().includes("ocean") || textDesc.toLowerCase().includes("aqua") || textDesc.toLowerCase().includes("fresh")) {
        notes = ["Aquatic", "Fresh", "Sea Breeze"];
      } else if (textDesc.toLowerCase().includes("vanilla") || textDesc.toLowerCase().includes("sweet") || textDesc.toLowerCase().includes("chocolate")) {
        notes = ["Sweet", "Vanilla", "Musk"];
      } else if (textDesc.toLowerCase().includes("wood") || textDesc.toLowerCase().includes("oud") || textDesc.toLowerCase().includes("sandalwood")) {
        notes = ["Woody", "Oud", "Sandalwood"];
      }

      // 1. Assign Premium Designer Brand
      let brand = "Ishaya Luxury Perfume";
      const titleLower = p.title.toLowerCase();
      if (titleLower.includes("sauvage") || titleLower.includes("joker") || idx % 6 === 0) {
        brand = "Dior";
      } else if (titleLower.includes("club") || titleLower.includes("cdn") || idx % 6 === 1) {
        brand = "Armaf";
      } else if (titleLower.includes("oud") || titleLower.includes("boise") || idx % 6 === 2) {
        brand = "Mancera";
      } else if (titleLower.includes("blue") || titleLower.includes("coco") || idx % 6 === 3) {
        brand = "Chanel";
      } else if (titleLower.includes("pure") || titleLower.includes("white") || idx % 6 === 4) {
        brand = "Afnan";
      }

      // 2. Assign Scent Concentration
      let concentration = "Eau De Parfum (EDP)";
      if (titleLower.includes("bar") || titleLower.includes("soap")) {
        concentration = "Bathing Bar";
      } else if (idx % 3 === 1) {
        concentration = "Eau De Toilette (EDT)";
      } else if (idx % 3 === 2) {
        concentration = "Extrait De Parfum";
      }

      // 3. Assign Gender Category
      let gender = "Unisex";
      if (titleLower.includes("women") || titleLower.includes("woman") || titleLower.includes("her") || titleLower.includes("rose")) {
        gender = "Women";
      } else if (titleLower.includes("men") || titleLower.includes("man") || titleLower.includes("him") || titleLower.includes("ceo")) {
        gender = "Men";
      }

      // 4. Assign Stock Status (85% In Stock, 15% Out of Stock)
      const inStock = idx % 7 !== 0;

      // Generate visual hotspot coordinate offsets
      const x = [30, 45, 60, 75][idx % 4];
      const y = [40, 50, 60, 70][idx % 4];

      return {
        id: p.id.toString(),
        title: p.title,
        brand: brand,
        concentration: concentration,
        gender: gender,
        inStock: inStock,
        slug: p.handle,
        description: textDesc.substring(0, 300) + (textDesc.length > 300 ? "..." : ""),
        category: p.product_type || "Luxury Perfume",
        notes: notes,
        price: basePrice,
        salePrice: salePrice,
        discount: discount,
        rating: parseFloat((4.2 + (idx % 8) * 0.1).toFixed(1)),
        reviewsCount: 124 + (idx * 37),
        image: p.images[0]?.src || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
        images: p.images.slice(0, 3).map(img => img.src),
        isBestseller: idx < 6,
        isNewArrival: idx >= 6 && idx < 12,
        hotspot: { x, y }
      };
    });

    const outputDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir);
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'mockProducts.json'), 
      JSON.stringify(perfumes, null, 2)
    );
    console.log(`Saved ${perfumes.length} parsed products to data/mockProducts.json!`);

  } catch (err) {
    console.error("Error scraping products:", err);
  }
}

scrapeProducts();
