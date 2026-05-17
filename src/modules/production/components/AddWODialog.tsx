import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { productionService } from "../services/productionService";

const formSchema = z.object({
  bom_id: z.string().min(1, "Please select a BOM"),
  machine_id: z.string().min(1, "Please select a machine"),
  target_quantity: z.number().min(1, "Quantity must be at least 1"),
});

interface AddWODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

import { useProductionStore } from "../store/useProductionStore";
import { supabase } from "@/lib/supabase";
import { useDialogStore } from "@/store/useDialogStore";

export function AddWODialog({ open, onOpenChange, onSuccess }: AddWODialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [boms, setBoms] = React.useState<{id: string, name: string}[]>([]);
  const [machines, setMachines] = React.useState<{id: string, name: string}[]>([]);
  const { createWorkOrder, fetchWorkOrders } = useProductionStore();
  const openDialog = useDialogStore(state => state.open);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bom_id: "",
      machine_id: "",
      target_quantity: 0,
    },
  });

  React.useEffect(() => {
    async function loadData() {
      const [{ data: bomsData }, { data: machinesData }] = await Promise.all([
        supabase.from('boms').select('id, name'),
        supabase.from('machines').select('id, name').neq('status', 'breakdown')
      ]);
      if (bomsData) setBoms(bomsData);
      if (machinesData) setMachines(machinesData);
    }
    if (open) {
      loadData();
    }
  }, [open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createWorkOrder({
        bom_id: values.bom_id,
        machine_id: values.machine_id,
        target_quantity: values.target_quantity,
      });
      toast.success("Work Order initiated successfully");
      await fetchWorkOrders();
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to initiate work order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest font-mono">Initiate_Work_Order</DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase">
            Start a new production sequence
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="bom_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Product / BOM</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Drawing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {boms.length > 0 ? (
                        boms.map(b => (
                          <SelectItem key={b.id} value={b.id} className="font-mono text-xs uppercase">{b.name}</SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-[10px] font-mono uppercase text-zinc-400 text-center space-y-2">
                          <p>No BOMs found</p>
                          <Button type="button" onClick={() => openDialog('bom')} variant="outline" size="sm" className="w-full text-zinc-900 border-zinc-200 h-7 rounded-none">
                            Add BOM
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="machine_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Resource / Machine</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Allocation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {machines.length > 0 ? (
                        machines.map(m => (
                          <SelectItem key={m.id} value={m.id} className="font-mono text-xs uppercase">{m.name}</SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-[10px] font-mono uppercase text-zinc-400 text-center space-y-2">
                          <p>No machines found</p>
                          <Button type="button" onClick={() => openDialog('machine')} variant="outline" size="sm" className="w-full text-zinc-900 border-zinc-200 h-7 rounded-none">
                            Add Machine
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Target Quantity (Units)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      className="rounded-none border-zinc-200 font-mono text-xs" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-none font-mono text-[10px] uppercase h-9 border-zinc-200"
              >
                CANCEL_OPS
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-[10px] uppercase h-9 tracking-widest px-6"
              >
                {loading ? "COMMITTING..." : "INITIATE_PRODUCTION"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
