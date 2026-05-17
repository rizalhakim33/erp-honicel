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
    let itemType: 'raw_material' | 'semi_finished' | 'finished_good' | 'sparepart' = 'raw_material';
    const cat = item.category.toLowerCase();
    if (cat.includes('raw')) itemType = 'raw_material';
    else if (cat.includes('finished')) itemType = 'finished_good';
    else if (cat.includes('semi')) itemType = 'semi_finished';
    else if (cat.includes('spare') || cat.includes('part') || cat.includes('asset')) itemType = 'sparepart';

    const { data, error } = await supabase
      .from('items')
      .insert([{ 
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        type: itemType,
        min_stock: item.min_stock
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error (addItem):', error);
      throw error;
    }
    return {
      ...data,
      category: data.type,
      stock: item.stock || 0, // In reality this would be a separate transaction, but for UI we simulate
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
