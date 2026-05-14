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

  async createWorkOrder(wo: Omit<WorkOrder, 'id' | 'wo_number' | 'status' | 'produced_quantity'>) {
    const wo_number = `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data, error } = await supabase
      .from('work_orders')
      .insert([{ 
        ...wo, 
        wo_number, 
        status: 'planned',
        produced_quantity: 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as WorkOrder;
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
  },

  async getBoms() {
    const { data, error } = await supabase
      .from('boms')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async getMachines() {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  }
};
