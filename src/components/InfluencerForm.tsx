import { FormState } from "../types";
import { useModalFocus } from "../hooks/useModalFocus";

interface Props {
  formState: FormState;
  setFormState: (state: FormState | ((prev: FormState) => FormState)) => void;
  onSubmit: () => void;
  onClose: () => void;
  onDelete?: () => void;
  isEditing: boolean;
}

export function InfluencerForm({
  formState,
  setFormState,
  onSubmit,
  onClose,
  onDelete,
  isEditing,
}: Props) {
  const modalRef = useModalFocus(true);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl overflow-hidden relative animate-modal-pop shadow-modal flex flex-col max-h-[90vh]"
      >
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 id="form-title" className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Influencer" : "Add Influencer"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isEditing
                ? "Update influencer details and campaign information"
                : "Enter the influencer's details and campaign information below"}
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

        <div className="p-8 overflow-y-auto">
          <div className="space-y-8">
            {/* Platform and Username Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Platform Details
                </h3>
                <div className="space-y-4">
                  {/* Platform Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formState.platform}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          platform: e.target.value as
                            | "Instagram"
                            | "TikTok"
                            | "Both",
                        })
                      }
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  {/* Views Fields */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Views Median
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      value={formState.viewsMedian}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          viewsMedian: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Username Details
                </h3>
                <div className="space-y-4">
                  {/* Username Fields */}
                  {formState.platform === "Both" && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formState.sameUsername}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormState((prev) => ({
                              ...prev,
                              sameUsername: checked,
                              tiktokUsername: checked ? prev.username : "",
                            }));
                          }}
                        />
                        <span className="text-sm text-blue-800">
                          Same username on both platforms?
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        {formState.platform === "Both"
                          ? "Instagram Username"
                          : `${formState.platform} Username`}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                          @
                        </span>
                        <input
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="username"
                          value={formState.username}
                          onChange={(e) => {
                            const newUsername = e.target.value;
                            setFormState((prev) => ({
                              ...prev,
                              username: newUsername,
                              ...(prev.sameUsername && {
                                tiktokUsername: newUsername,
                              }),
                            }));
                          }}
                        />
                      </div>
                    </div>

                    {formState.platform === "Both" && (
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          TikTok Username
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                            @
                          </span>
                          <input
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="username"
                            value={formState.tiktokUsername || ""}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                tiktokUsername: e.target.value,
                              })
                            }
                            disabled={formState.sameUsername}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Campaign Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formState.videos.map((video, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Video #{idx + 1}
                      </span>
                      <select
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={video.status}
                        onChange={(e) => {
                          const videos = [...formState.videos];
                          videos[idx].status = e.target.value as
                            | "script"
                            | "approve"
                            | "posted";
                          setFormState({ ...formState, videos });
                        }}
                      >
                        <option value="script">Script</option>
                        <option value="approve">Approve</option>
                        <option value="posted">Posted</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Video Link"
                        value={video.link}
                        onChange={(e) => {
                          const videos = [...formState.videos];
                          videos[idx].link = e.target.value;
                          setFormState({ ...formState, videos });
                        }}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={video.postedOn}
                          onChange={(e) => {
                            const videos = [...formState.videos];
                            videos[idx].postedOn = e.target.value;
                            // Auto-set status to "posted" when a date is added
                            if (e.target.value) {
                              videos[idx].status = "posted";
                            }
                            setFormState({ ...formState, videos });
                          }}
                        />
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Views"
                          value={video.views || ""}
                          onChange={(e) => {
                            const videos = [...formState.videos];
                            videos[idx].views = e.target.value;
                            setFormState({ ...formState, videos });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Delete Influencer
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            {isEditing ? "Save Changes" : "Add Influencer"}
          </button>
        </div>
      </div>
    </div>
  );
}
