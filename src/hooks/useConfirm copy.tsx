// hooks/useConfirm.tsx
"use client";
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((result: boolean) => void) | undefined>(undefined);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleClose = (result: boolean) => {
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = undefined; // cleanup
    }
    setOptions(null);
  };

  const ConfirmModal = options
    ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {options.title || "Are you sure?"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {options.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleClose(false)}
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                {options.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => handleClose(true)}
                className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                {options.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return { confirm, ConfirmModal };
}




// const handleDelete = async () => {
//   const ok = await confirm({
//     title: "Delete Category",
//     message: "Are you sure you want to delete this category?",
//     confirmText: "Yes, Delete",
//     cancelText: "Cancel",
//   });

//   if (ok) {
//     // ✅ ইউজার Confirm করেছে, এখন delete কাজ করো
//     await deleteCategory(id);
//     toast.success("Category deleted!");
//   } else {
//     // ❌ ইউজার Cancel করেছে
//     console.log("User cancelled delete");
//   }
// };
