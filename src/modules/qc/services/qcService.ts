import { supabase } from '@/lib/supabase';

export interface QCLog {
  id: string;
  work_order_id: string;
  check_type: string;
  status: 'pass' | 'fail';
  notes: string;
  created_at: string;
  wo_number?: string;
}

export const qcService = {
  async getQCLogs() {
    const { data, error } = await supabase
      .from('qc_logs')
      .select(`
        *,
        work_orders (wo_number)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(log => ({
      ...log,
      wo_number: log.work_orders?.wo_number
    })) as QCLog[];
  },

  async createQCLog(log: Omit<QCLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('qc_logs')
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data as QCLog;
  }
};
