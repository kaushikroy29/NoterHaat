import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Check, X, Eye, ShieldAlert } from 'lucide-react';

export default function AdminApprovals() {
  const { pendingListings, unverifiedUsers, approveListing, rejectListing, verifyUser, user } = useStore();
  const [activeTab, setActiveTab] = useState('listings');

  if (user?.role !== 'admin') {
    return <div className="p-12 text-center text-danger">Access Denied. Admin only.</div>;
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-6">অনুমোদন প্যানেল</h1>

        <div className="flex gap-4 mb-6 border-b border-border pb-2">
          <button 
            onClick={() => setActiveTab('listings')}
            className={`font-bold pb-2 border-b-2 px-4 transition-colors ${activeTab === 'listings' ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}
          >
            অপেক্ষমাণ লিস্টিং ({pendingListings.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`font-bold pb-2 border-b-2 px-4 transition-colors ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}
          >
            ইউজার ভেরিফিকেশন ({unverifiedUsers.length})
          </button>
        </div>

        {activeTab === 'listings' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            {pendingListings.length === 0 ? (
              <p className="text-center py-12 text-text-muted">কোনো অপেক্ষমাণ লিস্টিং নেই।</p>
            ) : (
              pendingListings.map(listing => (
                <div key={listing._id} className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white font-bold font-[family-name:var(--font-mono)]">
                      ৳{listing.denomination}
                    </div>
                    <div>
                      <p className="font-bold text-lg font-[family-name:var(--font-mono)] text-primary">{listing.serialNumber}</p>
                      <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">বিক্রেতা: {listing.sellerId.name}</p>
                      <p className="text-sm font-bold font-[family-name:var(--font-heading)]">মূল্য: ৳{listing.askingPrice}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button className="btn bg-bg border border-border text-text hover:bg-border px-3 py-2">
                      <Eye className="w-4 h-4" /> 
                    </button>
                    <button 
                      onClick={() => approveListing(listing._id)}
                      className="btn btn-green px-4 py-2"
                    >
                      <Check className="w-4 h-4 mr-1" /> অনুমোদন
                    </button>
                    <button 
                      onClick={() => rejectListing(listing._id)}
                      className="btn border border-danger text-danger hover:bg-danger hover:text-white px-4 py-2"
                    >
                      <X className="w-4 h-4 mr-1" /> বাতিল
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            {unverifiedUsers.length === 0 ? (
              <p className="text-center py-12 text-text-muted">কোনো ইউজার ভেরিফিকেশন বাকি নেই।</p>
            ) : (
              unverifiedUsers.map(u => (
                <div key={u._id} className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent-dark">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg font-[family-name:var(--font-heading)]">{u.name}</p>
                      <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">ইমেইল: {u.email}</p>
                      <p className="text-xs text-text-muted">যোগদান: {new Date(u.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button className="btn bg-bg border border-border text-text hover:bg-border px-3 py-2 text-sm font-[family-name:var(--font-heading)]">
                      ডকুমেন্ট দেখুন
                    </button>
                    <button 
                      onClick={() => verifyUser(u._id)}
                      className="btn btn-green px-4 py-2"
                    >
                      <Check className="w-4 h-4 mr-1" /> ভেরিফাই করুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
