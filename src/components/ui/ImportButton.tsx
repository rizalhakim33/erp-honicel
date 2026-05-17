import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "./button";
import { parseCSV } from "@/lib/csv";
import { toast } from "sonner";

interface ImportButtonProps<T> {
  onImport: (data: T[]) => Promise<void>;
  label?: string;
  className?: string;
}

export function ImportButton<T>({ onImport, label = "Import Data", className }: ImportButtonProps<T>) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = React.useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsImporting(true);
    try {
      const data = await parseCSV<T>(file);
      await onImport(data);
      toast.success(`${data.length} records processed`);
    } catch (error) {
      console.error("Import Error:", error);
      toast.error("Failed to import data. Check CSV format.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isImporting}
        onClick={() => fileInputRef.current?.click()}
        className={className}
      >
        <Upload className="w-3.5 h-3.5 mr-2" />
        {isImporting ? "PROCESSING..." : label}
      </Button>
    </>
  );
}
