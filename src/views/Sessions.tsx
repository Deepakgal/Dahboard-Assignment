import React, { useState, useEffect } from 'react';
import { Map, Zap, Check, Lock, ChevronDown, Video, FileText, ExternalLink, Download, Target, Trophy } from 'lucide-react';
import TaskCard from '@/src/components/common/TaskCard';
import ProgressBar from '@/src/components/common/ProgressBar';
import CircularProgress from '@/src/components/common/CircularProgress';
import BookingModal from '@/src/components/common/BookingModal';
import { FirebaseProvider } from '@/src/components/common/FirebaseProvider';
import { useAuth } from '@/src/components/common/FirebaseProvider';
import { db } from '@/src/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import '@/src/styles/Sessions.css';

const Sessions: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingProcessing, setIsBookingProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    return onSnapshot(userRef, (doc) => {
      setUserProfile(doc.data());
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, where('section', '==', 'Build Basics'));

    return onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });
  }, [user]);

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!user || currentStatus === 'locked') return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    const nextStatus = currentStatus === 'continue' ? 'completed' : 'continue';
    await updateDoc(taskRef, { status: nextStatus, updatedAt: serverTimestamp() });

    if (nextStatus === 'completed') {
      const newProgress = Math.min((userProfile?.careerProgress || 0) + 5, 100);
      await updateDoc(doc(db, 'users', user.uid), { careerProgress: newProgress });
    }
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

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <div className="sessions-page">
      <div className="sessions-main">
        <div className="sessions-header">
           <div className="header-title">
             <Map size={24} color="var(--primary)" />
             <h1>Sessions</h1>
           </div>
           <p className="subtitle">Track your learning milestones and prepare for the PCM stream selection.</p>
        </div>

        {/* Timeline Content */}
        <div className="sessions-timeline">
           {/* Section 1: Build Basics */}
           <div className="timeline-item active">
             <div className="timeline-marker">
               <div className="marker-circle">{(userProfile?.careerProgress || 0) >= 25 ? <Check size={16} /> : <div className="dot" />}</div>
               <div className="marker-line" />
             </div>
             
             <div className="session-card main-session">
               <div className="session-header">
                  <div className="session-top">
                    <h3>Build Basics</h3>
                    <div className="status-badge pulse">
                      <span className="dot" /> In Progress
                    </div>
                  </div>
                  <p className="session-desc">You'll build a strong foundation in foundational math and science principles.</p>
                  
                <div className="session-progress-area">
                  <div className="progress-info">
                    <span>{completedTasksCount} of {tasks.length} tasks completed</span>
                    <span className="percent">{progressPercent}%</span>
                  </div>
                  <ProgressBar progress={progressPercent} />
                </div>
             </div>

             <div className="session-tasks">
               {tasks.length > 0 ? (
                 tasks.sort((a,b) => a.title.localeCompare(b.title)).map(task => (
                  <TaskCard 
                    key={task.id} 
                    title={task.title} 
                    tag={task.tag} 
                    status={task.status} 
                    score={task.status === 'completed' && task.title.toLowerCase().includes('solve') ? 98 : undefined}
                    isCheckbox 
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                  />
                 ))
               ) : (
                 <p>Sign in to see your learning journey!</p>
               )}
             </div>
             </div>
           </div>

           {/* Section 2: Strengthen Concepts (Locked) */}
           <div className="timeline-item">
             <div className="timeline-marker">
               <div className="marker-circle outline">{(userProfile?.careerProgress || 0) >= 50 ? <Trophy size={16} /> : <Lock size={16} />}</div>
               <div className="marker-line" />
             </div>
             <div className="session-content-minimal">
               <div className="minimal-header">
                 <h3>Strengthen Concepts</h3>
                 {(userProfile?.careerProgress || 0) < 50 && <span className="lock-label"><Lock size={14} /> Locked</span>}
               </div>
               <p>Dive deeper into advanced topics to prepare for your board exams.</p>
             </div>
           </div>
           
           {/* Section 3: Score in Boards */}
           <div className="timeline-item">
             <div className="timeline-marker">
               <div className="marker-circle outline">{(userProfile?.careerProgress || 0) >= 75 ? <Target size={16} /> : <Lock size={16} />}</div>
               <div className="marker-line" />
             </div>
             <div className="session-content-minimal">
               <div className="minimal-header">
                 <h3>Score in Boards</h3>
                 {(userProfile?.careerProgress || 0) < 75 && <span className="lock-label"><Lock size={14} /> Locked</span>}
               </div>
               <p>Achieve target scores in preliminary and final board examinations.</p>
             </div>
           </div>

           {/* Section 4: PCM Stream */}
           <div className="timeline-item">
             <div className="timeline-marker">
               <div className="marker-circle outline">{(userProfile?.careerProgress || 0) >= 100 ? <Zap size={16} /> : <Lock size={16} />}</div>
             </div>
             <div className="session-content-minimal">
               <div className="minimal-header">
                 <h3>PCM Stream Selection</h3>
                 {(userProfile?.careerProgress || 0) < 100 && <span className="lock-label"><Lock size={14} /> Locked</span>}
               </div>
               <p>Finalize stream choice based on aptitude and board results.</p>
             </div>
           </div>
        </div>
      </div>

       <div className="sessions-side">
         {/* Journey Progress */}
         <div className="side-card journey-card">
            <div className="card-top">
              <Zap size={18} color="var(--accent-yellow)" />
              <h3>Journey Progress</h3>
            </div>
            <div className="journey-viz">
              <CircularProgress progress={35} size={150} />
            </div>
            <div className="journey-stats">
               <div className="stat">
                  <span className="val">3</span>
                  <span className="lab">Tasks Done</span>
               </div>
               <div className="stat">
                  <span className="val">1</span>
                  <span className="lab">Milestones</span>
               </div>
            </div>
         </div>
         
         {/* Special Recommendation */}
         <div className="side-card rec-card">
            <div className="card-top center">
              <Zap size={18} color="var(--accent-green)" />
              <h3 className="green-text">Special Recommendation</h3>
            </div>
            <div className="rec-content">
               <h4>Need Help Planning?</h4>
               <p>Discuss your current progress and board preparation strategy.</p>
               <div className="mentor-profile">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukund" alt="Mentor" className="mentor-avatar" referrerPolicy="no-referrer" />
                 <h5>Mukund Tyagi</h5>
                 <p>(Academic Planner & Counsellor)</p>
                 <div className="rating">Rating ⭐ 4.2</div>
               </div>
               <button className="book-session-btn" onClick={handleBooking}>
                 Book a Session <span className="arrow">→</span>
               </button>
            </div>
         </div>

         <div className="side-card resources-card">
            <div className="card-top">
              <FileText size={18} color="var(--accent-yellow)" />
              <h3>Quick Learning Resources</h3>
            </div>
            <div className="resource-list">
              <div className="resource-item">
                 <div className="res-icon red"><Video size={16} /></div>
                 <div className="res-info">
                   <h6>Motion & Energy Explained in 10 Minutes</h6>
                   <p>Channel: Khan Academy</p>
                 </div>
                 <ExternalLink size={16} className="ext-icon" color="var(--accent-green)" />
              </div>
            </div>
         </div>
       </div>

      {/* Booking Confirmation Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={confirmBooking}
        mentorName="Mukund Tyagi"
        mentorRole="Academic Planner & Counsellor"
        mentorAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukund"
        topic="Academic Progress & Board Prep Strategy"
        estimatedResponse="Within 24 Hours"
        fee="Included in Plan"
        isProcessing={isBookingProcessing}
      />
    </div>
  );
};

export default function SessionsPage() {
  return (
    <FirebaseProvider>
      <Sessions />
    </FirebaseProvider>
  );
}
