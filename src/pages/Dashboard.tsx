import React, { useState, useEffect } from 'react';
import { Check, Send, Zap, GraduationCap, Trophy, Target, Wind, Brain, Activity, Heart, ArrowUpRight, Loader2 } from 'lucide-react';
import TaskCard from '@/src/components/common/TaskCard';
import MindGymCard from '@/src/components/dashboard/MindGymCard';
import ProgressBar from '@/src/components/common/ProgressBar';
import RecommendationCard from '@/src/components/common/RecommendationCard';
import BookingModal from '@/src/components/common/BookingModal';
import { FirebaseProvider } from '@/src/components/common/FirebaseProvider';
import { useAuth } from '@/src/components/common/FirebaseProvider';
import { askEducationalQuestion } from '@/src/services/aiService';
import { db } from '@/src/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDocs, setDoc } from 'firebase/firestore';
import '@/src/styles/Dashboard.css';

const DEFAULT_TASKS = [
  { title: "Quiz-1", tag: "Test", status: "locked", section: "Build Basics" },
  { title: "Practice Algebra Problems Daily", tag: "Maths", status: "locked", section: "Build Basics" },
  { title: "Study Motion and Energy Concepts", tag: "Science", tagColor: "var(--pastel-yellow)", status: "continue", section: "Build Basics" },
  { title: "Solve 20 Maths Question Daily", tag: "Maths", tagColor: "var(--pastel-green)", status: "completed", section: "Build Basics" },
  { title: "Watch a Science Concept Video", tag: "Exploration", tagColor: "var(--pastel-blue)", status: "completed", section: "Build Basics" },
  { title: "Follow a Weekly Study Plan", tag: "Habit", tagColor: "var(--pastel-purple)", status: "completed", section: "Build Basics" },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingProcessing, setIsBookingProcessing] = useState(false);

  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Sync User Profile
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    return onSnapshot(userRef, (doc) => {
      setUserProfile(doc.data());
      setTodayMood(doc.data()?.todayMood || null);
    });
  }, [user]);

  // Sync Tasks
  useEffect(() => {
    if (!user) return;
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, where('section', '==', 'Build Basics'));

    return onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Initialize default tasks if none exist
        for (const task of DEFAULT_TASKS) {
          await addDoc(tasksRef, { ...task, updatedAt: serverTimestamp() });
        }
      } else {
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
      }
    });
  }, [user]);

  const handleAskAI = async () => {
    if (!aiQuestion.trim() || isAskingAI) return;
    setIsAskingAI(true);
    setAiResponse('');

    const answer = await askEducationalQuestion(aiQuestion);
    setAiResponse(answer);

    if (user) {
      await addDoc(collection(db, 'users', user.uid, 'ai_queries'), {
        question: aiQuestion,
        answer,
        createdAt: serverTimestamp()
      });
    }
    
    setIsAskingAI(false);
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!user || currentStatus === 'locked') return;
    
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    const nextStatus = currentStatus === 'continue' ? 'completed' : 'continue';
    
    await updateDoc(taskRef, {
      status: nextStatus,
      updatedAt: serverTimestamp()
    });

    // Update progress
    if (nextStatus === 'completed') {
      const newProgress = Math.min((userProfile?.careerProgress || 0) + 5, 100);
      await updateDoc(doc(db, 'users', user.uid), {
        careerProgress: newProgress
      });
    }
  };

  const handleMoodSelect = async (mood: string) => {
    if (!user) return;
    setTodayMood(mood);
    await updateDoc(doc(db, 'users', user.uid), {
      todayMood: mood,
      lastMoodCheckIn: serverTimestamp()
    });
    alert(`Great! We've logged that you're feeling ${mood} today. Check out "Mind Gym" to keep your focus sharp!`);
  };

  const handleBooking = () => {
    setIsBookingModalOpen(true);
  };

  const confirmBooking = async () => {
    setIsBookingProcessing(true);
    try {
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'session_requests'), {
          mentor: "Mukund Tyagi",
          status: "pending",
          createdAt: serverTimestamp()
        });
      }
      setIsBookingModalOpen(false);
      alert("Session booking requested! Our consultant Mukund Tyagi will reach out to you within 24 hours.");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsBookingProcessing(false);
    }
  };

  const startExercise = (name: string) => {
    alert(`Starting ${name}! Take a deep breath and follow the instructions on your screen.`);
  };

  // derived data
  const mathTasks = tasks.filter(t => t.tag === 'Maths');
  const scienceTasks = tasks.filter(t => t.tag === 'Science');
  
  const mathProgress = mathTasks.length > 0 
    ? Math.round((mathTasks.filter(t => t.status === 'completed').length / mathTasks.length) * 100) 
    : 80;
  const scienceProgress = scienceTasks.length > 0 
    ? Math.round((scienceTasks.filter(t => t.status === 'completed').length / scienceTasks.length) * 100) 
    : 70;

  const currentFocusTask = tasks.find(t => t.status === 'continue') || tasks[0];

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        {/* Header Greeting */}
        <div className="greeting-banner">
          <h1>Good morning, {user?.displayName?.split(' ')[0] || 'Guest'}! 👋</h1>
          <div className="quote-box">
            <p className="quote">"The future belongs to those who believe in the beauty of their dreams."</p>
            <span className="author">— Eleanor Roosevelt</span>
          </div>
        </div>

        {/* AI Input Card */}
        <div className="ai-card">
          <div className="ai-header">
            <div className="ai-logo"><Zap size={20} fill="var(--accent-pink)" color="var(--accent-pink)" /></div>
            <h2>ConsulTOpen AI</h2>
          </div>
          
          <div className="ai-suggestions-row">
            <button className="suggestion-btn" onClick={() => setAiQuestion("What are the future benefits of choosing PCM in 11th?")}>
              What are the future benefits of choosing PCM in 11th? <ArrowUpRight size={14} />
            </button>
            <button className="suggestion-btn" onClick={() => setAiQuestion("How to balance board exams and competitive prep?")}>
              How to balance board exams and competitive prep? <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="ai-input-wrapper">
            <input 
              type="text" 
              placeholder="Type your specific question here..." 
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <button className="ai-send-icon-btn" onClick={handleAskAI} disabled={isAskingAI}>
              <img src="https://img.icons8.com/color/48/000000/telegram-app.png" alt="Send" className="w-6 h-6" />
            </button>
          </div>
          {aiResponse && (
            <div className="ai-response-area">
              <p className="ai-response-text">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Today's Focus */}
        <div className="grid-2-col">
          <div className="card focus-card">
            <div className="card-header">
              <span className="icon-dot pink" />
              <h3>Today's Focus!</h3>
            </div>
            <div className="focus-content">
              <h4>Study Motion and Energy Concepts</h4>
              <div className="checklist-item">
                <div className="check-box active"><CheckIcon size={12} /></div>
                <span>Understand speed, velocity, and acceleration</span>
              </div>
              <div className="checklist-item border-top">
                <div className="check-box"><div className="dot" /></div>
                <span>Solve 5-10 basic numerical problems</span>
              </div>
            </div>
          </div>

          {/* Calm Today Widget */}
          <div className="card calm-widget-new">
            <div className="calm-bg-leaf" />
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=calm" alt="Calm" className="calm-icon" referrerPolicy="no-referrer" />
            <h3>You Are Calm Today</h3>
            <p>Staying calm helps you think clearly and make better decisions. Take a deep breath and continue your day with a peaceful mind.</p>
          </div>
        </div>

        {/* Career Roadmap */}
        <div className="card roadmap-card">
          <div className="card-header">
            <GraduationCap size={20} color="var(--primary)" />
            <h3>Career Roadmap</h3>
            <button className="view-link">View Full Roadmap</button>
          </div>
          
          <div className="roadmap-timeline">
            <div className={`timeline-step ${(userProfile?.careerProgress || 0) >= 25 ? 'completed' : ''}`}>
              <div className="step-point"><CheckIcon size={16} /></div>
              <span>Build Basics</span>
            </div>
            <div className={`timeline-step ${(userProfile?.careerProgress || 0) >= 50 ? 'completed' : ''}`}>
              <div className="step-point"><Trophy size={16} /></div>
              <span>Strengthen Concepts</span>
            </div>
            <div className={`timeline-step ${(userProfile?.careerProgress || 0) >= 75 ? 'completed' : ''}`}>
              <div className="step-point"><Target size={16} /></div>
              <span>Score in Boards</span>
            </div>
            <div className={`timeline-step ${(userProfile?.careerProgress || 0) >= 100 ? 'completed' : ''}`}>
              <div className="step-point"><Zap size={16} /></div>
              <span>PCM Stream</span>
            </div>
          </div>
          
          <div className="next-milestone-new">
            <div className="milestone-content">
              <Zap size={16} className="text-primary" />
              <p>Next Milestone: <span className="font-bold">Strengthen Concepts</span></p>
            </div>
            <div className="milestone-progress-text">65%</div>
          </div>
        </div>

        {/* Build Basics Tasks */}
        <div className="task-section">
          <div className="task-section-header">
            <div className="card-header">
              <div className="icon-box"><Check size={20} /></div>
              <h3>Build Basics</h3>
            </div>
            <div className="status-pill">
              <span className="status-dot" />
              In Progress
            </div>
          </div>
          <div className="task-summary">
            <span>{completedTasksCount} of {tasks.length} tasks completed</span>
            <span className="percent-label">{progressPercent}%</span>
          </div>
          <div className="build-basics-progress">
            <ProgressBar progress={progressPercent} />
          </div>
          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.sort((a,b) => a.title.localeCompare(b.title)).map(task => (
                <TaskCard 
                  key={task.id} 
                  title={task.title} 
                  tag={task.tag} 
                  tagColor={task.tagColor} 
                  status={task.status} 
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                />
              ))
            ) : (
              <div className="loading-tasks">Loading tasks...</div>
            )}
          </div>
        </div>

        {/* Mind Gym */}
        <div className="mind-gym-section">
          <div className="card-header">
            <div className="icon-box"><Brain size={20} /></div>
            <div className="header-info">
              <h3>Mind Gym</h3>
              <p>Suggests mindfulness and focus activities to keep your mind sharp and calm.</p>
            </div>
          </div>
          <div className="mind-gym-grid">
            <MindGymCard 
              title="Breathing Exercises" 
              subtitle="Calm and relax" 
              duration="3-5 minutes"
              color="var(--pastel-blue)"
              icon={<Wind size={20} color="var(--accent-blue)" />}
              onStart={() => startExercise('Breathing Exercises')}
            />
            <MindGymCard 
              title="Focus Exercises" 
              subtitle="Boost concentration" 
              duration="5-10 minutes"
              color="var(--pastel-yellow)"
              icon={<Target size={20} color="var(--accent-yellow)" />}
              onStart={() => startExercise('Focus Exercises')}
            />
            <MindGymCard 
              title="Muscle Relaxation" 
              subtitle="Release body tension" 
              duration="25-30 minutes"
              color="var(--pastel-purple)"
              icon={<Activity size={20} color="var(--accent-purple)" />}
              onStart={() => startExercise('Muscle Relaxation')}
            />
            <MindGymCard 
              title="Study Focus Reset" 
              subtitle="Sharpen your mind" 
              duration="3 minutes"
              color="var(--pastel-pink)"
              icon={<Brain size={20} color="var(--accent-pink)" />}
              onStart={() => startExercise('Study Focus Reset')}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar Widgets */}
      <div className="dashboard-side">
        <div className="card trends-card">
          <div className="side-header">
            <Activity className="heartbeat-icon" size={18} color="var(--accent-pink)" />
            <h3>Mood & Activity Trends</h3>
            <span className="time-badge">This Week</span>
          </div>
          <p className="side-desc">Emotional wellbeing & platform engagement based on your daily check-ins.</p>
          
          <div className="mood-selector">
            {['😊', '😌', '😐', '😔', '😫'].map(mood => (
              <button 
                key={mood} 
                className={`mood-btn ${todayMood === mood ? 'active' : ''}`}
                onClick={() => handleMoodSelect(mood)}
              >
                {mood}
              </button>
            ))}
          </div>

          <div className="mood-chart-container">
            <div className="bar-chart">
               {[
                 { day: 'Mon', h: 85, c: '#a78bfa', mood: 'stressed' },
                 { day: 'Tue', h: 80, c: '#4ade80', mood: 'happy' },
                 { day: 'Wed', h: 75, c: '#f472b6', mood: 'excited' },
                 { day: 'Thu', h: 82, c: '#22d3ee', mood: 'neutral' },
                 { day: 'Fri', h: 78, c: '#f87171', mood: 'tired' },
                 { day: 'Sat', h: 25, c: '#e5e7eb', mood: 'none' },
                 { day: 'Sun', h: 10, c: '#f3f4f6', mood: 'none' },
               ].map((bar, idx) => (
                 <div key={idx} className="bar-wrapper">
                    <div className="bar-content" style={{ height: `${bar.h}%` }}>
                      {bar.mood !== 'none' && (
                        <div className="mood-character">
                          <div className="character-hat" style={{ backgroundColor: bar.c }} />
                          <div className="character-face">
                            <div className="eye left" />
                            <div className="eye right" />
                            <div className={`mouth ${bar.mood}`} />
                          </div>
                        </div>
                      )}
                      <div className="bar-filled" style={{ backgroundColor: bar.c, opacity: bar.mood === 'none' ? 0.3 : 1 }} />
                    </div>
                    <span className="day-label">{bar.day}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="mood-alert">
            <span className="alert-icon">⚠️</span>
            <p>Your mood this week suggests increased stress related to your future.</p>
          </div>
        </div>

        <RecommendationCard 
          title="Recommended for You"
          description="Based on mood log"
          mentor={{
            name: "Mukund Tyagi",
            role: "Student Wellbeing Therapist",
            rating: 4.9,
            sessions: "120+ Sessions",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mukund"
          }}
          buttonText="Book a Therapy Session"
          buttonVariant="pink"
          onAction={handleBooking}
        />

        <div className="card skills-card">
          <div className="side-header">
            <Zap size={18} color="var(--accent-blue)" />
            <h3>Skills Progress</h3>
          </div>
          <div className="skill-item">
            <div className="skill-info">
              <span>Math Problem Solving</span>
              <span>{mathProgress}%</span>
            </div>
            <ProgressBar progress={mathProgress} color="var(--accent-green)" />
          </div>
          <div className="skill-item">
            <div className="skill-info">
              <span>Science Concepts</span>
              <span>{scienceProgress}%</span>
            </div>
            <ProgressBar progress={scienceProgress} color="var(--accent-blue)" />
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={confirmBooking}
        mentorName="Mukund Tyagi"
        mentorRole="Student Wellbeing Therapist"
        mentorAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukund"
        topic="Academic Planning & Mental Wellbeing"
        estimatedResponse="Within 24 Hours"
        fee="Included in Plan"
        isProcessing={isBookingProcessing}
      />
    </div>
  );
};

const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function DashboardPage() {
  return (
    <FirebaseProvider>
      <Dashboard />
    </FirebaseProvider>
  );
}
