import { supabase } from '@/lib/supabase';

export interface WorkOrder {
  id: string;
  wo_number: string;
  bom_id: string;
  machine_id: string;
  target_quantity: number;
  produced_quantity: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  product_name?: string;
  machine_name?: string;
}

export const productionService = {
  async getWorkOrders() {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        boms (name),
        machines (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(wo => ({
      ...wo,
      product_name: wo.boms?.name,
      machine_name: wo.machines?.name
    })) as WorkOrder[];
  },

  async updateWOStatus(id: string, status: WorkOrder['status']) {
    const { data, error } = await supabase
      .from('work_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as WorkOrder;
  }
};
