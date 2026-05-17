import { supabase } from '@/lib/supabase';
import { InventoryItem } from '../types';

export const inventoryService = {
  async getItems() {
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .order('name');
    
    if (itemsError) throw itemsError;

    return (itemsData || []).map(item => {
      // In this simplified version, we might not have the stocks joined
      // We assume stock is 0 if not provided or handle it differently
      const stockQty = item.stock || 0; 
      const minStock = item.min_stock || 10;
      return {
        ...item,
        category: item.type,
        stock: stockQty,
        status: stockQty <= minStock ? (stockQty === 0 ? 'out_of_stock' : 'low_stock') : 'in_stock'
      };
    }) as InventoryItem[];
  },

  async getOrCreateDefaultWarehouse() {
    const { data: warehouses, error: whError } = await supabase
      .from('warehouses')
      .select('id')
      .limit(1);
    
    if (whError) throw whError;

    if (warehouses && warehouses.length > 0) {
      return warehouses[0].id;
    }

    // Create a default warehouse if none exists
    const { data: newWh, error: createError } = await supabase
      .from('warehouses')
      .insert([{ name: 'Main Warehouse', code: 'W-MAIN', location: 'Primary Site' }])
      .select()
      .single();
    
    if (createError) throw createError;
    return newWh.id;
  },

  async addItem(item: Omit<InventoryItem, 'id' | 'status'>) {
    let itemType: 'raw_material' | 'semi_finished' | 'finished_good' | 'sparepart' = 'raw_material';
    const cat = item.category.toLowerCase();
    if (cat.includes('raw')) itemType = 'raw_material';
    else if (cat.includes('finished')) itemType = 'finished_good';
    else if (cat.includes('semi')) itemType = 'semi_finished';
    else if (cat.includes('spare') || cat.includes('part') || cat.includes('asset')) itemType = 'sparepart';

    const { data: newItem, error: itemError } = await supabase
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
    
    if (itemError) {
      console.error('Supabase Error (addItem - item):', itemError);
      throw itemError;
    }

    // Create initial stock entry
    const warehouseId = await this.getOrCreateDefaultWarehouse();
    const { error: stockError } = await supabase
      .from('stocks')
      .insert([{
        item_id: newItem.id,
        warehouse_id: warehouseId,
        quantity: item.stock || 0
      }]);

    if (stockError) {
      console.error('Supabase Error (addItem - stock):', stockError);
      // We don't throw here to avoid failing item creation, but user will see 0 stock
    }

    return {
      ...newItem,
      category: newItem.type,
      stock: item.stock || 0,
      status: (item.stock || 0) <= (item.min_stock || 10) ? 'low_stock' : 'in_stock'
    } as InventoryItem;
  },

  async updateStock(id: string, newStock: number, minStock: number) {
    const warehouseId = await this.getOrCreateDefaultWarehouse();
    
    // Upsert into stocks table
    const { data: stockData, error: stockError } = await supabase
      .from('stocks')
      .upsert({ 
        item_id: id, 
        warehouse_id: warehouseId, 
        quantity: newStock 
      }, { onConflict: 'item_id,warehouse_id' })
      .select()
      .single();
    
    if (stockError) {
      console.error('Supabase Error (updateStock):', stockError);
      throw stockError;
    }

    // Get item data to return full object
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (itemError) throw itemError;

    return {
      ...itemData,
      category: itemData.type,
      stock: newStock,
      status: newStock <= (minStock || 10) ? 'low_stock' : 'in_stock'
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
      .select('*, stocks(quantity)')
      .single();

    if (error) {
      console.error('Supabase Error (updateItem):', error);
      throw error;
    }

    const stockQty = data.stocks?.reduce((acc: number, s: any) => acc + (s.quantity || 0), 0) || 0;
    const minStock = data.min_stock || 10;

    return {
      ...data,
      category: data.type,
      stock: stockQty,
      status: stockQty <= minStock ? 'low_stock' : 'in_stock'
    } as InventoryItem;
  }
};
