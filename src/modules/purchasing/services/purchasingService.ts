import { supabase } from '@/lib/supabase';

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  total_amount: number;
  order_date: string;
  expected_arrival: string | null;
  notes: string | null;
  supplier_name?: string;
}

export const purchasingService = {
  async getPurchaseOrders() {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        suppliers (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(po => ({
      ...po,
      supplier_name: po.suppliers?.name
    })) as PurchaseOrder[];
  },

  async updatePOStatus(id: string, status: PurchaseOrder['status']) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as PurchaseOrder;
  },

  async createPO(po: Omit<PurchaseOrder, 'id' | 'po_number' | 'status' | 'order_date'>) {
    const po_number = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert([{ ...po, po_number, status: 'draft' }])
      .select()
      .single();
    
    if (error) throw error;
    return data as PurchaseOrder;
  },

  async deletePurchaseOrder(id: string) {
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  }
};
