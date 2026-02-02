import { ProductType } from "@/Interfaces/productInterfaces";
import Link from "next/link";
import SafeImage from "../CommonComponents/SafeImage";

type Props = {
  product: ProductType;
};

const RelatedProductCard = ({ product }: Props) => {
  return (
    <Link href={`/shop/${product.slug}`} className="group border rounded-md p-2 hover:shadow-md transition">
      <div className="relative w-full h-36 overflow-hidden rounded">
        <SafeImage
          src={product.media?.[0]?.url || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition"
        />
      </div>

      <div className="mt-2">
        <h4 className="text-sm font-semibold line-clamp-2">{product.title}</h4>
        <div className="text-xs text-gray-500">{product.brand}</div>
        <div className="mt-1 text-sm font-bold text-red-600">
          ৳{product.price - (product.price * product.discount) / 100}
        </div>
        {product.discount > 0 && (
          <div className="text-xs text-gray-400 line-through">৳{product.price}</div>
        )}
      </div>
    </Link>
  );
};

export default RelatedProductCard;
