import useSwr from "swr";

import type { ProductTypeList } from "@/types";

import ProductItem from "../../product-item";
import ProductsLoading from "./loading";

const ProductsContent = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSwr(
    "/api/products",
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  if (error) return <div>Failed to load users</div>;
  return (
    <>
      {!data && <ProductsLoading />}

      {data && (
        <section className="products-list">
          {data.map((item: ProductTypeList) => (
            <ProductItem
              id={item.id}
              name={item.name}
              price={item.price}
              colors={item.colors}
              sizes={item.sizes}
              category={item.category}
              quantityAvailable={item.quantityAvailable}
              currentPrice={item.currentPrice}
              discount={item.discount}
              punctuation={item.punctuation}
              reviews={item.reviews}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              key={item.id}
              images={item.images}
            />
          ))}
        </section>
      )}
    </>
  );
};

export default ProductsContent;
