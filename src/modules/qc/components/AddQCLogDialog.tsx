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
import { useQCStore } from "../store/useQCStore";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  work_order_id: z.string().optional(),
  check_type: z.string().min(1, "Check type is required"),
  status: z.enum(['pass', 'fail']),
  notes: z.string().optional(),
});

interface AddQCLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddQCLogDialog({ open, onOpenChange }: AddQCLogDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [workOrders, setWorkOrders] = React.useState<{id: string, wo_number: string}[]>([]);
  const { createLog, fetchLogs } = useQCStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      work_order_id: "",
      check_type: "visual_inspection",
      status: "pass",
      notes: "",
    },
  });

  React.useEffect(() => {
    async function loadWOs() {
      const { data } = await supabase.from('work_orders').select('id, wo_number').order('created_at', { ascending: false });
      if (data) setWorkOrders(data);
    }
    if (open) loadWOs();
  }, [open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createLog({
        work_order_id: values.work_order_id || null,
        check_type: values.check_type,
        status: values.status,
        notes: values.notes || null,
      });
      toast.success("Quality inspection recorded");
      await fetchLogs();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to record inspection");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-none border-zinc-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest font-mono text-zinc-900">Record_QA_Inspection</DialogTitle>
          <DialogDescription className="text-[10px] font-mono uppercase text-zinc-500">
            Submit new compliance verification data
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="work_order_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Work Order Ref</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workOrders.map(wo => (
                        <SelectItem key={wo.id} value={wo.id} className="font-mono text-xs uppercase">{wo.wo_number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="check_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Inspection Protocol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Select Protocol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visual_inspection" className="font-mono text-xs uppercase">Visual Inspection</SelectItem>
                      <SelectItem value="dimensional_check" className="font-mono text-xs uppercase">Dimensional Check</SelectItem>
                      <SelectItem value="strength_test" className="font-mono text-xs uppercase">Strength Test</SelectItem>
                      <SelectItem value="moisture_level" className="font-mono text-xs uppercase">Moisture Level</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Final Verdict</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-zinc-200 font-mono text-xs uppercase">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pass" className="font-mono text-xs uppercase text-green-600">PASS_STRICT</SelectItem>
                      <SelectItem value="fail" className="font-mono text-xs uppercase text-red-600">FAIL_REJECT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px] font-mono uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Observations</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-zinc-200 font-mono text-xs" {...field} placeholder="Enter inspection notes..." />
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
                CANCEL
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-[10px] uppercase h-9 tracking-widest px-6"
              >
                {loading ? "RECORDING..." : "COMMIT_QA_DATA"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
