"use client";

import { getSingleProduct, updateProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import ProductForm from "@/components/ProductForm";
import { ProductFormInput } from "@/Interfaces/productInterfaces";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductFormInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await getSingleProduct(id as string);
      if (res?.success) {
        setProduct(res.data as ProductFormInput);
      } else {
        toast.error("Product not found");
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleUpdate = async (data: ProductFormInput): Promise<{ success: boolean }> => {
    const res = await updateProduct(id as string, { ...data, _id: id as string });
    if (res?.success) {
      toast.success(res.message || "Product updated");
      return {success:true}
    } else {
      toast.error(res.message || "Failed to update");
    }
    return { success: !!res?.success };
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return <ProductForm onSubmit={handleUpdate} defaultData={product} mode="edit" />;
}
