import { useModalFocus } from "../hooks/useModalFocus";

interface Props {
  onClose: () => void;
}

export function AnalyticsModal({ onClose }: Props) {
  const modalRef = useModalFocus(true);

  const ComingSoonBox = ({ title }: { title: string }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="h-64 flex flex-col items-center justify-center">
        <div className="text-sm font-medium text-gray-400 bg-white/50 px-4 py-2 rounded-full">
          Coming Soon
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Analytics features are under development
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-4xl overflow-hidden shadow-xl animate-modal-pop max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2
              id="analytics-title"
              className="text-xl font-bold text-gray-900"
            >
              Campaign Analytics
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Detailed performance metrics and insights
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
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComingSoonBox title="Platform Distribution" />
            <ComingSoonBox title="Views Over Time" />
            <ComingSoonBox title="Content Status" />
            <ComingSoonBox title="Top Performing Content" />
          </div>
        </div>
      </div>
    </div>
  );
}
