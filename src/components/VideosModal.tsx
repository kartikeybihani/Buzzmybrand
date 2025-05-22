import { Influencer } from "../types";
import { useModalFocus } from "../hooks/useModalFocus";
import { getStatusColor } from "../utils/influencer";

interface Props {
  influencer: Influencer;
  onClose: () => void;
}

export function VideosModal({ influencer, onClose }: Props) {
  const modalRef = useModalFocus(true);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="videos-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl animate-modal-pop max-h-[90vh] flex flex-col"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div>
            <h2 id="videos-title" className="text-xl font-bold text-gray-900">
              Videos for @{influencer.username}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {influencer.platform === "Both"
                ? `Instagram & TikTok (@${influencer.tiktokUsername})`
                : influencer.platform}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {influencer.videos.map((video, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    Video #{idx + 1}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                      video.status
                    )}`}
                  >
                    {video.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {video.link && (
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Post
                    </a>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Posted: {video.postedOn || "—"}</span>
                    <span>{video.views?.toLocaleString() || 0} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total Views: {influencer.viewsTotal.toLocaleString()}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
