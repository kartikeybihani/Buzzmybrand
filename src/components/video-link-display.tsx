interface VideoData {
  link: string
  postedOn: string
  views: number
}

interface VideoLinkDisplayProps {
  videoNumber: number
  videoData: VideoData
}

export function VideoLinkDisplay({ videoNumber, videoData }: VideoLinkDisplayProps) {
  if (!videoData.link) return null

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs">
      <a
        href={videoData.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 font-medium"
      >
        Video #{videoNumber}
      </a>
      <span className="text-gray-500">
        {videoData.postedOn && `Posted: ${videoData.postedOn}`}
        {videoData.postedOn && videoData.views > 0 && " • "}
        {videoData.views > 0 && `Views: ${videoData.views.toLocaleString()}`}
      </span>
    </div>
  )
}
