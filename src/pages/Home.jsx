import { Link } from "react-router-dom";
import { useIngestions } from "./useIngestions";
import { timeAgo } from "./utils";


export default function Home() {
  const { ingestions } = useIngestions();
  const pdfs = ingestions.filter((i) => i.type === "pdf");
  const webs = ingestions.filter((i) => i.type === "web");

  return (
    <main className="page-content">
      <div className="home-hero">
        <div className="home-kicker">Knowledge Ingestion System</div>
        <h1 className="home-title">
          Your docs.<br />
          <span>Instantly queryable.</span>
        </h1>
        <p className="home-sub">
          Ingest PDFs and live websites into a unified vector knowledge base.
          Ask questions, surface insights, retrieve context — all without manual search.
        </p>
      </div>

      <div className="cards-grid">
        <Link to="/pdf" className="feature-card pdf">
          <div className="card-icon pdf">📄</div>
          <div className="card-title">PDF Ingestion</div>
          <div className="card-desc">
            Upload and chunk PDF documents. Extracts text, embeds passages,
            and indexes for semantic retrieval.
          </div>
          <div className="card-arrow">↗</div>
        </Link>
        <Link to="/website" className="feature-card web">
          <div className="card-icon web">🌐</div>
          <div className="card-title">Web Scraping</div>
          <div className="card-desc">
            Crawl any URL and ingest page content. Ideal for docs sites,
            wikis, and product pages.
          </div>
          <div className="card-arrow">↗</div>
        </Link>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num">{pdfs.length}</div>
          <div className="stat-label">Documents</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{ingestions.length * 12}</div>
          <div className="stat-label">Chunks indexed</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{ingestions.length}</div>
          <div className="stat-label">Sources</div>
        </div>
      </div>

      {ingestions.length > 0 && (
        <div className="history-section">
          <div className="history-title">Recent ingestions</div>
          {ingestions.slice(0, 6).map((item, i) => (
            <div className="history-item" key={i}>
              <div className={`history-icon ${item.type}`}>
                {item.type === "pdf" ? "📄" : "🌐"}
              </div>
              <div className="history-name">{item.name}</div>
              <span className="history-meta">{timeAgo(item.ts)}</span>
              <span className="history-badge">indexed</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}