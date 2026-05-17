import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryStore } from "../store/useInventoryStore";
import { toast } from "sonner";
import { InventoryItem } from "../types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  stock: z.number().min(0).optional(),
  unit: z.string().min(1, "Unit is required"),
  min_stock: z.number().min(0),
});

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem | null;
}

export function AddItemDialog({ open, onOpenChange, item }: AddItemDialogProps) {
  const { addItem, updateItem } = useInventoryStore();
  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      stock: 0,
      unit: "KG",
      min_stock: 10,
    },
  });

  React.useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock: item.stock,
        unit: item.unit,
        min_stock: item.min_stock,
      });
    } else {
      form.reset({
        name: "",
        sku: "",
        category: "",
        stock: 0,
        unit: "KG",
        min_stock: 10,
      });
    }
  }, [item, form, open]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (item) {
        await updateItem(item.id, values);
        toast.success("Asset updated successfully");
      } else {
        await addItem(values as any);
        toast.success("Item added to inventory registry");
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(item ? "Failed to update asset" : "Failed to add item");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-zinc-200 rounded-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-1 bg-zinc-900 mb-4" />
          <DialogTitle className="text-sm font-bold uppercase tracking-[0.2em] font-mono text-zinc-900">
            {item ? 'UPDATE_ASSET_DATA' : 'REGISTER_NEW_ASSET'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sku" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">ID / SKU</Label>
            <Input id="sku" {...form.register("sku")} className="font-mono text-xs uppercase rounded-none border-zinc-200 h-10" placeholder="RM-KL-150" />
            {form.formState.errors.sku && <p className="text-[9px] text-red-500 font-mono uppercase">{form.formState.errors.sku.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Descriptor</Label>
            <Input id="name" {...form.register("name")} className="rounded-none border-zinc-200 h-10 font-mono text-xs" placeholder="Kraft Liner 150gsm" />
            {form.formState.errors.name && <p className="text-[9px] text-red-500 font-mono uppercase">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Zone / Category</Label>
              <Select 
                onValueChange={(val: string) => form.setValue("category", val)}
                value={form.watch("category")}
              >
                <SelectTrigger className="rounded-none border-zinc-200 h-10 font-mono text-[10px] uppercase">
                  <SelectValue placeholder="ZONE" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="Raw Material" className="font-mono text-[10px] uppercase">Raw Material</SelectItem>
                  <SelectItem value="Chemical" className="font-mono text-[10px] uppercase">Chemical</SelectItem>
                  <SelectItem value="Finished Good" className="font-mono text-[10px] uppercase">Finished Good</SelectItem>
                  <SelectItem value="Packaging" className="font-mono text-[10px] uppercase">Packaging</SelectItem>
                  <SelectItem value="Semi Finished" className="font-mono text-[10px] uppercase">Semi Finished</SelectItem>
                  <SelectItem value="Sparepart" className="font-mono text-[10px] uppercase">Sparepart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Unit</Label>
              <Input id="unit" {...form.register("unit")} className="rounded-none border-zinc-200 h-10 font-mono text-xs" placeholder="KG, M2, PCS" />
            </div>
          </div>
          {!item && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Initial Qty</Label>
                <Input id="stock" type="number" {...form.register("stock", { valueAsNumber: true })} className="rounded-none border-zinc-200 h-10 font-mono text-xs" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_stock" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Min Threshold</Label>
                <Input id="min_stock" type="number" {...form.register("min_stock", { valueAsNumber: true })} className="rounded-none border-zinc-200 h-10 font-mono text-xs" />
              </div>
            </div>
          )}
          {item && (
             <div className="grid gap-2">
               <Label htmlFor="min_stock" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Min Threshold</Label>
               <Input id="min_stock" type="number" {...form.register("min_stock", { valueAsNumber: true })} className="rounded-none border-zinc-200 h-10 font-mono text-xs" />
             </div>
          )}
          <DialogFooter className="pt-4 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="rounded-none font-mono text-[10px] uppercase h-10 flex-1 border-zinc-200"
            >
              TERMINATE
            </Button>
            <Button 
              type="submit" 
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-mono text-[10px] uppercase h-10 flex-1 tracking-[0.1em]"
            >
              {item ? 'COMMIT_CHANGES' : 'EXECUTE_REGISTRY'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
