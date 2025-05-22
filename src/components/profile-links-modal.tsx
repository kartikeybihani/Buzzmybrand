import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Platform } from "@/lib/types";

interface ProfileLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  profileLink: string;
  platform: Platform;
}

export function ProfileLinksModal({
  isOpen,
  onClose,
  username,
  profileLink,
  platform,
}: ProfileLinksModalProps) {
  if (!isOpen) return null;

  const isPlatformBoth = platform === "Instagram + TikTok";

  // Extract base username from profile link or use the username directly
  const baseUsername = username.replace(/[^a-zA-Z0-9_]/g, "");

  // Create platform-specific links
  const instagramLink = isPlatformBoth
    ? profileLink.includes("instagram")
      ? profileLink
      : `https://www.instagram.com/${baseUsername}/`
    : platform === "Instagram"
    ? profileLink
    : "";

  const tiktokLink = isPlatformBoth
    ? profileLink.includes("tiktok")
      ? profileLink
      : `https://www.tiktok.com/@${baseUsername}/`
    : platform === "TikTok"
    ? profileLink
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Visit {username}'s Profiles</DialogTitle>
          <DialogDescription>
            Choose which platform you want to visit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {(platform === "Instagram" || isPlatformBoth) && (
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-600"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              Instagram
            </a>
          )}
          {(platform === "TikTok" || isPlatformBoth) && (
            <a
              href={tiktokLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 0"></path>
                <path d="M15 2v20"></path>
                <path d="M9 16v4"></path>
              </svg>
              TikTok
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
