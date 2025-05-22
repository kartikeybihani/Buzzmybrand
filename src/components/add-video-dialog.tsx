"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface VideoData {
  link: string
  postedOn: string
  views: number
}

interface AddVideoDialogProps {
  isOpen: boolean
  onClose: () => void
  videoData: VideoData
  onVideoDataChange: (field: keyof VideoData, value: string | number) => void
  onSave: () => void
}

export function AddVideoDialog({ isOpen, onClose, videoData, onVideoDataChange, onSave }: AddVideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>Add a new video for this influencer.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="videoLink">Video Link</Label>
            <Input
              id="videoLink"
              value={videoData.link}
              onChange={(e) => onVideoDataChange("link", e.target.value)}
              placeholder="e.g., https://www.instagram.com/p/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoPostedOn">Posted On</Label>
            <Input
              id="videoPostedOn"
              value={videoData.postedOn}
              onChange={(e) => onVideoDataChange("postedOn", e.target.value)}
              placeholder="DD.MM.YYYY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoViews">Views</Label>
            <Input
              id="videoViews"
              type="number"
              value={videoData.views || ""}
              onChange={(e) => onVideoDataChange("views", Number(e.target.value))}
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
    </Dialog>
  )
}
