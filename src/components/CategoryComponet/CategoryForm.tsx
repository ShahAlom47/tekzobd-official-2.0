"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { useEffect } from "react";
import { iconOptions } from "@/utils/iconOptions";

interface Props {
  defaultValues?: Partial<CategoryType>;
  onSubmit: SubmitHandler<CategoryType>;
  submitText?: string;
  loading?: boolean;
  parentCategoryList?: CategoryType[]; // externally passed parent categories
}

const CategoryForm: React.FC<Props> = ({
  defaultValues = {},
  onSubmit,
  submitText = "Save",
  loading,
  parentCategoryList = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    // setValue,
    formState: { errors },
  } = useForm<CategoryType>({
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      parentCategory: null,
      ...defaultValues,
    },
  });

useEffect(() => {
  if (defaultValues && Object.keys(defaultValues).length > 0) {
    reset(defaultValues);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [defaultValues]);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block mb-1 text-sm font-medium">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="e.g., Electronics"
          className="my-input w-full"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block mb-1 text-sm font-medium">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          id="slug"
          {...register("slug", { required: "Slug is required" })}
          placeholder="e.g., electronics"
          className="my-input w-full"
        />
        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
      </div>

      {/* Icon */}
      <div>
        <label htmlFor="icon" className="block mb-1 text-sm font-medium">
          Icon <span className="text-gray-400">(Select from list)</span>
        </label>
        <select id="icon" {...register("icon")} className="my-input w-full">
          <option value="">Select icon</option>
          {iconOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Parent Category */}
      {parentCategoryList.length > 0 && (
        <div>
          <label htmlFor="parentCategory" className="block mb-1 text-sm font-medium">
            Parent Category <span className="text-gray-400">(optional)</span>
          </label>
          <select id="parentCategory" {...register("parentCategory")} className="my-input w-full">
            <option value="">None</option>
            {parentCategoryList.map((cat) => (
              <option key={cat._id?cat._id.toString():''} value={cat._id?cat._id.toString():''}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-base w-full">
        {loading ? "Processing..." : submitText}
      </button>
    </form>
  );
};

export default CategoryForm;
