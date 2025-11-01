import React from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "../api";
import VideoList from "../components/VideoList";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("query") || "";
  const pageParam = parseInt(params.get("page") || "1", 10);
  const [videos, setVideos] = React.useState([]);
  const [meta, setMeta] = React.useState({
    total: 0,
    page: pageParam,
    limit: 12,
    totalPages: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const limit = 12;

  React.useEffect(() => {
    let mounted = true;
    if (!q) {
      setVideos([]);
      setMeta((m) => ({ ...m, total: 0, totalPages: 0 }));
      return;
    }

    const page = Math.max(1, pageParam || 1);
    setLoading(true);
    setError(null);

    searchVideos(q, page, limit)
      .then((res) => {
        if (!mounted) return;
        // res is { videos: [...], meta: { total, page, limit, totalPages } }
        setVideos(res.videos || []);
        setMeta(res.meta || { total: 0, page, limit, totalPages: 0 });
      })
      .catch((e) => {
        console.error("Search failed", e);
        if (mounted) setError(e);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [q, pageParam]);

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(p, meta.totalPages || 1));
    setParams({ query: q, page: String(next) });
  };

  return (
    <section className="search-page">
      <h2 className="text-xl font-semibold mb-4">Search results for "{q}"</h2>

      {loading && <p>Searching...</p>}
      {error && (
        <p className="text-red-500">Search failed. Please try again.</p>
      )}

      {!loading && !error && (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Showing {videos.length} of {meta.total} results. Page {meta.page} of{" "}
            {meta.totalPages}
          </p>

          <VideoList videos={videos} />

          <div className="mt-6 flex items-center justify-center space-x-3">
            <button
              onClick={() => goToPage((meta.page || 1) - 1)}
              disabled={(meta.page || 1) <= 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              onClick={() => goToPage((meta.page || 1) + 1)}
              disabled={(meta.page || 1) >= (meta.totalPages || 1)}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
