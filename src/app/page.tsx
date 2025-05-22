"use client";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

/*************************************
 * Types
 *************************************/
interface Video {
  id: 1 | 2 | 3 | 4;
  link: string;
  postedOn: string; // ISO string or ""
  views?: number; // optional views now for that video
  status: "script" | "approve" | "posted";
}

interface Influencer {
  id: string;
  username: string;
  tiktokUsername?: string;
  platform: "Instagram" | "TikTok" | "Both";
  viewsMedian: number;
  viewsTotal: number; // auto viewsMedian * 5
  viewsNow: number;
  videos: Video[];
  paid: boolean;
}

interface FormState {
  username: string;
  tiktokUsername?: string;
  platform: "Instagram" | "TikTok" | "Both";
  viewsMedian: string;
  viewsNow: string;
  videos: {
    link: string;
    postedOn: string;
    status: "script" | "approve" | "posted";
  }[];
}

/*************************************
 * Helpers
 *************************************/
const STORAGE_KEY = "influencers";

const SAMPLE_DATA: Influencer[] = [
  {
    id: "inf-1",
    username: "fitnessguru",
    platform: "Both",
    tiktokUsername: "fitnessguru.official",
    viewsMedian: 150000,
    viewsTotal: 750000,
    viewsNow: 180000,
    paid: false,
    videos: [
      {
        id: 1,
        link: "https://instagram.com/p/sample1",
        postedOn: "2024-03-15",
        views: 155000,
        status: "posted",
      },
      {
        id: 2,
        link: "https://instagram.com/p/sample2",
        postedOn: "",
        views: 0,
        status: "approve",
      },
      {
        id: 3,
        link: "",
        postedOn: "",
        views: 0,
        status: "script",
      },
      {
        id: 4,
        link: "",
        postedOn: "",
        views: 0,
        status: "script",
      },
    ],
  },
  {
    id: "inf-2",
    username: "techreviewpro",
    platform: "Instagram",
    viewsMedian: 75000,
    viewsTotal: 375000,
    viewsNow: 85000,
    paid: true,
    videos: [
      {
        id: 1,
        link: "https://instagram.com/p/tech1",
        postedOn: "2024-03-10",
        views: 82000,
        status: "posted",
      },
      {
        id: 2,
        link: "https://instagram.com/p/tech2",
        postedOn: "2024-03-17",
        views: 88000,
        status: "posted",
      },
      {
        id: 3,
        link: "https://instagram.com/p/tech3",
        postedOn: "",
        views: 0,
        status: "approve",
      },
      {
        id: 4,
        link: "",
        postedOn: "",
        views: 0,
        status: "script",
      },
    ],
  },
  {
    id: "inf-3",
    username: "dancequeen",
    platform: "TikTok",
    viewsMedian: 250000,
    viewsTotal: 1250000,
    viewsNow: 300000,
    paid: false,
    videos: [
      {
        id: 1,
        link: "https://tiktok.com/@dancequeen/video1",
        postedOn: "2024-03-01",
        views: 275000,
        status: "posted",
      },
      {
        id: 2,
        link: "https://tiktok.com/@dancequeen/video2",
        postedOn: "2024-03-08",
        views: 325000,
        status: "posted",
      },
      {
        id: 3,
        link: "https://tiktok.com/@dancequeen/video3",
        postedOn: "2024-03-16",
        views: 290000,
        status: "posted",
      },
      {
        id: 4,
        link: "",
        postedOn: "",
        views: 0,
        status: "approve",
      },
    ],
  },
];

const loadInfluencers = (): Influencer[] => {
  if (typeof window === "undefined") return SAMPLE_DATA;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // If no data in localStorage, save and return sample data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
      return SAMPLE_DATA;
    }
    const parsed = JSON.parse(raw) as Influencer[];
    // If parsed data is empty array, use sample data instead
    if (Array.isArray(parsed) && parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
      return SAMPLE_DATA;
    }
    return parsed;
  } catch (e) {
    console.warn("Failed to parse influencers from localStorage", e);
    return SAMPLE_DATA;
  }
};

