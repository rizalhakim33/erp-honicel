import { supabase } from '@/lib/supabase';
import { InventoryItem } from '../components/ItemTable';

export const inventoryService = {
  async getItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      // Map schema fields to UI fields
      category: item.type, // Using 'type' as category for simplicity in UI
      stock: 0, // Placeholder until joins are implemented
      status: 'in_stock'
    })) as InventoryItem[];
  },

  async addItem(item: Omit<InventoryItem, 'id' | 'status'>) {
    const { data, error } = await supabase
      .from('items')
      .insert([{ 
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        type: item.category === 'Raw Material' ? 'raw_material' : 'finished_good',
        min_stock: item.min_stock
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      category: data.type,
      stock: 0,
      status: 'in_stock'
    } as InventoryItem;
  },

  async updateStock(id: string, newStock: number, minStock: number) {
    // In the real schema we'd update 'stocks' table, 
    // but for the UI to reflect changes we'll mock the return
    return { id, stock: newStock, min_stock: minStock } as any;
  },

  async deleteItem(id: string) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
