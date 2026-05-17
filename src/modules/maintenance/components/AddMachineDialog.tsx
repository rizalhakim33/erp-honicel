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
import { supabase } from "@/lib/supabase";
import { useProductionStore } from "../../production/store/useProductionStore";

const formSchema = z.object({
  name: z.string().min(2, "Machine name is required"),
  code: z.string().min(2, "Machine code is required"),
  type: z.string().min(1, "Machine type is required"),
  status: z.enum(['running', 'idle', 'maintenance', 'breakdown']),
});

interface AddMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddMachineDialog({ open, onOpenChange, onSuccess }: AddMachineDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const { fetchMachines } = useProductionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: `MAC-${Math.floor(100 + Math.random() * 900)}`,
      type: "Production",
      status: "idle",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('machines')
        .insert([values]);
      
      if (error) throw error;

      toast.success("Machine registered successfully");
      await fetchMachines();
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to register machine asset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest font-mono">Register_New_Asset</DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase">
            Add a new machine to the facility directory
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Machine Badge Name</FormLabel>
                    <FormControl>
                      <Input className="rounded-none border-zinc-200 font-mono text-xs uppercase" {...field} />
                    </FormControl>
                    <FormMessage className="text-[9px] font-mono uppercase" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Machine Code</FormLabel>
                    <FormControl>
                      <Input className="rounded-none border-zinc-200 font-mono text-xs uppercase" {...field} />
                    </FormControl>
                    <FormMessage className="text-[9px] font-mono uppercase" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Asset Type</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs" {...field} />
                  </FormControl>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Current Ops Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="running" className="font-mono text-xs uppercase text-green-600">Running</SelectItem>
                      <SelectItem value="idle" className="font-mono text-xs uppercase text-zinc-600">Idle</SelectItem>
                      <SelectItem value="maintenance" className="font-mono text-xs uppercase text-amber-600">Maintenance</SelectItem>
                      <SelectItem value="breakdown" className="font-mono text-xs uppercase text-red-600">Breakdown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none font-mono text-[10px] uppercase h-9 border-zinc-200">CANCEL</Button>
              <Button type="submit" disabled={loading} className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-[10px] uppercase h-9 tracking-widest px-6">
                {loading ? "REGISTERING..." : "COMMIT_ASSET"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
