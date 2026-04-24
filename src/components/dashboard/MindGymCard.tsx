import React from 'react';
import { Play } from 'lucide-react';
import '@/src/styles/MindGymCard.css';

interface MindGymCardProps {
  title: string;
  subtitle: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  onStart?: () => void;
}

const MindGymCard: React.FC<MindGymCardProps> = ({ title, subtitle, duration, icon, color, onStart }) => {
  return (
    <div className="mind-gym-card" style={{ backgroundColor: color }}>
      <div className="mind-gym-header">
        <div className="mind-gym-icon-box">
          {icon}
        </div>
        <div className="mind-gym-info">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="mind-gym-footer">
        <div className="duration">
          <span>⏲</span>
          <span>{duration}</span>
        </div>
        <button className="start-btn" onClick={onStart}>
          Start <Play size={12} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default MindGymCard;
