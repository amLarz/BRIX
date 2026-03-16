import React, { useState } from 'react';

interface CreatePostProps {
  onBack: () => void;
  onSubmit: (title: string, content: string, attachments: File[]) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onBack, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title, content, files);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8B3A2B] font-black uppercase tracking-widest text-xs mb-8 hover:-translate-x-1 transition-transform"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Forum
      </button>

      <div className="bg-white rounded-[2rem] p-8 shadow-2xl border-4 border-[#8B3A2B]">
        <h1 className="text-3xl font-black text-[#8B3A2B] uppercase tracking-tighter mb-8 italic">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Thread Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind regarding infrastructure?"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-[#8B3A2B] focus:ring-0 transition-all font-bold text-gray-900 placeholder:text-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Content / Evidence</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the situation in detail. Be as honest as possible."
              rows={8}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl px-6 py-4 focus:border-[#8B3A2B] focus:ring-0 transition-all font-medium text-gray-700 placeholder:text-gray-300 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Attachments (Images/Docs)</label>
            <div className="relative group">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full bg-dashed border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center transition-colors group-hover:border-[#8B3A2B]/50 group-hover:bg-gray-50">
                <svg className="w-10 h-10 text-gray-300 mb-4 group-hover:text-[#8B3A2B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-400 font-bold text-sm">
                  {files.length > 0 ? `${files.length} files selected` : 'Drop files here or click to upload'}
                </span>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((file, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B3A2B] text-white py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#8B3A2B]/20"
          >
            Post to Community
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
