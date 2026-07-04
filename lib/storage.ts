// lib/storage.ts
export const TABLE_STORAGE_KEY = "table_number";

export const setTableNumber = (tableNumber: string) => {
  localStorage.setItem(TABLE_STORAGE_KEY, tableNumber);
};

export const getTableNumber = () => {
  return localStorage.getItem(TABLE_STORAGE_KEY) || "Takeaway";
};

