import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Column<T> = {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
  isSummary?: boolean;
};

type TableProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

export function CustomTable<T extends object>({
  columns,
  data,
  className = "",
}: TableProps<T>) {
  const [openRows, setOpenRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const summaryColumn = columns.find((col) => col.isSummary) || columns[0];
  const detailColumns = columns.filter((col) => col !== summaryColumn);

  const getValue = (
    row: T,
    accessor: keyof T | string,
    render?: (row: T) => React.ReactNode
  ) => {
    if (render) return render(row);
    const value = typeof accessor === "string" && accessor in row
      ? (row as T)[accessor as keyof T]
      : (row as Record<string, unknown>)[accessor as string];
    if (React.isValidElement(value)) return value;
    if (typeof value === "object" && value !== null) return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className={`w-full bg-gray-200/15   ${className} `}>
      {/*  Desktop Table */}
      <div className="hidden md:block overflow-x-auto ">
        <table className="min-w-full  rounded-md overflow-hidden bg-transparent">
          <thead className="  bg-grayLight text-black   ">
            <tr className=" ">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="p-3 mb-2  font-semibold shadow-md shadow-black   text-center "
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="   ">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="   py-2  shadow-sm shadow-slate-700 border-b-2"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="p-1 text-center shadow-sm shadow-blue-400"
                    >
                      {getValue(row, col.accessor, col.render)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-3 text-center text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Accordion */}
      <div className="block md:hidden space-y-3">
        {data.length > 0 ? (
          data.map((row, rowIndex) => {
            const isOpen = openRows.includes(rowIndex);
            return (
              <div
                key={rowIndex}
                className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
              >
                <button
                  onClick={() => toggleRow(rowIndex)}
                  className="w-full flex items-center justify-between gap-3 text-left px-4 py-3  bg-gray-300"
                >
                  {getValue(row, summaryColumn.accessor, summaryColumn.render)}
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 bg-gray-200 text-black"
                    >
                      <div className="py-2 space-y-2">
                        {detailColumns.map((col, colIdx) => (
                          <div
                            key={colIdx}
                            className="flex justify-between border-b pb-1 last:border-b-0"
                          >
                            <span className="font-medium ">
                              {col.header}
                            </span>
                            <span className="text-right ">
                              {getValue(row, col.accessor, col.render)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No data found.</p>
        )}
      </div>
    </div>
  );
}
