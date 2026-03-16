import React, { useState } from 'react';
import { ForumPost } from '../types';

interface ForumProps {
  posts: ForumPost[];
  onPostClick: (id: string) => void;
  onCreatePostClick: () => void;
  onVote: (postId: string, type: 'up' | 'down') => void;
  userVotes: Record<string, 'up' | 'down' | null>;
  isAdmin?: boolean;
  currentUser?: string;
  onDeletePost?: (postId: string) => void;
}

const Forum: React.FC<ForumProps> = ({ posts, onPostClick, onCreatePostClick, onVote, userVotes, isAdmin, currentUser, onDeletePost }) => {
  const [filter, setFilter] = useState<'top' | 'new' | 'rising'>('new');

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === 'new') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (filter === 'top') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    return (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes); // Rising = engagement
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#8B3A2B] uppercase tracking-tighter">Community Forum</h1>
          <p className="text-gray-600 mt-2 font-medium">The reality regarding Infrastructure, straight from the community.</p>
        </div>
        {!isAdmin && (
          <button
            onClick={onCreatePostClick}
            className="bg-[#8B3A2B] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            Create Post
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        {(['new', 'top', 'rising'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-black uppercase text-xs tracking-widest transition-colors ${
              filter === f ? 'text-[#8B3A2B] border-b-4 border-[#8B3A2B]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 hover:border-[#8B3A2B]/30 transition-colors cursor-pointer"
            onClick={() => onPostClick(post.id)}
          >
            {/* Voting Sidebar (Reddit style) */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); if (!isAdmin) onVote(post.id, 'up'); }}
                disabled={isAdmin}
                title={isAdmin ? "Voting disabled for administrators" : ""}
                className={`p-1 rounded-md transition-colors ${userVotes[post.id] === 'up' ? 'text-orange-600 bg-orange-50' : `text-gray-400 ${!isAdmin ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}`}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
                </svg>
              </button>
              <span className={`font-black text-sm ${userVotes[post.id] === 'up' ? 'text-orange-600' : userVotes[post.id] === 'down' ? 'text-blue-600' : 'text-gray-700'}`}>
                {post.upvotes - post.downvotes}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); if (!isAdmin) onVote(post.id, 'down'); }}
                disabled={isAdmin}
                title={isAdmin ? "Voting disabled for administrators" : ""}
                className={`p-1 rounded-md transition-colors ${userVotes[post.id] === 'down' ? 'text-blue-600 bg-blue-50' : `text-gray-400 ${!isAdmin ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}`}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 20l-8-8h6V4h4v8h6l-8 8z" />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                <span className="text-[#8B3A2B]">{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                {post.attachments.length > 0 && (
                  <span className="flex items-center gap-1 text-blue-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Has Files
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{post.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
              
              <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest mt-4">
                <div className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments.length} Comments
                </div>
                
                {!isAdmin && currentUser === post.author && onDeletePost && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this forum post? This cannot be undone.")) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-600 transition-colors ml-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Post
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
