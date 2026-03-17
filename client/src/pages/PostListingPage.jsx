import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, UploadCloud, AlertCircle } from 'lucide-react';
import { analyzeSerial } from '../utils/serialAnalyzer';
import { useStore } from '../store/useStore';

export default function PostListingPage() {
  const navigate = useNavigate();
  const { addListing } = useStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    denomination: 100,
    serialNumber: '',
    year: '2023',
    condition: 'uncirculated',
    frontImage: null,
    backImage: null,
    askingPrice: '',
    allowOffers: true,
    minOfferPrice: '',
    isGiftable: false,
    description: '',
  });

  // Analysis state
  const [analysis, setAnalysis] = useState(null);

  // Live analysis of serial number
  useEffect(() => {
    if (formData.serialNumber.length >= 4) {
      setAnalysis(analyzeSerial(formData.serialNumber));
    } else {
      setAnalysis(null);
    }
  }, [formData.serialNumber]);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newListing = {
        _id: `lst_${Date.now()}`,
        sellerId: { _id: 'me', name: 'আপনি', rating: 5.0, totalSales: 0, isVerified: true },
        ...formData,
        askingPrice: parseInt(formData.askingPrice),
        minOfferPrice: formData.minOfferPrice ? parseInt(formData.minOfferPrice) : null,
        serialPatterns: analysis?.patterns || [],
        matchingDates: analysis?.dateMatches?.map(d => d.date) || [],
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      addListing(newListing);
      setIsSubmitting(false);
      navigate(`/listing/${newListing._id}`);
    }, 1500);
  };

  const steps = [
    { num: 1, label: 'নোটের তথ্য' },
    { num: 2, label: 'ছবি আপলোড' },
    { num: 3, label: 'মূল্য ও অফার' },
    { num: 4, label: 'পাবলিশ' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-custom py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 font-[family-name:var(--font-heading)]">
          নোট বিক্রি করুন
        </h1>

        {/* Stepper */}
        <div className="stepper mb-10 overflow-x-auto pb-4">
          {steps.map((s, i) => (
            <div key={s.num} className="stepper-step">
              <div className={`stepper-circle ${step === s.num ? 'active' : step > s.num ? 'completed' : 'pending'}`}>
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap hidden sm:block font-[family-name:var(--font-heading)] ${step === s.num ? 'text-primary' : step > s.num ? 'text-success' : 'text-text-muted'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`stepper-line ${step > s.num ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Note Info */}
            {step === 1 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                <div>
                  <label className="text-sm font-bold mb-3 block font-[family-name:var(--font-heading)]">নোটের মূল্যমান</label>
                  <div className="flex flex-wrap gap-3">
                    {[10, 20, 50, 100, 200, 500, 1000].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({ ...formData, denomination: d })}
                        className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                          formData.denomination === d 
                            ? 'border-primary bg-primary text-white' 
                            : 'border-border bg-surface text-text hover:border-primary/50'
                        }`}
                      >
                        ৳{d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-1 block font-[family-name:var(--font-heading)]">সিরিয়াল নম্বর</label>
                  <input
                    type="text"
                    required
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value.toUpperCase() })}
                    placeholder="যেমন: কখ ১২৩৪৫৬৭"
                    className="input text-lg font-[family-name:var(--font-mono)]"
                  />
                  
                  {/* Live Analysis Feedback */}
                  {analysis && analysis.patterns.length > 0 && (
                    <div className="mt-3 p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
                      <p className="text-sm font-bold text-accent-dark font-[family-name:var(--font-heading)] flex items-center gap-1">
                        🎉 অসাধারণ! আমরা কিছু বিশেষত্ব পেয়েছি:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.patternLabels.map((l, i) => (
                          <span key={i} className={`badge badge-${l.color}`}>✓ {l.bn}</span>
                        ))}
                      </div>
                      {analysis.dateMatches?.length > 0 && (
                        <p className="text-xs text-text-muted mt-2 font-[family-name:var(--font-heading)]">
                          এই নম্বরটি {analysis.dateMatches[0].date} তারিখের সাথে মিলে যায়!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold mb-1 block font-[family-name:var(--font-heading)]">ছাপানোর বছর</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1 block font-[family-name:var(--font-heading)]">অবস্থা</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="input select"
                    >
                      <option value="uncirculated">একেবারে নতুন (Uncirculated)</option>
                      <option value="good">ভালো (Good)</option>
                      <option value="fair">মোটামুটি (Fair)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Images */}
            {step === 2 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                <div className="p-4 bg-blue/10 border border-blue/20 rounded-lg flex gap-3 text-blue">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-[family-name:var(--font-heading)]">
                    স্পষ্ট আলোতে ছবি তুলুন যাতে সিরিয়াল নম্বর ভালোভাবে বোঝা যায়। স্ক্রিনশট বা ঝাপসা ছবি বাতিল হতে পারে।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Front Image */}
                  <div className="border-2 border-dashed border-border hover:border-primary transition-colors rounded-xl p-6 text-center cursor-pointer bg-bg">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-bold text-sm mb-1 font-[family-name:var(--font-heading)]">নোটের সামনের দিকের ছবি</p>
                    <p className="text-xs text-text-muted">ক্লিক করুন বা ড্র্যাগ করুন</p>
                  </div>

                  {/* Back Image */}
                  <div className="border-2 border-dashed border-border hover:border-primary transition-colors rounded-xl p-6 text-center cursor-pointer bg-bg">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-bold text-sm mb-1 font-[family-name:var(--font-heading)]">নোটের পিছনের দিকের ছবি</p>
                    <p className="text-xs text-text-muted">ক্লিক করুন বা ড্র্যাগ করুন</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Price & Settings */}
            {step === 3 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                {analysis && analysis.suggestedPriceRange && (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success font-bold font-[family-name:var(--font-heading)]">
                      💡 আমাদের এআই বিশ্লেষণ অনুযায়ী আপনার নোটের প্রস্তাবিত মূল্য:
                      <br/>
                      <span className="text-xl">৳{analysis.suggestedPriceRange.min} — ৳{analysis.suggestedPriceRange.max}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold mb-1 block font-[family-name:var(--font-heading)]">বিক্রয় মূল্য (BDT)</label>
                  <input
                    type="number"
                    required
                    value={formData.askingPrice}
                    onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                    placeholder="৳"
                    className="input text-xl font-bold font-[family-name:var(--font-mono)]"
                  />
                </div>

                <div className="border border-border rounded-lg p-4 bg-bg/50">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={formData.allowOffers}
                      onChange={(e) => setFormData({ ...formData, allowOffers: e.target.checked })}
                      className="w-5 h-5 accent-primary rounded"
                    />
                    <span className="font-bold font-[family-name:var(--font-heading)]">অফার গ্রহণ করবেন?</span>
                  </label>
                  
                  {formData.allowOffers && (
                    <div className="pl-8">
                      <label className="text-sm text-text-muted mb-1 block font-[family-name:var(--font-heading)]">সর্বনিম্ন গ্রহণীয় অফার (ঐচ্ছিক)</label>
                      <input
                        type="number"
                        value={formData.minOfferPrice}
                        onChange={(e) => setFormData({ ...formData, minOfferPrice: e.target.value })}
                        placeholder="৳"
                        className="input bg-white w-full sm:w-1/2"
                      />
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-lg bg-bg/50 hover:border-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isGiftable}
                    onChange={(e) => setFormData({ ...formData, isGiftable: e.target.checked })}
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <div>
                    <span className="font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
                      🎁 গিফটের জন্য উপযুক্ত
                    </span>
                    <span className="text-xs text-text-muted">লিস্টিংয়ে গিফট ব্যাজ দেখাবে এবং ক্রেতারা র্যাপিং চাইতে পারবেন</span>
                  </div>
                </label>

                <div>
                  <label className="text-sm font-bold mb-1 block font-[family-name:var(--font-heading)]">বিবরণ</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="নোটটির বিশেষত্ব সম্পর্কে আরো কিছু লিখুন..."
                    className="input h-32 resize-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Preview */}
            {step === 4 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                <h3 className="text-lg font-bold text-center font-[family-name:var(--font-heading)]">প্রিভিউ</h3>
                <div className="max-w-sm mx-auto opacity-80 pointer-events-none">
                  <div className="card">
                    <div className="relative h-40 bg-gradient-to-br from-bg to-border overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-bold opacity-10 font-[family-name:var(--font-mono)]">
                          ৳{formData.denomination}
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold bg-primary">
                        ৳{formData.denomination}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="serial-number text-lg text-primary">{formData.serialNumber || 'XXXXXXX'}</div>
                      <div className="text-lg font-bold text-primary font-[family-name:var(--font-heading)]">
                        মূল্য: ৳{formData.askingPrice || '0'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg text-sm font-[family-name:var(--font-heading)] mt-6 text-center">
                  সবকিছু ঠিক থাকলে 'পাবলিশ করুন' বাটনে ক্লিক করুন। লিস্টিংটি পর্যালোচনা করে অ্যাপ্রুভ করা হবে।
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-border mt-8">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="btn border border-border bg-bg hover:bg-border">
                  আগের ধাপ
                </button>
              ) : <div></div>}
              
              {step < 4 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="btn btn-green"
                  disabled={step === 1 && !formData.serialNumber.trim()}
                >
                  পরের ধাপ
                </button>
              ) : (
                <button 
                  type="submit" 
                  className={`btn btn-green ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'পাবলিশ হচ্ছে...' : '📢 লিস্টিং পাবলিশ করুন'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
