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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  stock: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  min_stock: z.number().min(0),
});

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const { addItem } = useInventoryStore();
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

  const onSubmit = async (values: FormValues) => {
    try {
      await addItem(values);
      toast.success("Item added to inventory registry");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add item");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight uppercase">Register New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sku" className="text-[10px] font-bold uppercase text-zinc-500 font-mono">ID / SKU</Label>
            <Input id="sku" {...form.register("sku")} className="font-mono text-xs uppercase" placeholder="RM-KL-150" />
            {form.formState.errors.sku && <p className="text-[10px] text-red-500">{form.formState.errors.sku.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Descriptor</Label>
            <Input id="name" {...form.register("name")} placeholder="Kraft Liner 150gsm" />
            {form.formState.errors.name && <p className="text-[10px] text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Zone / Category</Label>
              <Select onValueChange={(val: string) => form.setValue("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Raw Material">Raw Material</SelectItem>
                  <SelectItem value="Chemical">Chemical</SelectItem>
                  <SelectItem value="Finished Good">Finished Good</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit" className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Unit</Label>
              <Input id="unit" {...form.register("unit")} placeholder="KG, M2, PCS" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stock" className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Initial Qty</Label>
              <Input id="stock" type="number" {...form.register("stock", { valueAsNumber: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="min_stock" className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Min Threshold</Label>
              <Input id="min_stock" type="number" {...form.register("min_stock", { valueAsNumber: true })} />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none font-mono text-[10px] uppercase">Abort</Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 rounded-none font-mono text-[10px] uppercase">Commit_Registry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
