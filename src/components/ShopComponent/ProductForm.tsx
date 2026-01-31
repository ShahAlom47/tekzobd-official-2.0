"use client";

import { CategorySelect } from "@/components/CategorySelect";
import DashPageTitle from "@/components/DashPageTitle";
import MediaManager from "@/components/MediaManager";
import {
  MediaItem,
  ProductFormInput,
  ProductType,
} from "@/Interfaces/productInterfaces";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { SelectBrand } from "./SelectBrand";
import ColorSelect from "./ColorSelect";
import DiscountDisplay from "./DiscountCalculator";

interface ProductFormProps {
  onSubmit: (data: ProductType) => Promise<{ success: boolean }>;
  defaultData?: Partial<ProductType>;
  mode?: "add" | "edit";
}

const formatDateForInput = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  defaultData = {},
  mode = "add",
}) => {
  const router = useRouter();

  // Prepare default offer with proper date format for date inputs
  const defaultOffer = defaultData.offer
    ? {
        ...defaultData.offer,
        startDate: formatDateForInput(defaultData.offer.startDate),
        endDate: formatDateForInput(defaultData.offer.endDate),
      }
    : { isActive: false, startDate: "", endDate: "" };

  const { register, handleSubmit, setValue, reset, control, watch } =
    useForm<ProductFormInput>({
      defaultValues: {
        title: "",
        slug: "",
        description: "",
        price: 0,
        colors: [], // ✅ এখানে add করো
        stock: 0,
        brand: "",
        media: [],
        categoryId: "",
        isPublished: false,
        discount: 0,
        offer: defaultOffer,
        sourceInfo: {
          sourceType: "dropship",
          supplierName: "Easy_drop",
          productSourceLink: "",
          supplierProductId: "",
          deliveryTime: "",
          shippingCost: 0,
          returnPolicy: "",
          commissionRate: 0,
          externalStock: false,
        },
        ...defaultData,
      },
    });

  React.useEffect(() => {
    if (mode === "edit" && defaultData) {
      reset({
        ...defaultData,
        offer: defaultOffer, // make sure dates are formatted
      });
    }
  }, [defaultData, mode, reset]);

  const isOfferActive = watch("offer.isActive");
  const price = watch("price") || 0;
  const discount = watch("discount") || 0;

  const handleFormSubmit: SubmitHandler<ProductFormInput> = async (data) => {
    if (!data.media || data.media.length === 0) {
      toast.error("At least one media item is required");
      return;
    }

    if (!data.title || !data.slug || !data.description || !data.categoryId) {
      toast.error("All required fields must be filled");
      return;
    }
    if (data.offer?.isActive) {
      data.offer.startDate = data.offer.startDate
        ? new Date(data.offer.startDate).toISOString()
        : "";
      data.offer.endDate = data.offer.endDate
        ? new Date(data.offer.endDate).toISOString()
        : "";
    }
    if (data.stock !== undefined) {
      data.stock = Number(data.stock);
      if (isNaN(data.stock)) {
        data.stock = 0;
      }
    }
    const submitData =
      mode === "edit" && defaultData && (defaultData as ProductType)._id
        ? { ...data, _id: (defaultData as ProductType)._id }
        : data;

    const res = await onSubmit(submitData as ProductType);

    if (mode === "add" && res?.success) {
      reset();
    }
    if (mode === "edit" && res?.success) {
      router?.push("/dashboard/manageProducts");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w mx-auto p-6 space-y-6"
    >
      <DashPageTitle>
        {mode === "edit" ? "✏️ Edit Product" : "➕ Add New Product"}
      </DashPageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Product Title</label>
          <input
            {...register("title", { required: true })}
            className="my-input w-full"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Slug</label>
          <input
            {...register("slug", { required: true })}
            className="my-input w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="my-input w-full min-h-20"
          />
        </div>

        <div className="">
          <label className="block mb-1 text-sm">Price</label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="my-input w-full"
          />
        </div>
        <div className=" flex flex-col md:flex-row  justify-between ">
          <div>
            <label className="block mb-1 text-sm">Discount (%)</label>
            <input
              type="number"
              {...register("discount")}
              className="my-input w-full"
            />
          </div>
          {/* Display discount calculation */}
          <DiscountDisplay price={price} discountPercent={discount} />
        </div>

        <div>
          <label className="block mb-1 text-sm">Brand</label>
          <SelectBrand control={control} name="brand" />
        </div>
        <div>
          <label className="block mb-1 text-sm">Stock</label>
          <input
            type="number"
            {...register("stock", { required: true })}
            className="my-input w-full"
          />
        </div>
        {/* Category  */}
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <CategorySelect<ProductFormInput>
            control={control}
            name="categoryId"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm">Colors</label>
        <ColorSelect
          selectedColors={watch("colors") || []}
          onChange={(colors) => setValue("colors", colors)}
        />
      </div>

      <MediaManager
        folderName="products"
        defaultMedia={mode === "edit" ? watch("media") : []}
        onChange={(media: MediaItem[]) => setValue("media", media)}
        dataId={mode === "edit" ? defaultData?._id : ""}
        mediaCategory={"productMedia"}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("isPublished")}
          className="w-5 h-5"
        />
        <label className="font-medium">Publish Product?</label>
      </div>

      {/* ✅ Offer Section */}
      <div className="border p-4 rounded-md space-y-3  my-input">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("offer.isActive")}
            className="w-5 h-5"
          />
          <label className="font-medium">Activate Offer?</label>
        </div>

        {isOfferActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Offer Start Date</label>
              <input
                type="date"
                {...register("offer.startDate")}
                className="my-input w-full bg-grayLight"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Offer End Date</label>
              <input
                type="date"
                {...register("offer.endDate")}
                className="my-input w-full bg-grayLight"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm">Product Source</label>
        <select
          {...register("sourceInfo.sourceType", { required: true })}
          className="my-input w-full"
        >
          <option value="dropship">Dropship</option>
          <option value="self">Own Product</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...register("sourceInfo.supplierName")}
          placeholder="Supplier Name"
          className="my-input w-full"
        />
        <input
          {...register("sourceInfo.productSourceLink")}
          placeholder="Source Link"
          className="my-input w-full"
        />
        <input
          {...register("sourceInfo.supplierProductId")}
          placeholder="Supplier Product ID"
          className="my-input w-full"
        />
        <input
          {...register("sourceInfo.deliveryTime")}
          placeholder="Delivery Time"
          className="my-input w-full"
        />

        <div className="flex items-center gap-2">
          <label className=" w-full min-w-2">Shipping Cost :</label>
          <input
            type="number"
            {...register("sourceInfo.shippingCost")}
            placeholder="Shipping Cost"
            className="my-input w-full"
          />
        </div>
        <input
          {...register("sourceInfo.returnPolicy")}
          placeholder="Return Policy"
          className="my-input w-full"
        />

        <div className="flex items-center gap-2">
          <label className=" w-full min-w-2">Commission Rate :</label>
          <input
            type="number"
            step="0.01"
            {...register("sourceInfo.commissionRate")}
            placeholder="Commission Rate"
            className="my-input w-full "
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("sourceInfo.externalStock")}
            className="w-5 h-5"
          />
          <label>External Stock?</label>
        </div>
      </div>

      <button type="submit" className="btn-base">
        {mode === "edit" ? "✅ Update Product" : "✅ Submit Product"}
      </button>
    </form>
  );
};

export default ProductForm;