const saveInfluencers = (data: Influencer[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/*************************************
 * Main Component
 *************************************/
export default function InfluencerTracker() {
  const [influencers, setInfluencers] = useState<Influencer[]>(SAMPLE_DATA);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "script" | "approve" | "posted">(
    "all"
  );
  const [isClient, setIsClient] = useState(false);

  // form state
  const [formState, setFormState] = useState<FormState>({
    username: "",
    platform: "Instagram",
    viewsMedian: "",
    viewsNow: "",
    videos: Array.from({ length: 4 }, () => ({
      link: "",
      postedOn: "",
      status: "script",
    })),
  });

  // Add edit state
  const [editingInfluencer, setEditingInfluencer] = useState<string | null>(
    null
  );

  // Add new state for video modal
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedInfluencers = loadInfluencers();
    setInfluencers(savedInfluencers);
  }, []);

  // Save when influencers change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(influencers));
    }
  }, [influencers]);

  // Derived stats
  const campaignViewsTotal = influencers.reduce(
    (acc, cur) => acc + cur.viewsTotal,
    0
  );
  const campaignViewsNow = influencers.reduce(
    (acc, cur) => acc + cur.viewsNow,
    0
  );

  // Add getStatusColor helper function
  const getStatusColor = (status: Video["status"]) => {
    switch (status) {
      case "posted":
        return "bg-green-100 text-green-800";
      case "approve":
        return "bg-yellow-100 text-yellow-800";
      case "script":
        return "bg-red-100 text-red-800";
    }
  };

  /************ Handlers ************/
  const resetForm = () => {
    setFormState({
      username: "",
      platform: "Instagram",
      viewsMedian: "",
      viewsNow: "",
      videos: Array.from({ length: 4 }, () => ({
        link: "",
        postedOn: "",
        status: "script",
      })),
    });
    setEditingInfluencer(null);
  };

  // Add edit handler
  const handleEditInfluencer = (influencer: Influencer) => {
    setFormState({
      username: influencer.username,
      tiktokUsername: influencer.tiktokUsername,
      platform: influencer.platform,
      viewsMedian: influencer.viewsMedian.toString(),
      viewsNow: influencer.viewsNow.toString(),
      videos: influencer.videos.map((v) => ({
        link: v.link,
        postedOn: v.postedOn,
        status: v.status,
      })),
    });
    setEditingInfluencer(influencer.id);
    setShowForm(true);
  };

  // Update save handler
  const handleAddInfluencer = () => {
    // Basic validation
    if (!formState.username.trim()) return alert("Username required");
    if (formState.platform === "Both" && !formState.tiktokUsername?.trim()) {
      return alert("TikTok username required when both platforms are selected");
    }

    const viewsMedianNum = Number(formState.viewsMedian);
    const viewsNowNum = Number(formState.viewsNow || 0);

    const newInf: Influencer = {
      id: editingInfluencer || uuid(),
      username: formState.username.trim(),
      ...(formState.platform === "Both" && {
        tiktokUsername: formState.tiktokUsername?.trim(),
      }),
      platform: formState.platform,
      viewsMedian: viewsMedianNum,
      viewsTotal: viewsMedianNum * 5,
      viewsNow: viewsNowNum,
      videos: formState.videos.map((v, idx) => ({
        id: (idx + 1) as 1 | 2 | 3 | 4,
        link: v.link.trim(),
        postedOn: v.postedOn,
        status: v.status,
      })),
      paid: false,
    };

    setInfluencers((prev) => {
      if (editingInfluencer) {
        return prev.map((inf) => (inf.id === editingInfluencer ? newInf : inf));
      }
      return [...prev, newInf];
    });
    setEditingInfluencer(null);
    resetForm();
    setShowForm(false);
  };

  const togglePaid = (id: string) => {
    setInfluencers((prev) =>
      prev.map((inf) => (inf.id === id ? { ...inf, paid: !inf.paid } : inf))
    );
  };

  // Add delete handler
  const handleDeleteInfluencer = (id: string) => {
    if (window.confirm("Are you sure you want to delete this influencer?")) {
      setInfluencers((prev) => prev.filter((inf) => inf.id !== id));
      setShowForm(false);
    }
  };

  /************ Derived ************/
  const filteredInfluencers = influencers.filter((inf) => {
    if (filter === "all") return true;
    return inf.videos.some((v) => v.status === filter);
  });

  /*************************************
   * Render
   *************************************/
  return (
    <main className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Influencer Post Tracker
        </h1>
        <p className="text-gray-600 mt-1">
          Track and manage influencer campaign posts
        </p>
      </div>

      {/* Legend and Controls */}
      <div className="mb-8 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="w-full sm:w-auto appearance-none bg-white border rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="script">Script Needed</option>
                <option value="approve">Needs Approval</option>
                <option value="posted">Posted</option>
              </select>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="w-full sm:w-auto bg-black text-white rounded-md px-4 py-2 text-sm font-medium flex items-center justify-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Influencer
            </button>
          </div>

          {/* Status Legend */}
          <div className="bg-gray-50 px-4 py-3 rounded-lg w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="grid grid-cols-2 sm:flex items-start sm:items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Posted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600">Needs Approval</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">Script Needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
          <div className="relative p-6 border border-blue-100">
            <h3 className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">
              Total Influencers
            </h3>
            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {influencers.length}
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
          <div className="relative p-6 border border-blue-100">
            <h3 className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">
              Total Campaign Views
            </h3>
            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {campaignViewsTotal.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
          <div className="relative p-6 border border-blue-100">
            <h3 className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">
              Current Views
            </h3>
            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {campaignViewsNow.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Platform
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Views Median
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Total Views
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Views Now
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Videos
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInfluencers.map((inf) => (
                  <tr key={inf.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inf.username}
                      </div>
                      {inf.platform === "Both" && (
                        <div className="text-sm text-gray-500">
                          {inf.tiktokUsername || inf.username}
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {(inf.platform === "Instagram" ||
                          inf.platform === "Both") && (
                          <div className="bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                            <a
                              href={`https://instagram.com/${inf.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <span>Instagram</span>
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4"
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
                            </a>
                          </div>
                        )}
                        {(inf.platform === "TikTok" ||
                          inf.platform === "Both") && (
                          <div className="bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                            <a
                              href={`https://tiktok.com/@${
                                inf.tiktokUsername || inf.username
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <span>TikTok</span>
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4"
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
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-sm text-gray-900">
                        {inf.viewsMedian.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-sm text-gray-900">
                        {inf.viewsTotal.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm text-gray-900">
                        {inf.viewsNow.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="flex -space-x-1">
                          {inf.videos.map((video, idx) => (
                            <div
                              key={idx}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${getStatusColor(
                                video.status
                              )}`}
                              title={`Video #${idx + 1}: ${video.status}`}
                            >
                              {idx + 1}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setSelectedInfluencer(inf)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {inf.videos.some((v) => v.status === "script") ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Script needed
                        </span>
                      ) : inf.videos.some((v) => v.status === "approve") ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Approve needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Posted
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditInfluencer(inf)}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile View Stats (visible below sm breakpoint) */}
      <div className="sm:hidden space-y-4 mt-4">
        {filteredInfluencers.map((inf) => (
          <div
            key={inf.id}
            className="bg-white p-4 rounded-lg border space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{inf.username}</div>
                {inf.platform === "Both" && (
                  <div className="text-sm text-gray-500">
                    {inf.tiktokUsername}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleEditInfluencer(inf)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">Views Median</div>
                <div className="font-medium">
                  {inf.viewsMedian.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">Current Views</div>
                <div className="font-medium">
                  {inf.viewsNow.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-1">
                {inf.videos.map((video, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${getStatusColor(
                      video.status
                    )}`}
                    title={`Video #${idx + 1}: ${video.status}`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedInfluencer(inf)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Influencer Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl overflow-hidden relative animate-modal-pop shadow-modal flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingInfluencer ? "Edit Influencer" : "Add Influencer"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingInfluencer
                    ? "Update influencer details"
                    : "Enter the influencer's details below"}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Platform
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
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

                {/* Username Fields */}
                <div className="space-y-4">
                  {formState.platform === "Both" ? (
                    <>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Copy Instagram username to TikTok
                                setFormState((prev) => ({
                                  ...prev,
                                  tiktokUsername: prev.username,
                                }));
                              }
                            }}
                          />
                          <span className="text-sm text-blue-800">
                            Same username on both platforms?
                          </span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
                            Instagram Username
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                              @
                            </span>
                            <input
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                              placeholder="username"
                              value={formState.username}
                              onChange={(e) =>
                                setFormState({
                                  ...formState,
                                  username: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
                            TikTok Username
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                              @
                            </span>
                            <input
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                              placeholder="username"
                              value={formState.tiktokUsername || ""}
                              onChange={(e) =>
                                setFormState({
                                  ...formState,
                                  tiktokUsername: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        {formState.platform} Username
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                          @
                        </span>
                        <input
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                          placeholder="username"
                          value={formState.username}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Views Median
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
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

                {/* Videos Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Videos
                  </h3>
                  <div className="space-y-4">
                    {formState.videos.map((video, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Video #{idx + 1}
                          </span>
                          <select
                            className="text-sm px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={video.status}
                            onChange={(e) => {
                              const videos = [...formState.videos];
                              videos[idx].status = e.target
                                .value as Video["status"];
                              setFormState({ ...formState, videos });
                            }}
                          >
                            <option value="script">Script</option>
                            <option value="approve">Approve</option>
                            <option value="posted">Posted</option>
                          </select>
                        </div>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                          placeholder="Video Link"
                          value={video.link}
                          onChange={(e) => {
                            const videos = [...formState.videos];
                            videos[idx].link = e.target.value;
                            setFormState({ ...formState, videos });
                          }}
                        />
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                          value={video.postedOn}
                          onChange={(e) => {
                            const videos = [...formState.videos];
                            videos[idx].postedOn = e.target.value;
                            setFormState({ ...formState, videos });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between mt-auto">
              <div>
                {editingInfluencer && (
                  <button
                    onClick={() => handleDeleteInfluencer(editingInfluencer)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-600 transition-all duration-200"
                  >
                    Delete Influencer
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddInfluencer}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {editingInfluencer ? "Save Changes" : "Add Influencer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Videos Modal */}
      {selectedInfluencer && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInfluencer(null);
          }}
        >
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl animate-modal-pop max-h-[90vh] flex flex-col">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Videos for @{selectedInfluencer.username}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedInfluencer.platform === "Both"
                    ? `Instagram & TikTok (@${selectedInfluencer.tiktokUsername})`
                    : selectedInfluencer.platform}
                </p>
              </div>
              <button
                onClick={() => setSelectedInfluencer(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              <div className="grid grid-cols-1 gap-4">
                {selectedInfluencer.videos.map((video, idx) => (
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
                  Total Views: {selectedInfluencer.viewsTotal.toLocaleString()}
                </div>
                <button
                  onClick={() => setSelectedInfluencer(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
