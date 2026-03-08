import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', sender: 'Alex', text: 'Hey everyone, has anyone checked the progress on the Quezon Avenue Flyover?', timestamp: '10:00 AM', isMe: false },
  { id: '2', sender: 'Sam', text: 'Yeah, it looks like they are finally putting up the beams.', timestamp: '10:02 AM', isMe: false },
  { id: '3', sender: 'Jordan', text: 'About time! Hopefully it finishes by next month.', timestamp: '10:05 AM', isMe: false },
];

const CommunityChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: 'Citizen',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 bg-[#8B3A2B] text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
          <h2 className="font-bold tracking-tight">Community Chat</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-full transition-all active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth"
      >
        <div className="text-center py-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
            Live Feed
          </span>
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            {!msg.isMe && (
              <div className="flex items-center gap-1.5 mb-1 ml-1">
                <div className="w-4 h-4 rounded-full bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-500">{msg.sender}</span>
              </div>
            )}
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm transition-all hover:shadow-md ${
              msg.isMe 
                ? 'bg-[#8B3A2B] text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.text}
            </div>
            <span className="text-[9px] text-gray-400 mt-1.5 mx-1 font-medium italic">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
        <div className="flex-1 relative group">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-gray-100 border-none rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8B3A2B]/20 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <button 
          type="submit"
          className="p-2.5 bg-[#8B3A2B] text-white rounded-2xl hover:bg-[#7A3326] transition-all shadow-lg active:scale-90 transform disabled:opacity-50 disabled:scale-100 group"
          disabled={!newMessage.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default CommunityChat;
