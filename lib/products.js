import products from "@/data/products.json";
import categories from "@/data/categories.json";
import combos from "@/data/combos.json";
import testimonials from "@/data/testimonials.json";

export function getAllProducts() { return products; }
export function getAllCategories() { return categories; }
export function getAllCombos() { return combos; }
export function getAllTestimonials() { return testimonials; }

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getProductsByCategory(catId) {
  return products.filter((p) => p.category === catId);
}

export function getReadyToCook() {
  return products.filter((p) => p.readyToCook);
}

export function getBestsellers() {
  return products.filter((p) => p.tags?.includes("bestseller"));
}

export function getAllRegions() {
  return Array.from(new Set(products.map((p) => p.region))).sort();
}
