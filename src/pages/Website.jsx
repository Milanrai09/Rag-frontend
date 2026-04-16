import { useState } from "react";
import { useIngestions } from "./useIngestions";
import { timeAgo } from "./utils";
import Toast from "./Toast";


export default function Website() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [toasts, setToasts] = useState([]);
  const { ingestions, addIngestion } = useIngestions("web");

  const addToast = (msg, kind = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const fakeProgress = async (steps) => {
    for (const step of steps) {
      setProgress({ label: step.label, pct: step.pct });
      await new Promise((r) => setTimeout(r, step.ms));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { addToast("Please enter a source name", "error"); return; }
    if (!url.trim()) { addToast("Please enter a URL", "error"); return; }
    try { new URL(url); } catch { addToast("Enter a valid URL (include https://)", "error"); return; }

    setLoading(true);
    try {
      await fakeProgress([
        { label: "Connecting to URL…", pct: 20, ms: 500 },
        { label: "Scraping page content…", pct: 45, ms: 700 },
        { label: "Cleaning HTML…", pct: 65, ms: 400 },
        { label: "Embedding chunks…", pct: 85, ms: 600 },
        { label: "Indexing…", pct: 100, ms: 300 },
      ]);

      const res = await fetch("/api/upload-doc-rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), url: url.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());

      addIngestion({ type: "web", name: name.trim(), url: url.trim(), ts: Date.now() });
      addToast("Website ingested successfully");
      setName("");
      setUrl("");
    } catch (err) {
      console.error(err);
      addToast("Scrape failed — check console", "error");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <main className="page-content">
      <div className="section-header">
        <div className="section-kicker">02 — Web Scrape</div>
        <h1 className="section-title">Ingest a website</h1>
        <p className="section-sub">
          Enter a source name and target URL. The page will be scraped,
          chunked, and embedded into your knowledge base.
        </p>
      </div>

      <div className="form-wrap">
        {/* Source name */}
        <div className="form-field">
          <label className="form-label" htmlFor="web-name">Source name</label>
          <input
            id="web-name"
            className="form-input"
            type="text"
            placeholder="e.g. Stripe Docs, Company Blog, API Reference…"
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* URL */}
        <div className="form-field">
          <label className="form-label" htmlFor="web-url">Website URL</label>
          <input
            id="web-url"
            className="form-input"
            type="url"
            placeholder="https://docs.example.com/introduction"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Progress */}
        {progress && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>{progress.label}</span>
              <span>{progress.pct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: progress.pct + "%" }} />
            </div>
          </div>
        )}

        <div className="divider" />
        <button
          className="btn btn-green btn-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Scraping…</> : "Scrape & Ingest"}
        </button>
      </div>

      {ingestions.length > 0 && (
        <div className="history-section">
          <div className="history-title">Scraped sites</div>
          {ingestions.slice(0, 6).map((item, i) => (
            <div className="history-item" key={i}>
              <div className="history-icon web">🌐</div>
              <div className="history-name">{item.name}</div>
              <span className="history-meta">{timeAgo(item.ts)}</span>
              <span className="history-badge">indexed</span>
            </div>
          ))}
        </div>
      )}

      <Toast toasts={toasts} />
    </main>
  );
}