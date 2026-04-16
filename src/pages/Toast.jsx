// Toast.jsx
export default function Toast({ toasts }) {
    return (
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>
            <div className="toast-dot" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    );
  }