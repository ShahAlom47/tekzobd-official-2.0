/* eslint-disable @typescript-eslint/no-explicit-any */

export const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#1d232a" : "#1d232a", // Tailwind: bg-slate-900
    borderColor: state.isFocused ? "#3b82f6" : "#334155", // Tailwind: blue-500 or slate-700
    color: "#fff",
    borderWidth: "1px",
    borderRadius: "0.3rem", // Tailwind: rounded-lg
    padding: "0.25rem 0.5rem", // Tailwind: px-2 py-1
    boxShadow: "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#1d232a", // Tailwind: bg-slate-800
    borderRadius: "0.5rem",
    marginTop: "0.25rem",
    zIndex: 20,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#2d3a4e" : "#1d232a", // hover:bg-blue-500
    color: "#fff",
    padding: "0.5rem 0.75rem", // Tailwind: px-3 py-2
    cursor: "pointer",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#3b82f6", // Tailwind: bg-blue-500
    color: "#fff",
    borderRadius: "0.25rem", // rounded
    padding: "0 4px",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#fff",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#fff",
    ":hover": {
      backgroundColor: "#1e40af", // Tailwind: bg-blue-800
      color: "#fff",
    },
  }),
};
