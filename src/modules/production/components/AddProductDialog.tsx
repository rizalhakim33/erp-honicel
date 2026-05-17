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
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventoryStore } from "../../inventory/store/useInventoryStore";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(3, "SKU/Code must be at least 3 characters"),
  unit: z.string().min(1, "Unit is required"),
  initial_stock: z.number().min(0).optional(),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const { addItem } = useInventoryStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      unit: "PCS",
      initial_stock: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addItem({
        name: values.name,
        sku: values.sku,
        category: "Finished Good",
        unit: values.unit,
        stock: values.initial_stock || 0,
        min_stock: 0,
      });
      toast.success("Product registered in database");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to register product");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-zinc-200 rounded-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-1 bg-zinc-900 mb-4" />
          <DialogTitle className="text-sm font-bold uppercase tracking-[0.2em] font-mono text-zinc-900 text-left">
            Product_Database_Entry
          </DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase text-zinc-400 text-left tracking-tight">
            Register a new final product into the master database
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="sku" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Master SKU / Code</Label>
            <Input 
              id="sku" 
              {...form.register("sku")} 
              className="font-mono text-xs uppercase rounded-none border-zinc-200 bg-zinc-50/50 h-10 focus-visible:ring-zinc-900" 
              placeholder="FG-BOX-001" 
            />
            {form.formState.errors.sku && <p className="text-[9px] text-red-500 font-mono uppercase">{form.formState.errors.sku.message}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Descriptor Name</Label>
            <Input 
              id="name" 
              {...form.register("name")} 
              className="rounded-none border-zinc-200 font-mono text-xs h-10 focus-visible:ring-zinc-900" 
              placeholder="Corrugated Box A1 350x250x150" 
            />
            {form.formState.errors.name && <p className="text-[9px] text-red-500 font-mono uppercase">{form.formState.errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="unit" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Inventory Unit</Label>
              <Input 
                id="unit" 
                {...form.register("unit")} 
                className="rounded-none border-zinc-200 font-mono text-xs h-10 focus-visible:ring-zinc-900" 
                placeholder="PCS" 
              />
            </div>
            <div className="grid gap-2">
               <Label htmlFor="initial_stock" className="text-[10px] font-bold uppercase text-zinc-400 font-mono tracking-widest">Opening Stock</Label>
               <Input 
                 id="initial_stock" 
                 type="number" 
                 {...form.register("initial_stock", { valueAsNumber: true })} 
                 className="rounded-none border-zinc-200 font-mono text-xs h-10 focus-visible:ring-zinc-900" 
               />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-mono text-[10px] font-bold uppercase h-11 tracking-[0.2em] transition-all"
            >
              COMMIT_TO_DATABASE
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="w-full rounded-none font-mono text-[10px] uppercase h-9 text-zinc-400 hover:text-zinc-900"
            >
              CLOSE_TERMINAL
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
