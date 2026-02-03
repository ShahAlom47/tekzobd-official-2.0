import { ProductType } from "@/Interfaces/productInterfaces";
import { IoLogoWhatsapp } from "react-icons/io5";
interface Props {
  product: ProductType;
  discountedPrice?: number;
}

const ProductWhatsAppButton = ({ product, discountedPrice }: Props) => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // তোমার WhatsApp নাম্বার
  const productLink =
    typeof window !== "undefined" ? window.location.href : "";

  // শুধু message encode হবে, পুরো URL না
  const message = `Hi! I'm interested in this product:
Product Name: ${product.title}
Price: ৳${product.price}
Discount Price: ৳${discountedPrice || "N/A"}
Link: ${productLink}`;

  // ✅ একবারই encode করো, পুরো wa.me URL নয়
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className=" text-green-600 px-2 py-1 rounded-md flex items-center justify-center gap-2 hover:border border-green-700 transition"
    >
      <IoLogoWhatsapp className="text-xl" />
    </a>
  );
};

export default ProductWhatsAppButton;
