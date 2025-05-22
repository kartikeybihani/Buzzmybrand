import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoData } from "@/lib/types";

interface AddVideoDialogProps {
  videoData: VideoData;
  onVideoChange: (field: keyof VideoData, value: string | number) => void;
  onSave: () => void;
  onClose: () => void;
}

export function AddVideoDialog({
  videoData,
  onVideoChange,
  onSave,
  onClose,
}: AddVideoDialogProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Video</DialogTitle>
        <DialogDescription>
          Add a new video for this influencer.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="videoLink">Video Link</Label>
          <Input
            id="videoLink"
            value={videoData.link}
            onChange={(e) => onVideoChange("link", e.target.value)}
            placeholder="e.g., https://www.instagram.com/p/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoPostedOn">Posted On</Label>
          <Input
            id="videoPostedOn"
            value={videoData.postedOn}
            onChange={(e) => onVideoChange("postedOn", e.target.value)}
            placeholder="DD.MM.YYYY"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoViews">Views</Label>
          <Input
            id="videoViews"
            type="number"
            value={videoData.views}
            onChange={(e) => onVideoChange("views", Number(e.target.value))}
            placeholder="e.g., 10000"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Video</Button>
      </DialogFooter>
    </DialogContent>
  );
}
