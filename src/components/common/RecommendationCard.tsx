import React from 'react';
import '@/src/styles/RecommendationCard.css';

interface RecommendationCardProps {
  title: string;
  description: string;
  mentor: {
    name: string;
    role: string;
    rating: number;
    sessions: string;
    avatar: string;
  };
  buttonText: string;
  buttonVariant?: 'pink' | 'green';
  onAction?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, description, mentor, buttonText, buttonVariant = 'green', onAction }) => {
  return (
    <div className="recommendation-card">
      <span className="badge">Based on mood log</span>
      <h3 className="rec-title">{title}</h3>
      
      <div className="mentor-box">
        <img src={mentor.avatar} alt={mentor.name} className="mentor-avatar" referrerPolicy="no-referrer" />
        <h4>{mentor.name}</h4>
        <p>{mentor.role}</p>
        <div className="rating">
          ⭐ {mentor.rating} ({mentor.sessions})
        </div>
      </div>
      
      <button className={`book-btn ${buttonVariant}`} onClick={onAction}>{buttonText} <span>→</span></button>
    </div>
  );
};

export default RecommendationCard;
