import ShopClient from "./ShopClient";
import { getAllProducts, getAllCategories, getAllRegions } from "@/lib/products";

export const metadata = { title: "Shop · CleanCutFish" };

export default function ShopPage() {
  return (
    <ShopClient
      products={getAllProducts()}
      categories={getAllCategories()}
      regions={getAllRegions()}
    />
  );
}
