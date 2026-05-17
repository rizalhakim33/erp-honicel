import { supabase } from '@/lib/supabase';

export interface MaintenanceLog {
  id: string;
  machine_id: string;
  type: 'preventive' | 'corrective';
  description: string;
  technician_name?: string;
  start_time: string;
  end_time?: string | null;
  costs?: number;
  machine_name?: string;
  status?: string;
}

export const maintenanceService = {
  async getLogs() {
    const { data, error } = await supabase
      .from('maintenance_logs')
      .select(`
        *,
        machines (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(log => ({
      ...log,
      machine_name: log.machines?.name,
      status: log.end_time ? 'Completed' : 'In Progress'
    })) as MaintenanceLog[];
  },

  async createLog(log: Omit<MaintenanceLog, 'id'>) {
    const { data, error } = await supabase
      .from('maintenance_logs')
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data as MaintenanceLog;
  },

  async updateLogStatus(id: string, status: MaintenanceLog['status']) {
    const { data, error } = await supabase
      .from('maintenance_logs')
      .update({ status, end_time: status === 'completed' ? new Date().toISOString() : null })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteLog(id: string) {
    const { error } = await supabase
      .from('maintenance_logs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
