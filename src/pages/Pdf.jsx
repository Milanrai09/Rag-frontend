import { useState, useRef } from "react";
import { useIngestions } from "./useIngestions";
import { timeAgo } from "./utils";
import Toast from "./Toast";


export default function Pdf() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(null); // { label, pct }
  const [toasts, setToasts] = useState([]);
  const fileRef = useRef();
  const { ingestions, addIngestion } = useIngestions("pdf");

  const addToast = (msg, kind = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") {
      addToast("Only PDF files are accepted", "error");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const fakeProgress = async (steps) => {
    for (const step of steps) {
      setProgress({ label: step.label, pct: step.pct });
      await new Promise((r) => setTimeout(r, step.ms));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { addToast("Please enter a source name", "error"); return; }
    if (!file) { addToast("Please select a PDF file", "error"); return; }

    setLoading(true);
    try {
      await fakeProgress([
        { label: "Uploading PDF…", pct: 25, ms: 400 },
        { label: "Extracting text…", pct: 55, ms: 600 },
        { label: "Chunking passages…", pct: 75, ms: 500 },
        { label: "Embedding vectors…", pct: 92, ms: 700 },
        { label: "Indexing…", pct: 100, ms: 300 },
      ]);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("pdfFile", file);

      const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());

      addIngestion({ type: "pdf", name: name.trim(), file: file.name, size: file.size, ts: Date.now() });
      addToast("PDF ingested successfully");
      setName("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      addToast("Upload failed — check console", "error");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const formatSize = (b) =>
    b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : (b / 1024).toFixed(0) + " KB";

  return (
    <main className="page-content">
      <div className="section-header">
        <div className="section-kicker">01 — PDF Upload</div>
        <h1 className="section-title">Ingest a PDF document</h1>
        <p className="section-sub">
          Name your knowledge source, then drop a PDF. It will be chunked,
          embedded, and stored for retrieval.
        </p>
      </div>

      <div className="form-wrap">
        {/* Source name */}
        <div className="form-field">
          <label className="form-label" htmlFor="pdf-name">Source name</label>
          <input
            id="pdf-name"
            className="form-input"
            type="text"
            placeholder="e.g. Product Manual v2, Q4 Report, Research Paper…"
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Drop zone */}
        <div className="form-field">
          <label className="form-label">PDF file</label>
          <div
            className={`drop-zone${drag ? " drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <span className="drop-icon">⬆</span>
            <div className="drop-main">Drop PDF here or click to browse</div>
            <div className="drop-sub">Max 50 MB · PDF only</div>
            {file && (
              <div className="drop-file-name">
                {file.name} ({formatSize(file.size)})
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        {progress && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>{progress.label}</span>
              <span>{progress.pct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: progress.pct + "%" }} />
            </div>
          </div>
        )}

        <div className="divider" />
        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Uploading…</> : "Upload & Ingest"}
        </button>
      </div>

      {ingestions.length > 0 && (
        <div className="history-section">
          <div className="history-title">Uploaded PDFs</div>
          {ingestions.slice(0, 6).map((item, i) => (
            <div className="history-item" key={i}>
              <div className="history-icon pdf">📄</div>
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