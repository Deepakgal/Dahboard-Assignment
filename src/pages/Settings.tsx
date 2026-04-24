import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Mail, 
  Lock, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/src/components/common/FirebaseProvider';
import { FirebaseProvider } from '@/src/components/common/FirebaseProvider';
import SettingsCard from '@/src/components/common/SettingsCard';
import Toggle from '@/src/components/common/Toggle';
import { motion } from 'motion/react';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Local state for demonstration of working UI
  const [prefs, setPrefs] = useState({
    notifications: true,
    privacy: false,
    darkMode: false,
    emails: true,
    twoFactor: false
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <SettingsIcon className="text-primary" size={24} />
          </div>
          Settings
        </h1>
        <p className="text-slate-500 mt-2">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation & Profile */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center"
          >
            <div className="relative mx-auto w-20 h-20 mb-4">
              <img 
                src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'} 
                alt="User" 
                className="w-full h-full rounded-full border-4 border-primary-light object-cover shadow-sm" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center text-primary cursor-pointer hover:bg-slate-50">
                <Smartphone size={12} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{user?.displayName || 'User'}</h2>
            <p className="text-sm text-slate-500 mb-6">{user?.email}</p>
            <button className="w-full py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors border border-slate-100 text-sm">
              Edit Profile
            </button>
          </motion.div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-2">
              {[
                { label: 'General', icon: <Globe size={18} />, active: true },
                { label: 'Security', icon: <Lock size={18} /> },
                { label: 'Billing', icon: <CreditCard size={18} /> },
              ].map((item, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${item.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {item.icon}
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Settings */}
        <div className="lg:col-span-2 space-y-6">
          <SettingsCard title="Preferences" description="Customize how you interact with ConsulTOpen.">
            {[
              { id: 'notifications', label: 'Push Notifications', icon: <Bell className="text-indigo-500" size={18} />, desc: 'Receive real-time alerts for your sessions.' },
              { id: 'emails', label: 'Email Marketing', icon: <Mail className="text-rose-500" size={18} />, desc: 'Weekly digests and recommendation emails.' },
              { id: 'darkMode', label: 'Dark Mode', icon: <Moon className="text-amber-500" size={18} />, desc: 'Switch to a darker visual experience.' },
            ].map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <Toggle 
                  checked={prefs[item.id as keyof typeof prefs]} 
                  onChange={() => togglePref(item.id as keyof typeof prefs)} 
                />
              </div>
            ))}
          </SettingsCard>

          <SettingsCard title="Privacy & Security" description="Control your data and account security.">
            {[
              { id: 'privacy', label: 'Privacy Mode', icon: <Shield className="text-emerald-500" size={18} />, desc: 'Hide your profile from public search results.' },
              { id: 'twoFactor', label: 'Two-Factor Auth', icon: <Lock className="text-blue-500" size={18} />, desc: 'Add an extra layer of security to your login.' },
            ].map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <Toggle 
                  checked={prefs[item.id as keyof typeof prefs]} 
                  onChange={() => togglePref(item.id as keyof typeof prefs)} 
                />
              </div>
            ))}
          </SettingsCard>

          <div className="pt-4">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-between p-5 bg-rose-50/50 hover:bg-rose-50 text-rose-600 rounded-3xl font-bold transition-all border border-rose-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                  <LogOut size={20} />
                </div>
                <span>Logout Current Account</span>
              </div>
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <FirebaseProvider>
      <Settings />
    </FirebaseProvider>
  );
}
