import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Package, 
  Calendar, 
  Hash, 
  Activity, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Play
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useProductionStore } from "../store/useProductionStore";
import { toast } from "sonner";

interface WODetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: any;
}

export function WODetailsDialog({ open, onOpenChange, workOrder }: WODetailsDialogProps) {
  if (!workOrder) return null;

  const { updateWOStatus } = useProductionStore();
  const [loading, setLoading] = React.useState(false);

  const handleStatusUpdate = async (newStatus: any) => {
    setLoading(true);
    try {
      await updateWOStatus(workOrder.id, newStatus);
      toast.success(`Work Order updated to ${newStatus}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round((workOrder.produced_quantity / workOrder.target_quantity) * 100) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-none border-zinc-200 p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 bg-zinc-50 border-b border-zinc-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <Hash className="w-3.5 h-3.5 text-zinc-400" />
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{workOrder.wo_number}</span>
              </div>
              <DialogTitle className="text-xl font-bold text-zinc-900 uppercase tracking-tight">
                {workOrder.product_name || 'Production Batch'}
              </DialogTitle>
            </div>
            <Badge className={cn(
              "rounded-none text-[9px] uppercase font-bold px-2 py-1",
              workOrder.status === 'completed' ? "bg-green-100 text-green-700 hover:bg-green-100" :
              workOrder.status === 'in_progress' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
              "bg-zinc-100 text-zinc-600 hover:bg-zinc-100"
            )}>
              {workOrder.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 rounded-sm">
                    <Package className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Product_Model</div>
                    <div className="text-xs font-bold text-zinc-900">{workOrder.product_name || 'N/A'}</div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 rounded-sm">
                    <Settings className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Machine_Allocation</div>
                    <div className="text-xs font-bold text-zinc-900">{workOrder.machine_name || 'UNASSIGNED'}</div>
                  </div>
               </div>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 rounded-sm">
                    <Calendar className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Target_Deadline</div>
                    <div className="text-xs font-bold text-zinc-900">
                      {workOrder.planned_end_date ? format(new Date(workOrder.planned_end_date), 'MMM dd, yyyy') : 'NO_DEADLINE'}
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 rounded-sm">
                    <Activity className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase">Yield_Efficiency</div>
                    <div className="text-xs font-bold text-zinc-900">{progress}%</div>
                  </div>
               </div>
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Production_Progress</span>
              <span className="text-xs font-mono font-bold">{workOrder.produced_quantity} / {workOrder.target_quantity}</span>
            </div>
            
            {workOrder.status === 'in_progress' && (
              <div className="flex gap-2 mb-2">
                <Button 
                  onClick={() => {
                    const newQty = Math.max(0, workOrder.produced_quantity - 1);
                    useProductionStore.getState().updateWOQuantity(workOrder.id, newQty);
                  }}
                  variant="outline" size="sm" className="h-8 rounded-none border-zinc-200 text-zinc-600 px-3"
                >
                  -1
                </Button>
                <Button 
                  onClick={() => {
                    const newQty = Math.min(workOrder.target_quantity, workOrder.produced_quantity + 1);
                    useProductionStore.getState().updateWOQuantity(workOrder.id, newQty);
                  }}
                  variant="outline" size="sm" className="h-8 rounded-none border-zinc-200 text-zinc-600 flex-1"
                >
                  Increment Progress
                </Button>
                <Button 
                  onClick={() => {
                    const val = prompt("Enter precise output quantity:", workOrder.produced_quantity.toString());
                    if (val !== null) {
                        const num = parseInt(val);
                        if (!isNaN(num)) {
                            useProductionStore.getState().updateWOQuantity(workOrder.id, num);
                        }
                    }
                  }}
                  variant="outline" size="sm" className="h-8 rounded-none border-zinc-200 text-zinc-600 px-3"
                >
                  SET
                </Button>
              </div>
            )}

            <div className="w-full h-2 bg-zinc-100 overflow-hidden rounded-none">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  workOrder.status === 'completed' ? "bg-green-500" : "bg-blue-600"
                )} 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {workOrder.status === 'planned' && (
              <Button 
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={loading}
                className="flex-1 bg-zinc-900 text-white rounded-none font-mono text-[10px] uppercase h-10 tracking-widest"
              >
                <Play className="w-3 h-3 mr-2" /> BEGIN_PROD_CYCLE
              </Button>
            )}
            {workOrder.status === 'in_progress' && (
              <Button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-none font-mono text-[10px] uppercase h-10 tracking-widest"
              >
                <CheckCircle2 className="w-3 h-3 mr-2" /> FINALIZE_BATCH
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6 border-zinc-200 rounded-none font-mono text-[10px] uppercase h-10 tracking-widest"
            >
              CLOSE_VIEW
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
