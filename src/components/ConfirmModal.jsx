export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon">🚪</div>
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button className="modal-btn modal-btn--cancel" onClick={onCancel}>
              Batal
            </button>
            <button className="modal-btn modal-btn--confirm" onClick={onConfirm}>
              Ya, Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }