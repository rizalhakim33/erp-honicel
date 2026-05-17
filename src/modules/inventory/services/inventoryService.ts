import { supabase } from '@/lib/supabase';
import { InventoryItem } from '../types';

export const inventoryService = {
  async getItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      category: item.type,
      stock: item.stock || 0,
      status: (item.stock || 0) <= (item.min_stock || 0) ? 'low_stock' : 'in_stock'
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
        min_stock: item.min_stock,
        stock: item.stock || 0
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
      stock: data.stock || 0,
      status: (data.stock || 0) <= (data.min_stock || 0) ? 'low_stock' : 'in_stock'
    } as InventoryItem;
  },

  async updateStock(id: string, newStock: number, minStock: number) {
    const { data, error } = await supabase
      .from('items')
      .update({ stock: newStock })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error (updateStock):', error);
      throw error;
    }

    return {
      ...data,
      category: data.type,
      stock: data.stock || 0,
      status: (data.stock || 0) <= (data.min_stock || 0) ? 'low_stock' : 'in_stock'
    } as InventoryItem;
  },

  async deleteItem(id: string) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateItem(id: string, item: Partial<Omit<InventoryItem, 'id' | 'status'>>) {
    let itemType: string | undefined = undefined;
    if (item.category) {
      const cat = item.category.toLowerCase();
      if (cat.includes('raw')) itemType = 'raw_material';
      else if (cat.includes('finished')) itemType = 'finished_good';
      else if (cat.includes('semi')) itemType = 'semi_finished';
      else if (cat.includes('spare') || cat.includes('part') || cat.includes('asset')) itemType = 'sparepart';
    }

    const { data, error } = await supabase
      .from('items')
      .update({
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        type: itemType,
        min_stock: item.min_stock
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Error (updateItem):', error);
      throw error;
    }

    return {
      ...data,
      category: data.type,
      stock: data.stock || 0,
      status: (data.stock || 0) <= (data.min_stock || 0) ? 'low_stock' : 'in_stock'
    } as InventoryItem;
  }
};
