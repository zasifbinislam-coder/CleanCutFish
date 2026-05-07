import { getAllCombos, getProductById } from "@/lib/products";
import CombosClient from "./CombosClient";

export const metadata = { title: "Combo Packs · CleanCutFish" };

export default function CombosPage() {
  const combos = getAllCombos().map((c) => ({
    ...c,
    items: c.items.map((it) => ({
      ...it,
      product: getProductById(it.productId),
    })),
  }));
  return <CombosClient combos={combos} />;
}
