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
import { useMaintenanceStore } from "../store/useMaintenanceStore";
import { supabase } from "@/lib/supabase";
import { useDialogStore } from "@/store/useDialogStore";

const formSchema = z.object({
  machine_id: z.string().min(1, "Machine index is required"),
  type: z.enum(['preventive', 'corrective']),
  description: z.string().min(5, "Description must be detailed"),
  status: z.enum(['scheduled', 'in_progress', 'completed']),
});

interface AddMaintenanceLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMaintenanceLogDialog({ open, onOpenChange }: AddMaintenanceLogDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [machines, setMachines] = React.useState<{id: string, name: string}[]>([]);
  const { createLog, fetchLogs } = useMaintenanceStore();
  const openDialog = useDialogStore(state => state.open);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machine_id: "",
      type: "preventive",
      description: "",
      status: "scheduled",
    },
  });

  React.useEffect(() => {
    async function loadMachines() {
      const { data } = await supabase.from('machines').select('id, name');
      if (data) setMachines(data);
    }
    if (open) loadMachines();
  }, [open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createLog({
        machine_id: values.machine_id,
        type: values.type,
        description: values.description,
        start_time: new Date().toISOString(),
      });
      toast.success("Maintenance log initialized");
      await fetchLogs();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to commit maintenance record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest font-mono text-zinc-900">Schedule_Asset_Service</DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase text-zinc-500">
            Initialize new preventive or corrective maintenance sequence
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="machine_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Resource / Machine</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Asset" />
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Maintenance Classification</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="preventive" className="font-mono text-xs uppercase">Preventive (Routine)</SelectItem>
                      <SelectItem value="corrective" className="font-mono text-xs uppercase">Corrective (Repair)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Fault_Analysis / Task</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs" {...field} placeholder="Describe the maintenance requirements..." />
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
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Operations_State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled" className="font-mono text-xs uppercase">Scheduled</SelectItem>
                      <SelectItem value="in_progress" className="font-mono text-xs uppercase">In_Progress</SelectItem>
                    </SelectContent>
                  </Select>
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
                ABORT_OPS
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-[10px] uppercase h-9 tracking-widest px-6"
              >
                {loading ? "COMMITTING..." : "AUTHORIZE_SERVICE"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
