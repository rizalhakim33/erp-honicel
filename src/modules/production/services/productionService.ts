import { supabase } from '@/lib/supabase';

export interface WorkOrder {
  id: string;
  wo_number: string;
  bom_id: string;
  machine_id: string;
  target_quantity: number;
  produced_quantity: number;
  reject_quantity?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  product_name?: string;
  machine_name?: string;
}

export const productionService = {
  async getWorkOrders() {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase Error (getWorkOrders):', error);
      throw error;
    }
    
    // Attempt to get name info separately or use fallback
    return (data || []).map(wo => ({
      ...wo,
      product_name: wo.product_name || 'Production Batch',
      machine_name: wo.machine_name || 'Generic Resource'
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

  async updateWOQuantity(id: string, quantity: number) {
    const { data, error } = await supabase
      .from('work_orders')
      .update({ produced_quantity: quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as WorkOrder;
  },

  async deleteWorkOrder(id: string) {
    // Delete related QC logs first to satisfy foreign key constraints
    await supabase
      .from('qc_logs')
      .delete()
      .eq('work_order_id', id);

    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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
  },

  async createMachine(machine: { name: string, code: string, type: string }) {
    const { data, error } = await supabase
      .from('machines')
      .insert([machine])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMachine(id: string, machine: Partial<{ name: string, code: string, type: string, status: string }>) {
    const { data, error } = await supabase
      .from('machines')
      .update(machine)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteMachine(id: string) {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
