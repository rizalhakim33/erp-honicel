export type InventoryItem = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  unit: string
  min_stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}
