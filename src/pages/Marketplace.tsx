import React from 'react';
import { Users, Search, Filter, Star } from 'lucide-react';
import RecommendationCard from '@/src/components/common/RecommendationCard';

const Marketplace: React.FC = () => {
  const consultants = [
    { name: "Mukund Tyagi", role: "Student Wellbeing", rating: 4.9, sessions: "120+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mukund" },
    { name: "Dr. Sarah Chen", role: "Career Aptitude", rating: 4.8, sessions: "85+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "James Wilson", role: "Maths Expert", rating: 4.7, sessions: "200+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
  ];

  return (
    <div className="marketplace-page p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Users className="text-primary" /> Consultant Marketplace
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Find the right mentor for your academic and mental wellbeing journey.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="search-bar relative flex-1">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input type="text" placeholder="Search consultants..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-full bg-white font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map((c, i) => (
          <RecommendationCard 
            key={i}
            title={c.name}
            description={c.role}
            mentor={c}
            buttonText="View Profile"
            onAction={() => alert(`Viewing profile of ${c.name}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
