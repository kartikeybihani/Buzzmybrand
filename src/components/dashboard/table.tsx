import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Influencer, Status } from "@/lib/types";

interface TableProps {
  influencers: Influencer[];
  onProfileClick: (influencer: Influencer) => void;
  onStatusChange: (id: string, status: Status) => void;
  onAddVideo: (id: string) => void;
}

export function InfluencerTable({
  influencers,
  onProfileClick,
  onStatusChange,
  onAddVideo,
}: TableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <ScrollArea className="h-[400px] sm:h-[500px] rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Views Median</TableHead>
                <TableHead className="text-right">Total Views</TableHead>
                <TableHead className="text-right">Views Now</TableHead>
                <TableHead>Video Links</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencers.length > 0 ? (
                influencers.map((influencer) => (
                  <TableRow key={influencer.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => onProfileClick(influencer)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {influencer.username}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          influencer.platform === "Instagram"
                            ? "bg-pink-50 text-pink-700 border-pink-200"
                            : influencer.platform === "TikTok"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }
                      >
                        {influencer.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {influencer.viewsMedian.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {influencer.totalViews.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {influencer.viewsNow.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {Object.entries(influencer.videos).map(
                          ([key, video], index) =>
                            video.link && (
                              <div
                                key={key}
                                className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs"
                              >
                                <a
                                  href={video.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 font-medium"
                                >
                                  Video #{index + 1}
                                </a>
                                <span className="text-gray-500">
                                  {video.postedOn &&
                                    `Posted: ${video.postedOn}`}
                                  {video.postedOn && video.views > 0 && " • "}
                                  {video.views > 0 &&
                                    `Views: ${video.views.toLocaleString()}`}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          influencer.status === "Posted"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : influencer.status === "Script needed"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : influencer.status === "Approve needed"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {influencer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select
                          onValueChange={(value) =>
                            onStatusChange(influencer.id, value as Status)
                          }
                          defaultValue={influencer.status}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Posted">Posted</SelectItem>
                            <SelectItem value="Script needed">
                              Script needed
                            </SelectItem>
                            <SelectItem value="Approve needed">
                              Approve needed
                            </SelectItem>
                            <SelectItem value="Draft requested">
                              Draft requested
                            </SelectItem>
                            <SelectItem value="In progress">
                              In progress
                            </SelectItem>
                            <SelectItem value="Script is ready">
                              Script is ready
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddVideo(influencer.id)}
                          className="h-8"
                        >
                          Add Video
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No influencers found. Add some to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
