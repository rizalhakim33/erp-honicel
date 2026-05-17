import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { purchasingService } from "../services/purchasingService";

const formSchema = z.object({
  supplier_id: z.string().min(1, "Please select a supplier"),
  total_amount: z.number().min(0),
  notes: z.string().optional(),
});

interface AddPODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

import { usePurchasingStore } from "../store/usePurchasingStore";
import { supabase } from "@/lib/supabase";

export function AddPODialog({ open, onOpenChange, onSuccess }: AddPODialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState<{id: string, name: string}[]>([]);
  const { createPO, fetchPurchaseOrders } = usePurchasingStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: "",
      total_amount: 0,
      notes: "",
    },
  });

  React.useEffect(() => {
    async function loadSuppliers() {
      const { data } = await supabase.from('suppliers').select('id, name').order('name');
      if (data) setSuppliers(data);
    }
    if (open) {
      loadSuppliers();
    }
  }, [open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createPO({
        supplier_id: values.supplier_id,
        total_amount: values.total_amount,
        notes: values.notes || null,
        expected_arrival: null,
      });
      toast.success("Purchase order created successfully");
      await fetchPurchaseOrders();
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create purchase order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest font-mono">Create_Purchase_Order</DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase">
            Initialize a new procurement requisition
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Vendor / Supplier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.length > 0 ? (
                        suppliers.map(s => (
                          <SelectItem key={s.id} value={s.id} className="font-mono text-xs uppercase">{s.name}</SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-[10px] font-mono uppercase text-zinc-400 text-center space-y-2">
                          <p>No vendors found</p>
                          <Button asChild variant="outline" size="sm" className="w-full text-zinc-900 border-zinc-200 h-7 rounded-none">
                            <Link to="/purchasing">Add Vendor</Link>
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
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Total Estimated Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      className="rounded-none border-zinc-200 font-mono text-xs" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Procurement Notes</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs" {...field} />
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
                {loading ? "PROCESSING..." : "AUTHENTICATE_PO"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
