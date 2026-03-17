import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AdminDashboard() {
  const { listings, pendingListings, unverifiedUsers, user } = useStore();

  if (user?.role !== 'admin') {
    return <div className="p-12 text-center text-danger">Access Denied. Admin only.</div>;
  }

  const stats = [
    { label: 'মোট সক্রিয় লিস্টিং', value: listings.length, icon: FileText, color: 'text-blue' },
    { label: 'অপেক্ষমাণ লিস্টিং', value: pendingListings.length, icon: CheckCircle, color: 'text-accent-dark' },
    { label: 'নতুন ইউজার ভেরিফিকেশন', value: unverifiedUsers.length, icon: Users, color: 'text-pink' },
    { label: 'আজকের বিক্রি (৳)', value: '12,500', icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="container-custom max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-text-muted font-[family-name:var(--font-heading)]">স্বাগতম, অ্যাডমিন! সিস্টেমের ওভারভিউ দেখুন।</p>
          </div>
          <div className="flex gap-3">
             <Link to="/admin/approvals" className="btn btn-gold">অনুমোদন প্যানেল ({pendingListings.length + unverifiedUsers.length})</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-bg ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold font-[family-name:var(--font-heading)]">{stat.value}</h3>
                <p className="text-sm text-text-muted font-[family-name:var(--font-heading)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions / Recent Activity could go here... */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 font-[family-name:var(--font-heading)]">সাম্প্রতিক কার্যকলাপ</h2>
          <div className="text-center py-12 text-text-muted font-[family-name:var(--font-heading)]">
            কোনো সাম্প্রতিক বড় কার্যকলাপ নেই।
          </div>
        </div>
      </div>
    </div>
  );
}
