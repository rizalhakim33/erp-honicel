import { toast } from "sonner";

/**
 * Exports data to a CSV file.
 * @param data Array of objects to export
 * @param filename Name of the file (without .csv extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    toast.error("No data available to export");
    return;
  }

  try {
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));

    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Data exported successfully");
  } catch (error) {
    console.error("Export Error:", error);
    toast.error("Failed to export data");
  }
};

/**
 * Parses a CSV file and returns the data as an array of objects.
 * @param file The File object from an input element
 * @returns Promise resolving to an array of objects
 */
export const parseCSV = <T>(file: File): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          throw new Error("Invalid CSV: Header or data missing");
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const result: T[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
          const obj: any = {};
          
          headers.forEach((header, index) => {
            const val = values[index];
            // Try to parse as number if possible
            if (val && !isNaN(Number(val)) && val.trim() !== '') {
              obj[header] = Number(val);
            } else if (val === 'true') {
              obj[header] = true;
            } else if (val === 'false') {
              obj[header] = false;
            } else {
              obj[header] = val;
            }
          });
          
          result.push(obj as T);
        }
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
