import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventoryStore } from "../store/useInventoryStore";
import { toast } from "sonner";
import { InventoryItem } from "../types";

const formSchema = z.object({
  adjustment: z.number().describe("Quantity to add or subtract"),
  reason: z.string().min(1, "Reason is required"),
});

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function AdjustStockDialog({ open, onOpenChange, item }: AdjustStockDialogProps) {
  const { updateStock } = useInventoryStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adjustment: 0,
      reason: "Manual Adjustment",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        adjustment: 0,
        reason: "Manual Adjustment",
      });
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!item) return;
    
    try {
      const newStock = item.stock + values.adjustment;
      await updateStock(item.id, newStock, item.min_stock);
      toast.success(`Stock adjusted for ${item.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to adjust stock");
    }
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white border-zinc-200 rounded-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-1 bg-zinc-900 mb-4" />
          <DialogTitle className="text-sm font-bold uppercase tracking-[0.2em] font-mono text-zinc-900">
            STOCK_ADJUSTMENT_TERMINAL
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-zinc-50 p-4 border border-zinc-100 flex flex-col gap-1 mb-4">
          <span className="text-[10px] font-mono uppercase text-zinc-400">Current Asset</span>
          <span className="text-xs font-bold font-mono text-zinc-900 border-b border-zinc-200 pb-1">{item.sku} - {item.name}</span>
          <div className="flex justify-between items-center mt-2">
             <span className="text-[10px] font-mono uppercase text-zinc-400">On Hand Qty</span>
             <span className="text-sm font-bold font-mono text-zinc-900">{item.stock} {item.unit}</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="adjustment" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Adjustment Qty (use negative for substraction)</Label>
            <Input 
              id="adjustment" 
              type="number"
              {...form.register("adjustment", { valueAsNumber: true })} 
              className="font-mono text-xs uppercase rounded-none border-zinc-200 h-10 focus-visible:ring-zinc-900" 
              placeholder="+10 or -5" 
            />
            {form.formState.errors.adjustment && <p className="text-[9px] text-red-500 font-mono uppercase">{form.formState.errors.adjustment.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Adjustment Rationale</Label>
            <Input 
              id="reason" 
              {...form.register("reason")} 
              className="font-mono text-xs uppercase rounded-none border-zinc-200 h-10 focus-visible:ring-zinc-900" 
              placeholder="e.g. Recount, Damage, Disposal" 
            />
          </div>

          <DialogFooter className="pt-4 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="rounded-none font-mono text-[10px] uppercase h-10 flex-1 border-zinc-200"
            >
              CANCEL
            </Button>
            <Button 
              type="submit" 
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-mono text-[10px] uppercase h-10 flex-1 tracking-[0.1em]"
            >
              EXECUTE_ADJUSTMENT
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
