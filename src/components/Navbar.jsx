import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="dot" />
        RAGbase <span className="nav-badge">beta</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Overview
        </NavLink>
        <NavLink to="/pdf" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          PDF Upload
        </NavLink>
        <NavLink to="/website" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Web Scrape
        </NavLink>
      </div>
    </nav>
  );
}