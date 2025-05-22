import { Card, CardContent } from "@/components/ui/card";
import { Influencer } from "@/lib/types";

interface StatsProps {
  influencers: Influencer[];
}

export function DashboardStats({ influencers }: StatsProps) {
  const calculateTotalCampaignViews = () => {
    return influencers.reduce(
      (total, influencer) => total + influencer.totalViews,
      0
    );
  };

  const calculateTotalViewsNow = () => {
    return influencers.reduce(
      (total, influencer) => total + influencer.viewsNow,
      0
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 sm:p-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{influencers.length}</div>
          <p className="text-sm text-gray-500">Total Influencers</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {calculateTotalCampaignViews().toLocaleString()}
          </div>
          <p className="text-sm text-gray-500">Total Campaign Views</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {calculateTotalViewsNow().toLocaleString()}
          </div>
          <p className="text-sm text-gray-500">Current Views</p>
        </CardContent>
      </Card>
    </div>
  );
}
