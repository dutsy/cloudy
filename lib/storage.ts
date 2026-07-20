// lib/storage.ts
export const STORAGE_KEYS = {
  TABLE_NUMBER: "cloudy_table_number",
  CUSTOMER_NAME: "cloudy_customer_name",
};


export function setCustomerName(name: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, name);
  }
}

export function getCustomerName(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME) || "";
  }
  return "";
}

// --- Table Number (Assuming you already had something like this, but ensuring it's robust) ---
export function setTableNumber(table: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TABLE_NUMBER, table);
  }
}

export function getTableNumber(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.TABLE_NUMBER) || "";
  }
  return "";
}
