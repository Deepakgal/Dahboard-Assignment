import React from 'react';
import { Check, Lock } from 'lucide-react';
import '@/src/styles/TaskCard.css';

interface TaskCardProps {
  title: string;
  tag?: string;
  tagColor?: string;
  status: 'locked' | 'continue' | 'completed';
  score?: number;
  isCheckbox?: boolean;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  title, 
  tag, 
  tagColor = 'var(--pastel-blue)', 
  status, 
  score,
  isCheckbox = true,
  onClick
}) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div 
      className={`task-card ${isLocked ? 'locked' : ''} ${onClick && !isLocked ? 'clickable' : ''}`}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="task-content">
        {isCheckbox && (
          <div className={`checkbox ${isCompleted ? 'checked' : ''}`}>
            {isCompleted && <Check size={14} />}
          </div>
        )}
        <div className="task-info">
          <p className={`task-title ${isLocked ? 'locked-title' : ''} ${isCompleted ? 'completed-title' : ''}`}>{title}</p>
          {isLocked && (
            <span className="task-substatus">
              <Lock size={12} />
              Locked
            </span>
          )}
          {tag && (
            <span className="task-tag" style={{ backgroundColor: tagColor }}>
              {tag}
            </span>
          )}
        </div>
      </div>

      <div className="task-action">
        {isLocked && (
          <button className="start-btn" type="button">Start</button>
        )}
        {status === 'continue' && (
          <button className="continue-btn">Continue</button>
        )}
        {isCompleted && (
          <div className="completed-area">
             {score && (
              <div className="score-badge">
                <span className="score-val">{score}%</span>
                <span className="score-label">Score</span>
              </div>
            )}
            {!score && <span className="status-label">Completed</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
