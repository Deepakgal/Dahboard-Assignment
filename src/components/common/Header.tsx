import React from 'react';
import { Search, Bell, MessageSquare, Menu } from 'lucide-react';
import '@/src/styles/Header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search internships, certifications, consultants..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="action-btn">
          <Bell size={16} />
          <span className="dot-indicator" />
        </button>
        <button className="action-btn">
          <MessageSquare size={16} />
        </button>
        <button className="upgrade-btn">
          Upgrade Plan
        </button>
      </div>
    </header>
  );
};

export default Header;
