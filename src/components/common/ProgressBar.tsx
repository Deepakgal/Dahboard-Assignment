import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 8, 
  color = 'var(--primary)',
  showLabel = false
}) => {
  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{progress}%</span>
        </div>
      )}
      <div style={{ 
        width: '100%', 
        height: `${height}px`, 
        backgroundColor: 'var(--primary-light)', 
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${progress}%`, 
          height: '100%', 
          backgroundColor: color, 
          borderRadius: '10px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
