// useIngestions.js
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "rag_ingestions";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

export function useIngestions(filterType) {
  const [all, setAll] = useState(load);

  useEffect(() => {
    const sync = () => setAll(load());
    window.addEventListener("rag_updated", sync);
    return () => window.removeEventListener("rag_updated", sync);
  }, []);

  const addIngestion = useCallback((item) => {
    setAll((prev) => {
      const next = [item, ...prev].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("rag_updated"));
      return next;
    });
  }, []);

  const ingestions = filterType ? all.filter((i) => i.type === filterType) : all;

  return { ingestions, addIngestion };
}