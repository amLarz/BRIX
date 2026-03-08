
import React, { useState, useMemo, useEffect } from 'react';
import { ViewState, Project, ProjectStatus } from './types';
import { INITIAL_PROJECTS, MATERIAL_CATEGORIES } from './data';
import Header from './components/Header';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import MaterialPriceList from './components/MaterialPriceList';
import AddProject from './components/AddProject';
import About from './components/About';
import CommunityChat from './components/CommunityChat';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'trending'>('trending');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>(() => {
    const saved = localStorage.getItem('brix_user_votes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('brix_user_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  const handleNavigateHome = () => setView({ type: 'home' });
  const handleViewProject = (id: string) => setView({ type: 'project-detail', projectId: id });
  const handleViewPrices = (id: string) => setView({ type: 'material-prices', categoryId: id });
  const handleAddProjectView = () => setView({ type: 'add-project' });
  const handleViewAbout = () => setView({ type: 'about' });

  const handleMaterialClick = (materialName: string) => {
    const category = MATERIAL_CATEGORIES.find(cat => 
      cat.items.some(item => 
        item.name.toLowerCase().includes(materialName.toLowerCase()) ||
        materialName.toLowerCase().includes(item.name.split(',')[0].toLowerCase())
      )
    );
    
    if (category) {
      handleViewPrices(category.id);
    } else {
      handleViewPrices(MATERIAL_CATEGORIES[0].id);
    }
  };

  const handleVote = (projectId: string, type: 'up' | 'down') => {
    const currentVote = userVotes[projectId];

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;

      let newUpvotes = p.upvotes;
      let newDownvotes = p.downvotes;

      if (currentVote === type) {
        // Untick the same vote
        if (type === 'up') newUpvotes--;
        else newDownvotes--;
      } else if (currentVote) {
        // Switch vote
        if (type === 'up') {
          newUpvotes++;
          newDownvotes--;
        } else {
          newUpvotes--;
          newDownvotes++;
        }
      } else {
        // New vote
        if (type === 'up') newUpvotes++;
        else newDownvotes++;
      }

      return {
        ...p,
        upvotes: newUpvotes,
        downvotes: newDownvotes
      };
    }));

    setUserVotes(prev => ({
      ...prev,
      [projectId]: currentVote === type ? null : type
    }));
  };

  const handleUpdateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        status: newStatus,
        finishDate: newStatus === 'Finished Project' ? new Date().toLocaleDateString('en-GB') : undefined
      };
    }));
  };

  const handleAddComment = (projectId: string, text: string, image?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        author: 'Guest User',
        role: 'Community Member',
        text,
        image,
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: new Date().toISOString().split('T')[0]
      };
      return {
        ...p,
        comments: [newComment, ...p.comments]
      };
    }));
  };

  // Fix: Omit createdAt from the input parameter type as it is generated internally
  const handleCreateProject = (newProject: Omit<Project, 'id' | 'upvotes' | 'downvotes' | 'comments' | 'createdAt'>) => {
    const project: Project = {
      ...newProject,
      id: newProject.name.toLowerCase().replace(/\s+/g, '-'),
      upvotes: 0,
      downvotes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [project, ...prev]);
    setView({ type: 'home' });
  };

  const sortedAndFilteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortOrder === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'trending') {
      // Trending based on total engagement (up + down)
      result.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
    }

    return result;
  }, [projects, searchQuery, sortOrder]);

  const renderView = () => {
    switch (view.type) {
      case 'home':
        return (
          <Home 
            projects={sortedAndFilteredProjects} 
            categories={MATERIAL_CATEGORIES}
            onProjectClick={handleViewProject}
            onCategoryClick={handleViewPrices}
            onVote={handleVote}
            userVotes={userVotes}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        );
      case 'project-detail':
        const project = projects.find(p => p.id === view.projectId);
        if (!project) return <div>Project not found</div>;
        return (
          <ProjectDetail 
            project={project} 
            onBack={handleNavigateHome} 
            onVote={(type) => handleVote(project.id, type)}
            currentUserVote={userVotes[project.id] || null}
            onUpdateStatus={(status) => handleUpdateProjectStatus(project.id, status)}
            onAddComment={(text, img) => handleAddComment(project.id, text, img)}
            onMaterialClick={handleMaterialClick}
            isAdmin={isAdmin}
          />
        );
      case 'material-prices':
        const category = MATERIAL_CATEGORIES.find(c => c.id === view.categoryId);
        if (!category) return <div>Category not found</div>;
        return <MaterialPriceList category={category} onBack={handleNavigateHome} />;
      case 'add-project':
        return <AddProject onBack={handleNavigateHome} onSubmit={handleCreateProject} />;
      case 'about':
        return <About onBack={handleNavigateHome} />;
      default:
        return <div>404 - Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-12">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onHomeClick={handleNavigateHome}
        onAddClick={handleAddProjectView}
        onAboutClick={handleViewAbout}
        showSearch={view.type !== 'about'}
        isAdmin={isAdmin}
      />
      <main className="container mx-auto px-4 mt-8 pb-20">
        {renderView()}
      </main>

      {/* Floating Admin Toggle */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-gray-200">
        <span className={`text-[10px] font-black uppercase tracking-widest ${!isAdmin ? 'text-[#8B3A2B]' : 'text-gray-400'}`}>Citizen</span>
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${isAdmin ? 'bg-[#8B3A2B]' : 'bg-gray-300'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isAdmin ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-[#8B3A2B]' : 'text-gray-400'}`}>Admin</span>
      </div>

      {/* Community Chat Toggle */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#8B3A2B] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[#7A3326] transition-all hover:scale-105 active:scale-95 group border-2 border-white/20"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 border-2 border-[#8B3A2B] rounded-full" />
        </div>
        <span className="font-bold text-sm tracking-tight">Community</span>
      </button>

      <CommunityChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
