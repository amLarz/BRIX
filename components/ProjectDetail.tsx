
import React, { useState, useRef } from 'react';
import { Project, ProjectStatus } from '../types';
import TugOfWar from './TugOfWar';
import { moderateComment } from '../moderation';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onVote: (type: 'up' | 'down') => void;
  currentUserVote: 'up' | 'down' | null;
  onUpdateStatus: (status: ProjectStatus) => void;
  onAddComment: (text: string, image?: string, isInformative?: boolean) => void;

  onAddReply: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (parentCommentId: string, replyId: string) => void;
  onCommentVote: (commentId: string, type: 'up' | 'down', isReply: boolean, parentId?: string) => void;
  commentVotes: Record<string, 'up' | 'down' | null>;
  onMaterialClick: (materialName: string) => void;
  isAdmin: boolean;
  currentUser: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onVote,
  currentUserVote,
  onUpdateStatus,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onDeleteReply,
  onCommentVote,
  commentVotes,
  onMaterialClick,
  isAdmin,
  currentUser
}) => {
  const [commentText, setCommentText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const moderationResult = moderateComment(replyText);
    if (!moderationResult.isAllowed) {
      alert(moderationResult.reason || "Reply blocked by moderation");
      return;
    }

    onAddReply(commentId, replyText);
    setReplyText('');
    setReplyingTo(null);
    // Auto-expand replies when user posts one
    setExpandedComments(prev => ({ ...prev, [commentId]: true }));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const moderationResult = moderateComment(commentText);
    if (!moderationResult.isAllowed) {
      setError(moderationResult.reason || "Comment blocked by moderation");
      return;
    }

    onAddComment(commentText, previewImage || undefined, moderationResult.isInformative);
    setCommentText('');
    setPreviewImage(null);
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  // Revoke object URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleViewDoc = () => {
    alert(`BRIX Verification: Opening document "${project.verificationDoc}" for review. In a live environment, this would open the verified PDF file.`);
  };

  const GLOBAL_DB_URL = "https://share.google/AaBXqWaNwFF6RrT0u";

  const ReplyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="M9 14l-4-4 4-4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" />
    </svg>
  );

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  );

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const CommentVoteControls = ({ id, upvotes, downvotes, isReply, parentId }: { id: string, upvotes: number, downvotes: number, isReply: boolean, parentId?: string }) => {
    const vote = commentVotes[id];
    const score = upvotes - downvotes;

    return (
      <div className={`flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 scale-90 origin-left ${isAdmin ? 'opacity-50' : ''}`}>
        <button
          onClick={() => !isAdmin && onCommentVote(id, 'up', isReply, parentId)}
          disabled={isAdmin}
          title={isAdmin ? "Voting disabled for administrators" : ""}
          className={`transition-colors ${vote === 'up' ? 'text-green-600' : 'text-gray-400'} ${!isAdmin ? 'hover:text-green-600' : 'cursor-not-allowed'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 4.06 5.03 11.03a.75.75 0 01-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12 4.75a.75.75 0 01.75.75v15a.75.75 0 01-1.5 0v-15a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
        <span className={`text-[10px] font-black min-w-[12px] text-center ${vote === 'up' ? 'text-green-600' : vote === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
          {score > 0 ? `+${score}` : score}
        </span>
        <button
          onClick={() => !isAdmin && onCommentVote(id, 'down', isReply, parentId)}
          disabled={isAdmin}
          title={isAdmin ? "Voting disabled for administrators" : ""}
          className={`transition-colors ${vote === 'down' ? 'text-red-600' : 'text-gray-400'} ${!isAdmin ? 'hover:text-red-600' : 'cursor-not-allowed'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12 20.25a.75.75 0 01-.75-.75V4.5a.75.75 0 011.5 0v15a.75.75 0 01-.75.75z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12 19.94l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.97 6.97z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-1/2 space-y-4">
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#8B3A2B] transition-colors">
            ← Back to projects
          </button>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <img src={project.imageUrl} alt={project.name} className="w-full aspect-[4/3] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="bg-[#8B3A2B] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">PHILIPPINES INFRA</span>
              <h2 className="text-3xl font-black leading-tight uppercase tracking-tighter">{project.name}</h2>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Project Overview</h3>
            <p className="text-gray-700 leading-relaxed font-medium">{project.description}</p>

            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase">Location</span>
                <span className="font-bold text-gray-900 text-sm">{project.location}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase">Status</span>
                <span className={`font-bold text-sm ${project.status === 'Finished Project' ? 'text-green-600' : 'text-[#8B3A2B]'}`}>{project.status}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase">Total Budget</span>
                <span className="font-black text-[#8B3A2B] text-sm tracking-tight">{project.budget}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase">Target Deadline</span>
                <span className="font-bold text-gray-900 text-sm">{project.deadline}</span>
              </div>
              {project.verificationDoc && (
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase">Verification Doc</span>
                  <button
                    onClick={handleViewDoc}
                    className="text-xs font-bold text-[#8B3A2B] underline cursor-pointer truncate block text-left w-full hover:text-[#6A2B20]"
                  >
                    {project.verificationDoc}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Management Section - Slick Segmented Toggle */}
          {isAdmin && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Administrative Actions</h4>
                <p className="font-bold text-gray-900 text-sm">Change Project Status</p>
              </div>

              <div className="relative bg-gray-200/50 p-1 rounded-2xl flex w-full max-w-[320px] self-center">
                {/* Animated Background Indicator */}
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${project.status === 'Finished Project'
                    ? 'translate-x-[calc(100%+0.25rem)]'
                    : 'translate-x-0'
                    }`}
                />

                <button
                  onClick={() => onUpdateStatus('Developing Project')}
                  className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${project.status === 'Developing Project' ? 'text-[#8B3A2B]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Developing
                </button>
                <button
                  onClick={() => onUpdateStatus('Finished Project')}
                  className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${project.status === 'Finished Project' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Finished
                </button>
              </div>

              <p className="text-[10px] text-gray-400 italic">
                * Changing this status will persist across the platform for all users.
              </p>
            </div>
          )}

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-center mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">COMMUNITY SCORE</h3>
              <div className="text-3xl font-black text-[#8B3A2B] mt-1">
                {project.upvotes + project.downvotes > 0
                  ? `${Math.round((project.upvotes / (project.upvotes + project.downvotes)) * 100)}%`
                  : '50%'}
              </div>
            </div>
            <TugOfWar upvotes={project.upvotes} downvotes={project.downvotes} />
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => !isAdmin && onVote('down')}
                disabled={isAdmin}
                title={isAdmin ? "Voting disabled for administrators" : ""}
                className="flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-sm ${currentUserVote === 'down'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                  : `bg-gray-100 text-gray-400 ${!isAdmin ? 'group-hover:bg-red-500 group-hover:text-white' : 'cursor-not-allowed opacity-50'}`
                  }`}>▼</div>
                <span className={`text-[10px] font-black mt-1 uppercase ${currentUserVote === 'down' ? 'text-red-500' : 'text-gray-400'}`}>Downvote</span>
              </button>
              <button
                onClick={() => !isAdmin && onVote('up')}
                disabled={isAdmin}
                title={isAdmin ? "Voting disabled for administrators" : ""}
                className="flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-sm ${currentUserVote === 'up'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                  : `bg-gray-100 text-gray-400 ${!isAdmin ? 'group-hover:bg-green-500 group-hover:text-white' : 'cursor-not-allowed opacity-50'}`
                  }`}>▲</div>
                <span className={`text-[10px] font-black mt-1 uppercase ${currentUserVote === 'up' ? 'text-green-500' : 'text-gray-400'}`}>Upvote</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Materials Table - Linked to database */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-gray-900 p-6 flex justify-between items-center">
            <h3 className="text-white font-black italic uppercase tracking-widest">Linked Materials Database</h3>
            <div className="w-12 h-6 construction-stripes opacity-30" />
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Material Item</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Unit</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Est. Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(showAllMaterials ? project.materials : project.materials.slice(0, 5)).map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => onMaterialClick(m.material)}
                          className="text-left font-bold text-gray-900 hover:text-[#8B3A2B] transition-colors focus:outline-none leading-tight"
                        >
                          {m.material}
                        </button>
                        <a
                          href={GLOBAL_DB_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[8px] font-black uppercase text-gray-400 tracking-widest hover:text-[#8B3A2B] transition-colors w-max"
                        >
                          View Ref Specs ↗
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">{m.unit}</td>
                    <td className="px-6 py-5 text-right font-black text-[#8B3A2B]">{m.price}</td>
                  </tr>
                ))}
                {project.materials.length > 5 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 bg-gray-50/30">
                      <button
                        onClick={() => setShowAllMaterials(!showAllMaterials)}
                        className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#8B3A2B] transition-colors"
                      >
                        {showAllMaterials ? '↑ Collapse List' : `↓ Show All Items (${project.materials.length})`}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 italic">
                * Material prices are synchronized with national standards.
              </span>
              <a href={GLOBAL_DB_URL} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase text-[#8B3A2B] hover:underline">
                Open National Database →
              </a>
            </div>
          </div>
        </section>

        {/* Discussion Feed */}
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Post an Update</h3>
            {isAdmin ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-gray-400 font-black text-sm uppercase italic tracking-tighter">
                  Administrative Mode: Posting disabled to maintain discussion neutrality
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Contribute transparency data or provide site photos..."
                    className={`w-full min-h-[120px] border-b-2 rounded-2xl p-4 pb-12 text-sm text-gray-900 placeholder:text-gray-300 outline-none transition-all ${error ? 'bg-red-50/50 border-red-300 focus:border-red-500' : 'bg-[#FDF7E7]/30 border-gray-200 focus:border-[#8B3A2B]'}`}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-3">
                    {previewImage && (
                      <div className="relative animate-in zoom-in-50 duration-200">
                        <img src={previewImage} className="w-10 h-10 rounded-lg object-cover border-2 border-[#8B3A2B] shadow-sm" />
                        <button type="button" onClick={() => setPreviewImage(null)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-sm hover:scale-110 transition-transform">×</button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-400 hover:border-[#8B3A2B] hover:text-[#8B3A2B] transition-all flex items-center justify-center group shadow-sm hover:shadow-md"
                    >
                      <span className="text-2xl font-light transform group-hover:rotate-90 transition-transform">+</span>
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>


                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-4">
                    {error && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide max-w-xs text-right animate-in fade-in slide-in-from-right-2">
                        {error}
                      </span>
                    )}
                    <button type="submit" className="bg-[#8B3A2B] text-white px-8 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#8B3A2B]/30 hover:scale-105 transition-transform active:scale-95 whitespace-nowrap">Post Comment</button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Discussion Feed</h3>
            {project.comments.map(c => (
              <div key={c.id} className="space-y-3">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 flex gap-4 hover:shadow-sm transition-shadow">
                  <img src={c.avatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />
                  <div className="space-y-2 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-gray-900 mr-2 text-sm uppercase tracking-tight">{c.author}</span>
                        <span className="text-[8px] font-black uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500">{c.role}</span>
                        {c.isVerified && (
                          <span className="ml-2 inline-block text-[8px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
                            ✓ Verified Media
                          </span>
                        )}
                        {c.isInformative && !c.isVerified && (
                          <span className="ml-2 inline-block text-[8px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                            ℹ Detailed Claim
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{c.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium notranslate">{c.text}</p>
                    {c.image && (
                      <div className="mt-2 rounded-2xl overflow-hidden border border-gray-100 max-w-[240px] shadow-sm no-tts">
                        <img src={c.image} className="w-full h-auto cursor-zoom-in hover:scale-105 transition-transform" alt="Evidence" />
                      </div>
                    )}

                    {/* Thread Action Bar */}
                    <div className="flex items-center gap-4 pt-1">
                      <CommentVoteControls id={c.id} upvotes={c.upvotes} downvotes={c.downvotes} isReply={false} />
                      <button
                        onClick={() => !isAdmin && setReplyingTo(replyingTo === c.id ? null : c.id)}
                        disabled={isAdmin}
                        title={isAdmin ? "Replying disabled for administrators" : ""}
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${isAdmin ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#8B3A2B]'}`}
                      >
                        <ReplyIcon />
                        {replyingTo === c.id ? 'Cancel' : 'Reply'}
                      </button>
                      {c.replies && c.replies.length > 0 && (
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                          className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${expandedComments[c.id] ? 'text-[#8B3A2B]' : 'text-gray-400 hover:text-[#8B3A2B]'}`}
                        >
                          <ChevronIcon isOpen={!!expandedComments[c.id]} />
                          {expandedComments[c.id] ? 'Hide' : `View ${c.replies.length} ${c.replies.length === 1 ? 'Reply' : 'Replies'}`}
                        </button>
                      )}
                      {c.author === currentUser && !isAdmin && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this comment?")) {
                              onDeleteComment(c.id);
                            }
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors ml-auto"
                        >
                          <TrashIcon />
                          Delete
                        </button>
                      )}
                    </div>

                    {/* Inline Reply Form */}
                    {replyingTo === c.id && (
                      <form
                        onSubmit={(e) => handleSubmitReply(e, c.id)}
                        className="mt-3 bg-gray-50/50 p-3 rounded-2xl border border-dashed border-gray-200 animate-in slide-in-from-top-2 duration-300"
                      >
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${c.author}...`}
                          autoFocus
                          className="w-full bg-transparent border-none text-sm placeholder:text-gray-300 focus:ring-0 outline-none min-h-[60px]"
                        />
                        <div className="flex justify-end pt-2">
                          <button type="submit" className="bg-[#8B3A2B] text-white px-4 py-1.5 rounded-lg font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-transform active:scale-95">Post Reply</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Replies (Reddit Style Nesting) */}
                {c.replies && c.replies.length > 0 && expandedComments[c.id] && (
                  <div className="ml-8 pl-5 border-l-2 border-gray-100 space-y-3 animate-in slide-in-from-top-4 duration-500">
                    {c.replies.map(r => (
                      <div key={r.id} className="bg-white/50 p-4 rounded-2xl border border-gray-50 flex gap-3 hover:shadow-sm transition-shadow">
                        <img src={r.avatar} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />
                        <div className="space-y-1 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-gray-900 mr-2 text-xs uppercase tracking-tight">{r.author}</span>
                              <span className="text-[7px] font-black uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{r.role}</span>
                            </div>
                            <span className="text-[9px] text-gray-300 font-mono">{r.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed notranslate">{r.text}</p>

                          {/* Reply Action Bar */}
                          <div className="flex items-center gap-4 pt-1">
                            <CommentVoteControls id={r.id} upvotes={r.upvotes} downvotes={r.downvotes} isReply={true} parentId={c.id} />
                            {r.author === currentUser && !isAdmin && (
                              <button
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this reply?")) {
                                    onDeleteReply(c.id, r.id);
                                  }
                                }}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors ml-auto"
                              >
                                <TrashIcon />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;
