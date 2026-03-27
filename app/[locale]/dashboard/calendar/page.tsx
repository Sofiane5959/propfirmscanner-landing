"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────
interface CalendarEvent {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: "High" | "Medium" | "Low" | "Holiday";
  forecast: string;
  previous: string;
  actual: string;
}

// ── Constants ─────────────────────────────────────────────────
const IMPACT_CONFIG = {
  High: { color: "text-red-400", bg: "bg-red-500", dot: "🔴", label: "High" },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-500", dot: "🟡", label: "Medium" },
  Low: { color: "text-gray-400", bg: "bg-gray-500", dot: "⚪", label: "Low" },
  Holiday: { color: "text-blue-400", bg: "bg-blue-500", dot: "📅", label: "Holiday" },
};

const CURRENCIES = ["All", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"];

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵",
  AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", NZD: "🇳🇿",
  CNY: "🇨🇳", ALL: "🌍",
};

// ── Helpers ───────────────────────────────────────────────────
function formatTime(dateStr: string, timeStr: string): string {
  if (!timeStr || timeStr === "All Day" || timeStr === "Tentative") return timeStr || "All Day";
  try {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch {
    return timeStr;
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr.startsWith(today);
}

function isUpcoming(dateStr: string, timeStr: string): boolean {
  try {
    const now = new Date();
    const eventDate = new Date(`${dateStr.split("T")[0]}T${timeStr || "23:59"}`);
    const diff = eventDate.getTime() - now.getTime();
    return diff > 0 && diff < 60 * 60 * 1000; // within next 1 hour
  } catch {
    return false;
  }
}

// ── Main Component ────────────────────────────────────────────
export default function EconomicCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState("All");
  const [selectedImpact, setSelectedImpact] = useState<string[]>(["High", "Medium", "Low"]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchCalendar = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: CalendarEvent[] = await res.json();
      setEvents(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Unable to load calendar data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar();
    const interval = setInterval(fetchCalendar, 5 * 60 * 1000); // refresh every 5min
    return () => clearInterval(interval);
  }, [fetchCalendar]);

  // Filter events
  const filtered = events.filter((e) => {
    const currencyMatch = selectedCurrency === "All" || e.country === selectedCurrency;
    const impactMatch = selectedImpact.includes(e.impact);
    return currencyMatch && impactMatch;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const day = event.date.split("T")[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});

  // Count high impact events today
  const highImpactToday = events.filter(
    (e) => isToday(e.date) && e.impact === "High"
  ).length;

  const toggleImpact = (impact: string) => {
    setSelectedImpact((prev) =>
      prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Economic Calendar</h1>
            <p className="text-gray-400 text-sm mt-1">
              This week's market-moving events · Source: Forex Factory
            </p>
          </div>
          <div className="text-right">
            {lastUpdated && (
              <p className="text-xs text-gray-500">Updated {lastUpdated}</p>
            )}
            <button
              onClick={fetchCalendar}
              className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Stats row */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{events.length}</p>
              <p className="text-xs text-gray-400 mt-1">Events this week</p>
            </div>
            <div className="bg-gray-900 border border-red-900/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-400">
                {events.filter((e) => e.impact === "High").length}
              </p>
              <p className="text-xs text-gray-400 mt-1">High impact</p>
            </div>
            <div className="bg-gray-900 border border-blue-900/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{highImpactToday}</p>
              <p className="text-xs text-gray-400 mt-1">High impact today</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Currency filter */}
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-2 font-medium">Currency</p>
              <div className="flex flex-wrap gap-1.5">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCurrency(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      selectedCurrency === c
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {CURRENCY_FLAGS[c] || ""} {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact filter */}
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">Impact</p>
              <div className="flex gap-1.5">
                {(["High", "Medium", "Low"] as const).map((impact) => {
                  const cfg = IMPACT_CONFIG[impact];
                  return (
                    <button
                      key={impact}
                      onClick={() => toggleImpact(impact)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                        selectedImpact.includes(impact)
                          ? "bg-gray-700 text-white"
                          : "bg-gray-800/50 text-gray-600"
                      }`}
                    >
                      {cfg.dot} {impact}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading calendar…</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchCalendar}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500 transition"
            >
              Try again
            </button>
          </div>
        )}

        {/* Calendar */}
        {!loading && !error && (
          <div className="space-y-6">
            {Object.keys(grouped).sort().map((day) => (
              <div key={day}>
                {/* Day header */}
                <div className={`flex items-center gap-3 mb-3 ${isToday(day) ? "text-blue-400" : "text-gray-400"}`}>
                  <div className={`h-px flex-1 ${isToday(day) ? "bg-blue-800" : "bg-gray-800"}`} />
                  <span className="text-sm font-semibold">
                    {isToday(day) ? "📅 TODAY — " : ""}{formatDate(day)}
                  </span>
                  <div className={`h-px flex-1 ${isToday(day) ? "bg-blue-800" : "bg-gray-800"}`} />
                </div>

                {/* Events */}
                <div className="space-y-2">
                  {grouped[day].map((event, i) => {
                    const cfg = IMPACT_CONFIG[event.impact] || IMPACT_CONFIG.Low;
                    const upcoming = isUpcoming(event.date, event.time);
                    return (
                      <div
                        key={i}
                        className={`bg-gray-900 border rounded-xl p-4 transition ${
                          upcoming
                            ? "border-yellow-600/50 bg-yellow-900/10"
                            : event.impact === "High" && isToday(event.date)
                            ? "border-red-800/50"
                            : "border-gray-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Time */}
                          <div className="w-16 text-right shrink-0">
                            <span className="text-xs text-gray-400 font-mono">
                              {formatTime(event.date.split("T")[0], event.time)}
                            </span>
                          </div>

                          {/* Currency + Impact */}
                          <div className="flex flex-col items-center gap-1 shrink-0 w-12">
                            <span className="text-xs font-bold text-gray-200">
                              {CURRENCY_FLAGS[event.country] || ""} {event.country}
                            </span>
                            <span className={`text-xs font-semibold ${cfg.color}`}>
                              {cfg.dot}
                            </span>
                          </div>

                          {/* Event name */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate">
                                {event.title}
                              </p>
                              {upcoming && (
                                <span className="shrink-0 px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-600/30">
                                  Soon
                                </span>
                              )}
                              {event.actual && event.actual !== "" && (
                                <span className="shrink-0 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
                                  Released
                                </span>
                              )}
                            </div>

                            {/* Forecast / Previous / Actual */}
                            {(event.forecast || event.previous || event.actual) && (
                              <div className="flex gap-4 mt-2">
                                {event.actual && (
                                  <div>
                                    <span className="text-xs text-gray-500">Actual</span>
                                    <p className={`text-xs font-semibold ${
                                      event.actual && event.forecast
                                        ? parseFloat(event.actual) >= parseFloat(event.forecast)
                                          ? "text-green-400"
                                          : "text-red-400"
                                        : "text-white"
                                    }`}>
                                      {event.actual}
                                    </p>
                                  </div>
                                )}
                                {event.forecast && (
                                  <div>
                                    <span className="text-xs text-gray-500">Forecast</span>
                                    <p className="text-xs font-semibold text-gray-300">{event.forecast}</p>
                                  </div>
                                )}
                                {event.previous && (
                                  <div>
                                    <span className="text-xs text-gray-500">Previous</span>
                                    <p className="text-xs font-semibold text-gray-400">{event.previous}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Impact bar */}
                          <div className="shrink-0 flex items-center">
                            <div className={`w-1 h-8 rounded-full ${cfg.bg} opacity-70`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No events match your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
