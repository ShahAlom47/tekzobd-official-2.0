"use client";

import React, { useState, useEffect } from "react";
import { GrPowerReset } from "react-icons/gr";
import DashPageTitle from "../DashCommonComponent/DashPageTitle";

type Filters = {
  orderStatus: string;
  paymentMethod: string;
  deliveryMethod: string;
  fromDate: string;
  toDate: string;
};

type OrderFiltersProps = {
  onFilterChange: (filters: Filters) => void;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    orderStatus: "",
    paymentMethod: "",
    deliveryMethod: "",
    fromDate: "",
    toDate: "",
  });

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    const emptyFilters: Filters = {
      orderStatus: "",
      paymentMethod: "",
      deliveryMethod: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="relative mb-6 p-3 bg-white shadow-md rounded-md">
      {/* Toggle Button */}
      <div className="w-full flex justify-between border-b-2 border-brandPrimary mb-3">
        
                <DashPageTitle>Manage Orders</DashPageTitle>
         
        <button
          className="btn-base text-sm h-8 rounded-t-md rounded-b-none -mb-0"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="filter-section"
        >
          Filtering {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* Filter Inputs Wrapper with smooth height animation */}
      <div
        id="filter-section"
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex gap-3 items-end md:flex-row flex-col ">
        <div className=" grid grid-cols-1 md:grid-cols-5 gap-4 w-full ">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Filter By Status
            </label>
            <select
              name="orderStatus"
              value={filters.orderStatus}
              onChange={handleChange}
              className="my-input bg-slate-200"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Filter By Payment Method
            </label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleChange}
              className="my-input bg-slate-200"
            >
              <option value="">All Payment Methods</option>
              <option value="card">Card</option>
              <option value="cash-on-delivery">Cash on Delivery</option>
              <option value="bkash">Bkash</option>
              <option value="nagad">Nagad</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Filter By Delivery Method
            </label>
            <select
              name="deliveryMethod"
              value={filters.deliveryMethod}
              onChange={handleChange}
              className="my-input bg-slate-200"
            >
              <option value="">All Delivery Methods</option>
              <option value="home-delivery">Home Delivery</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              className="my-input bg-slate-200"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">To Date</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              className="my-input bg-slate-200"
            />
          </div>

       
        </div>
           {/* Reset Button spanning full width at the bottom */}
          <div className=" flex justify-end ">
            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="btn-bordered rounded-sm my-0 flex items-center gap-1"
            >
              <GrPowerReset size={16} /> Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderFilters;
