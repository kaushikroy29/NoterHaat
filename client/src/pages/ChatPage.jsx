import { useState } from 'react';
import { Search, Send, Image as ImageIcon, Smile, CheckCheck, MoreVertical, ArrowLeft } from 'lucide-react';
import { formatBDT } from '../utils/serialAnalyzer';

const mockThreads = [
  { id: 't1', user: 'রহিম আহমেদ', serial: 'কখ 1402199', price: 2500, unread: 2, status: 'pending', lastMsg: 'আপনার অফারটি বিবেচনা করছি...', time: '১০:৪৫ এএম', avatar: 'র' },
  { id: 't2', user: 'সাবরিনা ইসলাম', serial: 'গঘ 1234567', price: 5000, unread: 0, status: 'accepted', lastMsg: 'ঠিক আছে, আমি রাজি।', time: 'গতকাল', avatar: 'সা' },
  { id: 't3', user: 'তানিয়া আক্তার', serial: 'জঝ 1234321', price: 3500, unread: 0, status: 'counter', lastMsg: '৩০০০ টাকায় দেওয়া সম্ভব নয়, তবে ৩২০০ টাকায় দিতে পারি।', time: 'রবিবার', avatar: 'তা' },
];

const mockMessages = [
  { id: 'm1', sender: 'them', text: 'নোটটি কি এখনও এভেইলেবল আছে?', time: '১০:৩০ এএম' },
  { id: 'm2', sender: 'me', text: 'হ্যাঁ, আছে। আপনি কি ওই ১৪ ফেব্রুয়ারি ১৯৯৫ তারিখের নোটটির কথা বলছেন?', time: '১০:৩৫ এএম' },
  { id: 'm3', sender: 'them', type: 'offer', offerPrice: 2000, status: 'pending', time: '১০:৪০ এএম' },
  { id: 'm4', sender: 'them', text: 'আপনার অফারটি বিবেচনা করছি...', time: '১০:৪৫ এএম' },
];

export default function ChatPage() {
  const [activeThread, setActiveThread] = useState(mockThreads[0].id);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [mobileView, setMobileView] = useState('list'); // list | chat

  const targetThread = mockThreads.find(t => t.id === activeThread);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    
    setMessages([...messages, {
      id: `m${Date.now()}`,
      sender: 'me',
      text: msgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMsgInput('');
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-dark text-[10px] font-bold">অফার পেন্ডিং</span>;
      case 'accepted': return <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">অফার গৃহীত</span>;
      case 'counter': return <span className="px-2 py-0.5 rounded-full bg-blue/20 text-blue font-bold text-[10px]">কাউন্টার অফার</span>;
      default: return null;
    }
  };

  return (
    <div className="h-[calc(100vh-72px)] bg-bg p-0 md:p-4 md:pb-8 flex justify-center">
      <div className="container-custom max-w-6xl h-full flex mt-0 md:mt-2 bg-white rounded-none md:rounded-2xl shadow-sm border border-border overflow-hidden">
        
        {/* LEFT PANEL - Thread List */}
        <div className={`w-full md:w-80 border-r border-border flex flex-col ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">ইনবক্স</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="text" placeholder="চ্যাট খুঁজুন..." className="input pl-9 py-2 text-sm bg-bg border-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {mockThreads.map(t => (
              <div 
                key={t.id}
                onClick={() => { setActiveThread(t.id); setMobileView('chat'); }}
                className={`flex gap-3 p-4 cursor-pointer hover:bg-bg transition-colors border-b border-border/50 ${activeThread === t.id ? 'bg-primary/5' : ''}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-[family-name:var(--font-heading)]">
                    {t.avatar}
                  </div>
                  {t.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {t.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm truncate font-[family-name:var(--font-heading)]">{t.user}</p>
                    <span className="text-[10px] text-text-muted whitespace-nowrap">{t.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-[family-name:var(--font-mono)] truncate max-w-[80px] text-text-muted">#{t.serial}</span>
                    {getStatusChip(t.status)}
                  </div>
                  <p className="text-xs text-text-muted truncate font-[family-name:var(--font-heading)]">{t.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Active Chat */}
        <div className={`flex-1 flex flex-col bg-bg/30 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="h-16 border-b border-border bg-white flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 -ml-2 text-text-muted" onClick={() => setMobileView('list')}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary font-[family-name:var(--font-heading)]">
                {targetThread?.avatar}
              </div>
              <div>
                <p className="font-bold text-sm font-[family-name:var(--font-heading)]">{targetThread?.user}</p>
                <p className="text-xs text-text-muted">লিস্টিং: <span className="font-[family-name:var(--font-mono)]">{targetThread?.serial}</span></p>
              </div>
            </div>
            <button className="p-2 text-text-muted hover:bg-bg rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Active Offer Banner (optional) */}
          {targetThread?.status === 'pending' && (
             <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center justify-between font-[family-name:var(--font-heading)]">
               <span className="text-sm font-bold text-accent-dark">💰 ২,০০০৳ এর অফার পেন্ডিং</span>
               <div className="flex gap-2">
                 <button className="btn btn-green btn-sm py-1 px-3 text-xs">গ্রহণ করুন</button>
                 <button className="btn btn-gold-outline btn-sm py-1 px-3 text-xs">অস্বীকার</button>
               </div>
             </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scroll-smooth">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'offer' ? (
                  /* Offer Card Bubble */
                  <div className="offer-card max-w-[80%] bg-white w-64 md:w-80 font-[family-name:var(--font-heading)]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">৳{msg.offerPrice}</span>
                      <span className="px-2 py-1 bg-accent/20 text-accent-dark text-xs font-bold rounded-full">নতুন অফার</span>
                    </div>
                    <p className="text-xs text-text-muted mb-4">ক্রেতা আপনার নোটের জন্য এই মূল্য প্রস্তাব করেছেন।</p>
                    <div className="flex gap-2">
                      <button className="btn btn-green flex-1 text-xs">গ্রহণ</button>
                      <button className="btn border border-border bg-bg flex-1 text-xs">প্রত্যাখ্যান</button>
                    </div>
                  </div>
                ) : (
                  /* Normal Text Bubble */
                  <div className={`chat-bubble font-[family-name:var(--font-heading)] ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    {msg.text}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-text-muted">{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-primary" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-border shrink-0">
            <form onSubmit={sendMessage} className="flex items-end gap-2">
              <button type="button" className="p-2.5 text-text-muted hover:text-primary transition-colors hover:bg-bg rounded-full">
                <ImageIcon className="w-5 h-5" />
              </button>
              <div className="flex-1 min-h-[44px] bg-bg rounded-2xl md:rounded-full flex items-center px-4 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="মেসেজ লিখুন..."
                  className="w-full bg-transparent border-none outline-none text-sm py-3 font-[family-name:var(--font-heading)]"
                />
                <button type="button" className="p-1 text-text-muted hover:text-primary shrink-0">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button 
                type="submit" 
                disabled={!msgInput.trim()} 
                className={`p-3 rounded-full flex items-center justify-center shrink-0 transition-colors ${msgInput.trim() ? 'bg-primary text-white shadow-md' : 'bg-border text-white/50'}`}
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
