import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Package, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { AddItemDialog } from "./AddItemDialog"
import { useInventoryStore } from "../store/useInventoryStore"
import { toast } from "sonner"

export type InventoryItem = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  unit: string
  min_stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export const columns: ColumnDef<InventoryItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <div className="text-[10px] font-mono text-zinc-400 uppercase italic">ID / Serial</div>
    ),
    cell: ({ row }) => <div className="font-mono text-xs text-zinc-500">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="text-[10px] font-mono text-zinc-400 uppercase italic">Descriptor</div>
    ),
    cell: ({ row }) => (
      <div>
        <div className="text-xs font-semibold text-zinc-900">{row.getValue("name")}</div>
        <div className="text-[10px] text-zinc-400 font-mono tracking-tight uppercase">System: verified</div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Zone",
    cell: ({ row }) => <div className="text-[10px] font-mono uppercase text-zinc-500">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right text-[10px] font-mono text-zinc-400 uppercase italic">Inventory</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("stock"))
      const unit = row.original.unit
      return <div className="text-right font-mono text-xs font-bold text-zinc-900">{amount} <span className="text-zinc-400 text-[10px] uppercase">{unit}</span></div>
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right text-[10px] font-mono text-zinc-400 uppercase italic">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="text-right">
          <span className={cn(
            "px-2 py-0.5 text-[10px] rounded font-bold uppercase",
            status === 'in_stock' ? "bg-green-100 text-green-700" : status === 'low_stock' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
          )}>
            {status.replace('_', ' ')}
          </span>
        </div>
      )
    },
  },
]

export function ItemTable() {
  const { items, fetchItems, deleteItem } = useInventoryStore()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const table = useReactTable({
    data: items,
    columns: [
      ...columns.filter(c => (c as any).id !== 'actions'),
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-zinc-100 transition-colors cursor-pointer outline-none">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.sku)}>
                  Copy SKU
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  try {
                    await deleteItem(row.original.id)
                    toast.success("Item removed from registry")
                  } catch (e) {
                    toast.error("Failed to delete item")
                  }
                }} className="text-red-600">
                  Delete connection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }
    ],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder="Search SKUs or names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm rounded-none bg-white border-zinc-200 font-mono text-xs"
          />
          <Button variant="outline" size="sm" className="rounded-none gap-2 font-mono text-[10px] uppercase">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-none gap-2 text-zinc-600 font-mono text-[10px] uppercase">
            <Download className="w-4 h-4" /> Export_Data
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="rounded-none gap-2 bg-zinc-900 hover:bg-zinc-800 font-mono text-[10px] uppercase">
            <Package className="w-4 h-4" /> Add_Asset
          </Button>
        </div>
      </div>
      
      <AddItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-none">
        <Table>
          <TableHeader className="bg-zinc-50 border-b border-zinc-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-zinc-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-zinc-50 transition-colors border-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-slate-500 font-medium">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-full"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
