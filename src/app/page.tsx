"use client";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Image from "next/image";
import { Influencer, FormState } from "../types";
import {
  loadInfluencers,
  saveInfluencers,
  getInfluencerStatus,
  getStatusColor,
} from "../utils/influencer";
import { InfluencerForm } from "../components/InfluencerForm";
import { VideosModal } from "../components/VideosModal";
import { AnalyticsModal } from "../components/AnalyticsModal";

export default function InfluencerTracker() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "script" | "approve" | "posted" | "paid"
  >("all");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingInfluencer, setEditingInfluencer] = useState<string | null>(
    null
  );
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

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

  useEffect(() => {
    const savedInfluencers = loadInfluencers();
    setInfluencers(savedInfluencers);
  }, []);

  // Derived stats
  const campaignViewsTotal = influencers.reduce(
    (acc, cur) => acc + cur.viewsTotal,
    0
  );
  const campaignViewsNow = influencers.reduce(
    (acc, cur) => acc + cur.viewsNow,
    0
  );

  // Handlers
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
      const updated = editingInfluencer
        ? prev.map((inf) => (inf.id === editingInfluencer ? newInf : inf))
        : [...prev, newInf];
      saveInfluencers(updated);
      return updated;
    });

    setEditingInfluencer(null);
    resetForm();
    setShowForm(false);
  };

  const handleDeleteInfluencer = (id: string) => {
    if (window.confirm("Are you sure you want to delete this influencer?")) {
      setInfluencers((prev) => {
        const updated = prev.filter((inf) => inf.id !== id);
        saveInfluencers(updated);
        return updated;
      });
      setShowForm(false);
    }
  };

  const togglePaid = (id: string) => {
    setInfluencers((prev) => {
      const updated = prev.map((inf) =>
        inf.id === id ? { ...inf, paid: !inf.paid } : inf
      );
      saveInfluencers(updated);
      return updated;
    });
  };

  // Filter influencers
  const filteredInfluencers = influencers.filter((inf) => {
    const matchesSearch =
      inf.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inf.tiktokUsername &&
        inf.tiktokUsername.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const status = getInfluencerStatus(inf);

    switch (filter) {
      case "all":
        return true;
      case "paid":
        return inf.paid;
      case "script":
        return status.text === "Script Needed";
      case "approve":
        return status.text === "Needs Approval";
      case "posted":
        return status.text === "Posted";
      default:
        return true;
    }
  });

  return (
    <main className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-auto">
            <Image
              src="/buzz.png"
              alt="BuzzMyBrand Logo"
              width={60}
              height={60}
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Influencer Campaign Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage influencer campaign posts
            </p>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search influencers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-black text-white rounded-lg px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors whitespace-nowrap"
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

      {/* Status Legend and Stats */}
      <div className="mb-8">
        <div className="bg-gray-50 px-6 py-4 rounded-lg">
          {/* Legend as Filter Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">
              Filter by:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-gray-900 text-white shadow-sm border-2 border-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("posted")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "posted"
                    ? "bg-green-50 text-green-800 shadow-sm border-2 border-green-500"
                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                }`}
              >
                <div className="w-2 h-2 rounded-sm bg-green-500"></div>
                Posted
              </button>
              <button
                onClick={() => setFilter("approve")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "approve"
                    ? "bg-yellow-50 text-yellow-800 shadow-sm border-2 border-yellow-500"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                }`}
              >
                <div className="w-2 h-2 rounded-sm bg-yellow-500"></div>
                Needs Approval
              </button>
              <button
                onClick={() => setFilter("script")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "script"
                    ? "bg-red-50 text-red-800 shadow-sm border-2 border-red-500"
                    : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                }`}
              >
                <div className="w-2 h-2 rounded-sm bg-red-500"></div>
                Script Needed
              </button>
              <button
                onClick={() => setFilter("paid")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "paid"
                    ? "bg-gray-100 text-gray-800 shadow-sm border-2 border-gray-400"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="w-2 h-2 rounded-sm bg-gray-500"></div>
                Paid
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  Total Campaign Views
                </h3>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {campaignViewsTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  Current Views
                </h3>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {campaignViewsNow.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Analytics Button */}
          <button
            onClick={() => setShowAnalytics(true)}
            className="w-full bg-black text-white rounded-md px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            View Analytics
          </button>
        </div>
      </div>

      {/* Table/Cards Container */}
      <div>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Platform
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Views Median
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Total Views
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Views Now
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Videos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInfluencers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            {influencers.length === 0 ? (
                              <>
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                  <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                  </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  Start Adding Influencers
                                </h3>
                                <p className="text-sm text-gray-500 mb-6 max-w-sm text-center">
                                  Track and manage your influencer campaign
                                  posts by adding your first influencer
                                </p>
                                <button
                                  onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                  }}
                                  className="bg-black text-white rounded-lg px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
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
                                  Add Your First Influencer
                                </button>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-12 h-12 text-gray-400 mb-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  No influencers found
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {searchQuery
                                    ? `No influencers match "${searchQuery}"`
                                    : filter !== "all"
                                    ? `No influencers with status "${filter}"`
                                    : "Try adjusting your filters"}
                                </p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredInfluencers.map((inf) => (
                        <tr
                          key={inf.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            inf.paid ? "opacity-60" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={inf.paid}
                                onChange={() => togglePaid(inf.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                aria-label="Mark as paid"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {inf.username}
                                </div>
                                {inf.platform === "Both" && (
                                  <div className="text-sm text-gray-500">
                                    {inf.tiktokUsername || inf.username}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              {(inf.platform === "Instagram" ||
                                inf.platform === "Both") && (
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                  <a
                                    href={`https://instagram.com/${inf.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                  >
                                    <span>Instagram</span>
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
                                  </a>
                                </div>
                              )}
                              {(inf.platform === "TikTok" ||
                                inf.platform === "Both") && (
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                  <a
                                    href={`https://tiktok.com/@${
                                      inf.tiktokUsername || inf.username
                                    }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                  >
                                    <span>TikTok</span>
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
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {inf.viewsMedian.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {inf.viewsTotal.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {inf.viewsNow.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div className="flex -space-x-1">
                                {inf.videos.map((video, idx) => {
                                  const statusColor = getStatusColor(
                                    video.status,
                                    inf.paid
                                  );
                                  return (
                                    <div
                                      key={idx}
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${statusColor}`}
                                      title={`Video #${idx + 1}: ${
                                        video.status
                                      }`}
                                    >
                                      {idx + 1}
                                    </div>
                                  );
                                })}
                              </div>
                              <button
                                onClick={() => setSelectedInfluencer(inf)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const status = getInfluencerStatus(inf);
                              return (
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                                >
                                  {status.text}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredInfluencers.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center">
                {influencers.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Start Adding Influencers
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm text-center">
                      Track and manage your influencer campaign posts by adding
                      your first influencer
                    </p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                      className="bg-black text-white rounded-lg px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
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
                      Add Your First Influencer
                    </button>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No influencers found
                    </h3>
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? `No influencers match "${searchQuery}"`
                        : filter !== "all"
                        ? `No influencers with status "${filter}"`
                        : "Try adjusting your filters"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            filteredInfluencers.map((inf) => (
              <div
                key={inf.id}
                className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                  inf.paid ? "opacity-60" : ""
                }`}
              >
                {/* Card Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={inf.paid}
                        onChange={() => togglePaid(inf.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          @{inf.username}
                        </div>
                        {inf.platform === "Both" && (
                          <div className="text-xs text-gray-500">
                            @{inf.tiktokUsername || inf.username}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {(() => {
                        const status = getInfluencerStatus(inf);
                        return (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                          >
                            {status.text}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  {/* Platform Links */}
                  <div className="flex gap-2">
                    {(inf.platform === "Instagram" ||
                      inf.platform === "Both") && (
                      <a
                        href={`https://instagram.com/${inf.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center justify-between"
                      >
                        <span>Instagram</span>
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
                      </a>
                    )}
                    {(inf.platform === "TikTok" || inf.platform === "Both") && (
                      <a
                        href={`https://tiktok.com/@${
                          inf.tiktokUsername || inf.username
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center justify-between"
                      >
                        <span>TikTok</span>
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
                      </a>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Median</div>
                      <div className="text-sm font-medium">
                        {inf.viewsMedian.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="text-sm font-medium">
                        {inf.viewsTotal.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Current</div>
                      <div className="text-sm font-medium">
                        {inf.viewsNow.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Videos */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {inf.videos.map((video, idx) => {
                        const statusColor = getStatusColor(
                          video.status,
                          inf.paid
                        );
                        return (
                          <div
                            key={idx}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${statusColor}`}
                            title={`Video #${idx + 1}: ${video.status}`}
                          >
                            {idx + 1}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setSelectedInfluencer(inf)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 flex justify-end">
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showAnalytics && (
        <AnalyticsModal onClose={() => setShowAnalytics(false)} />
      )}

      {showForm && (
        <InfluencerForm
          formState={formState}
          setFormState={setFormState}
          onSubmit={handleAddInfluencer}
          onClose={() => {
            resetForm();
            setShowForm(false);
          }}
          onDelete={
            editingInfluencer
              ? () => handleDeleteInfluencer(editingInfluencer)
              : undefined
          }
          isEditing={!!editingInfluencer}
        />
      )}

      {selectedInfluencer && (
        <VideosModal
          influencer={selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
        />
      )}
    </main>
  );
}
