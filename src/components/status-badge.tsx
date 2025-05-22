import { Badge } from "@/components/ui/badge"

type Status = "Posted" | "Script needed" | "Approve needed" | "Draft requested" | "In progress" | "Script is ready"

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: Status) => {
    switch (status) {
      case "Posted":
        return "bg-green-50 text-green-700 border-green-200"
      case "Script needed":
        return "bg-red-50 text-red-700 border-red-200"
      case "Approve needed":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Draft requested":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "In progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Script is ready":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return <Badge className={getStatusStyles(status)}>{status}</Badge>
}
