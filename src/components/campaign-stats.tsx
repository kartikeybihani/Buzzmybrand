import { Card, CardContent } from "@/components/ui/card"

interface CampaignStatsProps {
  influencerCount: number
  totalCampaignViews: number
  totalViewsNow: number
}

export function CampaignStats({ influencerCount, totalCampaignViews, totalViewsNow }: CampaignStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{influencerCount}</div>
          <p className="text-sm text-gray-500">Total Influencers</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{totalCampaignViews.toLocaleString()}</div>
          <p className="text-sm text-gray-500">Total Campaign Views</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{totalViewsNow.toLocaleString()}</div>
          <p className="text-sm text-gray-500">Current Views</p>
        </CardContent>
      </Card>
    </div>
  )
}
