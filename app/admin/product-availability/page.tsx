import { getAllProducts } from "./manage-products";
import ProductListClient from "./product-list-client";

export default async function ProductAvailabilityPage() {
  // Fetch data directly from the server-side function
  const products = await getAllProducts();
    return <ProductListClient initialProducts={products} />;
}

