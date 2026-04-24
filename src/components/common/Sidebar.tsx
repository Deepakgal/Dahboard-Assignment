import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  MonitorPlay, 
  HeartPulse, 
  Users, 
  Bot, 
  BellRing, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronRight,
  MoreVertical,
  LogIn,
  X
} from 'lucide-react';
import { useAuth } from './FirebaseProvider';
import '@/src/styles/Sidebar.css';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen, onClose }) => {
  const { user, signIn, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
    { id: 'session', label: 'Session', icon: MonitorPlay },
    { id: 'wellness', label: 'Mental Wellness', icon: HeartPulse },
    { id: 'marketplace', label: 'Consultant Marketplace', icon: Users },
    { id: 'ai', label: 'ConsulTOpen AI', icon: Bot },
  ];

  const systemItems = [
    { id: 'subscription', label: 'Subscription', icon: BellRing },
    { id: 'payments', label: 'Wallet & Payments', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          <span>ConsulTOpen</span>
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className="nav-icon" size={16} />
              <span className="nav-label">{item.label}</span>
              {activeView === item.id && <div className="active-indicator" />}
            </button>
          ))}
        </div>

        <div className="nav-divider" />

        <div className="nav-group">
          {systemItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className="nav-icon" size={16} />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="user-profile">
              <img 
                src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} 
                alt="User" 
                className="user-avatar"
                referrerPolicy="no-referrer"
              />
              <div className="user-info">
                <p className="user-name">Alex Miller</p>
                <span className="user-badge">ELITE</span>
              </div>
              <button className="user-more">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <button className="nav-item logout" onClick={logout}>
              <LogOut className="nav-icon" size={16} />
              <span className="nav-label">Logout</span>
            </button>
          </>
        ) : (
          <button className="nav-item login" onClick={signIn}>
            <LogIn className="nav-icon" size={16} />
            <span className="nav-label">Sign In</span>
          </button>
        )}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
