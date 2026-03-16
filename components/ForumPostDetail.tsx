import React from 'react';
import { ForumPost } from '../types';

interface ForumPostDetailProps {
  post: ForumPost;
  onBack: () => void;
  onVote: (type: 'up' | 'down') => void;
  currentUserVote: 'up' | 'down' | null;
  onAddComment: (text: string) => void;
}

const ForumPostDetail: React.FC<ForumPostDetailProps> = ({ post, onBack, onVote, currentUserVote, onAddComment }) => {
  const [commentText, setCommentText] = React.useState('');

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8B3A2B] font-black uppercase tracking-widest text-xs mb-8 hover:-translate-x-1 transition-transform"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Forum
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex">
          {/* Side Voting Bar */}
          <div className="bg-gray-50/50 p-4 flex flex-col items-center gap-2 border-r border-gray-100">
            <button
              onClick={() => onVote('up')}
              className={`p-1.5 rounded-lg transition-colors ${currentUserVote === 'up' ? 'text-orange-600 bg-orange-100/50' : 'text-gray-400 hover:bg-gray-200'}`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
              </svg>
            </button>
            <span className={`font-black text-lg ${currentUserVote === 'up' ? 'text-orange-600' : currentUserVote === 'down' ? 'text-blue-600' : 'text-gray-700'}`}>
              {post.upvotes - post.downvotes}
            </span>
            <button
              onClick={() => onVote('down')}
              className={`p-1.5 rounded-lg transition-colors ${currentUserVote === 'down' ? 'text-blue-600 bg-blue-100/50' : 'text-gray-400 hover:bg-gray-200'}`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 20l-8-8h6V4h4v8h6l-8 8z" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-8">
            <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[#8B3A2B]">
                 {post.author[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900">{post.author}</span>
                <span className="text-[10px] opacity-70">{post.date}</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-6 leading-tight">{post.title}</h1>
            
            <div className="prose prose-slate max-w-none text-gray-700 font-medium leading-relaxed mb-8">
              {post.content}
            </div>

            {post.attachments.length > 0 && (
              <div className="space-y-4 mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8B3A2B]">Attached Files</h3>
                <div className="grid grid-cols-2 gap-4">
                  {post.attachments.map((file, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center">
                           <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                           </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-3 text-white text-[10px] font-bold uppercase tracking-widest flex justify-between items-center">
                        <span className="truncate pr-2">{file.name}</span>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#8B3A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comments.length} Comments
              </h3>
              
              <div className="mb-8">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What is your take on this?"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-[#8B3A2B] focus:ring-0 transition-all font-medium text-gray-700 placeholder:text-gray-300 resize-none h-32 mb-4"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-[#8B3A2B] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                >
                  Comment
                </button>
              </div>

              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center p-2">
                       <img src={comment.avatar} alt={comment.author} className="w-full h-full opacity-50" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{comment.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostDetail;
