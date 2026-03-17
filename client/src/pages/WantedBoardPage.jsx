import { useState } from 'react';
import { PlusCircle, X, Search, Calendar, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import WantedCard from '../components/cards/WantedCard';
import { getOccasionLabel } from '../utils/dateFinder';

export default function WantedBoardPage() {
  const { wantedPosts, addWantedPost } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form State
  const [formData, setFormData] = useState({
    denomination: '',
    targetType: 'date', // date | serial
    targetValue: '',
    occasion: 'birthday',
    maxBudget: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      _id: `wp_${Date.now()}`,
      buyerId: { _id: 'me', name: 'আপনি (নতুন)' },
      denomination: formData.denomination ? parseInt(formData.denomination) : null,
      targetDate: formData.targetType === 'date' ? formData.targetValue : '',
      targetSerial: formData.targetType === 'serial' ? formData.targetValue : '',
      occasion: formData.occasion,
      maxBudget: parseInt(formData.maxBudget),
      description: formData.description,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    addWantedPost(newPost);
    setShowForm(false);
    setFormData({
      denomination: '', targetType: 'date', targetValue: '',
      occasion: 'birthday', maxBudget: '', description: ''
    });
  };

  const filteredPosts = wantedPosts.filter(p => {
    if (activeTab === 'all') return true;
    return p.occasion === activeTab;
  });

  return (
    <div className="min-h-screen bg-bg pb-12">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4 mb-8">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)]">
            📋 ক্রেতাদের চাহিদা বোর্ড
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto font-[family-name:var(--font-heading)]">
            যেকোনো বিশেষ নোট বিক্রি করতে চাইলে এখানে দেখতে পারেন ক্রেতারা কী খুঁজছেন। আপনার নোটটি হয়তো কারো খুব দরকার!
          </p>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="btn btn-gold mt-6 animate-[pulse_2s_ease-i-out_infinite]"
            >
              <PlusCircle className="w-5 h-5" /> আমি একটি নোট খুঁজছি
            </button>
          )}
        </div>
      </div>

      <div className="container-custom max-w-6xl">
        {/* Post Form (Collapsible) */}
        {showForm && (
          <div className="card-wanted bg-white p-6 md:p-8 mb-8 animate-[slideUp_0.3s_ease]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">নতুন চাহিদা পোস্ট করুন</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-bg rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold mb-2 block font-[family-name:var(--font-heading)]">কী খুঁজছেন?</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.targetType}
                      onChange={(e) => setFormData({ ...formData, targetType: e.target.value, targetValue: '' })}
                      className="input select w-1/3"
                    >
                      <option value="date">তারিখ</option>
                      <option value="serial">সিরিয়াল</option>
                    </select>
                    <input
                      type={formData.targetType === 'date' ? 'date' : 'text'}
                      value={formData.targetValue}
                      onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                      placeholder={formData.targetType === 'serial' ? 'EX: 7777777' : ''}
                      className="input w-2/3"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block font-[family-name:var(--font-heading)]">নোটের মূল্যমান (ঐচ্ছিক)</label>
                  <select
                    value={formData.denomination}
                    onChange={(e) => setFormData({ ...formData, denomination: e.target.value })}
                    className="input select"
                  >
                    <option value="">যেকোনো মূল্যের নোট</option>
                    {[10, 20, 50, 100, 200, 500, 1000].map(d => (
                      <option key={d} value={d}>৳{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block font-[family-name:var(--font-heading)]">উপলক্ষ</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="input select"
                  >
                    {['birthday', 'anniversary', 'wedding', 'graduation', 'other'].map(occ => {
                      const l = getOccasionLabel(occ);
                      return <option key={occ} value={occ}>{l.emoji} {l.bn}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block font-[family-name:var(--font-heading)]">সর্বোচ্চ বাজেট (BDT)</label>
                  <input
                    type="number"
                    value={formData.maxBudget}
                    onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                    placeholder="৳"
                    className="input font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block font-[family-name:var(--font-heading)]">বিস্তারিত বিবরণ</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="যেমন: আমি আমার ছেলের জন্মদিনের জন্য ১৪/০২/২০১০ তারিখের মিল থাকা যেকোনো নোট খুঁজছি..."
                  className="input h-24 resize-none placeholder:text-sm"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="btn btn-green btn-lg w-full md:w-auto px-10">
                  <PlusCircle className="w-5 h-5 mr-1" /> পোস্ট করুন
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters & Board */}
        <div className="flex gap-2 mb-6 pills-scroll overflow-x-auto pb-2">
          {[{ key: 'all', label: 'সবগুলো' }, ...['birthday', 'anniversary', 'other'].map(k => ({ key: k, label: getOccasionLabel(k).bn }))].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pill text-sm ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <WantedCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
