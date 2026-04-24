import React from 'react';
import { Zap, X, Loader2 } from 'lucide-react';
import '@/src/styles/BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  topic: string;
  estimatedResponse: string;
  fee: string;
  isProcessing?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mentorName,
  mentorRole,
  mentorAvatar,
  topic,
  estimatedResponse,
  fee,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} disabled={isProcessing}>
          <X size={20} />
        </button>
        <div className="modal-header">
          <Zap size={24} color="var(--primary)" />
          <h2>Confirm Session Booking</h2>
        </div>
        <div className="modal-body">
          <p>You are about to book a session with our top mentor:</p>
          <div className="mentor-summary">
            <img src={mentorAvatar} alt="Mentor" className="mentor-avatar" referrerPolicy="no-referrer" />
            <div>
              <h4>{mentorName}</h4>
              <p>{mentorRole}</p>
            </div>
          </div>
          <div className="summary-details">
            <div className="summary-item">
              <span>Topic:</span>
              <span>{topic}</span>
            </div>
            <div className="summary-item">
              <span>Estimated Response:</span>
              <span>{estimatedResponse}</span>
            </div>
            <div className="summary-item">
              <span>Consultation Fee:</span>
              <span className={fee.toLowerCase().includes('free') || fee.toLowerCase().includes('included') ? "free-badge" : ""}>
                {fee}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={isProcessing}>Maybe Later</button>
          <button 
            className="confirm-btn flex items-center justify-center gap-2" 
            onClick={onConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
