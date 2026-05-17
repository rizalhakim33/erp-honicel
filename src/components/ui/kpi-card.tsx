import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  icon: LucideIcon
  color?: "slate" | "orange" | "blue" | "green" | "red"
  loading?: boolean
  href?: string
}

const colorVariants = {
  slate: "bg-slate-100 text-slate-600",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
}

export function KPICard({ 
  title, 
  value, 
  unit, 
  change, 
  icon: Icon, 
  color = "slate",
  loading,
  href
}: KPICardProps) {
  const content = (
    <Card className={cn(
      "overflow-hidden border border-zinc-200 rounded-none shadow-none bg-white",
      href && "hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">{title}</p>
          <Icon className={cn("w-4 h-4", {
            "text-blue-500": color === "blue",
            "text-orange-500": color === "orange",
            "text-green-500": color === "green",
            "text-red-500": color === "red",
            "text-zinc-400": color === "slate",
          })} />
        </div>
        
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-light font-mono tracking-tight text-zinc-900">{value}</h3>
          {unit && <span className="text-[10px] font-mono text-zinc-400 uppercase">{unit}</span>}
        </div>

        {change !== undefined ? (
          <div className="mt-2 flex items-center gap-1">
            <span className={cn(
              "text-[10px] font-bold",
              change >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {change >= 0 ? "+" : ""}{change}%
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">v. LMR</span>
          </div>
        ) : (
          <div className="mt-2 text-[10px] text-zinc-400 font-mono italic">Operational System: Online</div>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link to={href}>{content}</Link>
  }

  return content
}
