import { Badge } from "@/components/ui/badge"

type Platform = "Instagram" | "TikTok" | "Instagram + TikTok"

interface PlatformBadgeProps {
  platform: Platform
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const getPlatformStyles = (platform: Platform) => {
    switch (platform) {
      case "Instagram":
        return "bg-pink-50 text-pink-700 border-pink-200"
      case "TikTok":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Instagram + TikTok":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <Badge variant="outline" className={getPlatformStyles(platform)}>
      {platform}
    </Badge>
  )
}
