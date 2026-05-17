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
import { supabase } from "@/lib/supabase";
import { useProductionStore } from "../store/useProductionStore";

const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  process_flow: z.string().optional(),
});

interface AddBOMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddBOMDialog({ open, onOpenChange, onSuccess }: AddBOMDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const { fetchBoms } = useProductionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      process_flow: "Standard Production Flow",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('boms')
        .insert([values]);
      
      if (error) throw error;

      toast.success("BOM architected successfully");
      await fetchBoms();
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to register BOM");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest font-mono">Architect_New_BOM</DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase">
            Define a new product structure and process flow
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">FG Product Name</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs uppercase" {...field} />
                  </FormControl>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Structural Description</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs" {...field} />
                  </FormControl>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="process_flow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Process Flow Protocol</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs uppercase" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none font-mono text-[10px] uppercase h-9 border-zinc-200">ABORT</Button>
              <Button type="submit" disabled={loading} className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-[10px] uppercase h-9 tracking-widest px-6">
                {loading ? "ARCHITECTING..." : "COMMIT_BOM"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
