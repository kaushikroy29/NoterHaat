import { formatBDT } from '../../utils/serialAnalyzer';
import { getOccasionLabel } from '../../utils/dateFinder';

export default function WantedCard({ post }) {
  const buyer = post.buyerId || {};
  const occasion = getOccasionLabel(post.occasion);

  return (
    <div className="card-wanted rounded-xl p-5 space-y-3 transition-all hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent-dark">
            {buyer.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-semibold text-sm text-text font-[family-name:var(--font-heading)]">{buyer.name}</p>
            <p className="text-[11px] text-text-muted">
              {new Date(post.createdAt).toLocaleDateString('bn-BD')}
            </p>
          </div>
        </div>
        <span className="text-2xl">{occasion.emoji}</span>
      </div>

      {/* What they want */}
      <p className="text-sm text-text font-[family-name:var(--font-heading)] leading-relaxed">
        {post.description}
      </p>

      {/* Details */}
      <div className="flex flex-wrap gap-2">
        {post.denomination && (
          <span className="badge badge-green">৳{post.denomination}</span>
        )}
        {post.targetDate && (
          <span className="badge badge-pink">📅 {post.targetDate}</span>
        )}
        {post.targetSerial && (
          <span className="badge badge-purple font-[family-name:var(--font-mono)]">
            #{post.targetSerial}
          </span>
        )}
        <span className="badge badge-gold">{occasion.bn}</span>
      </div>

      {/* Budget */}
      <div className="flex items-center justify-between pt-2 border-t border-accent/20">
        <span className="text-xs text-text-muted font-[family-name:var(--font-heading)]">সর্বোচ্চ বাজেট:</span>
        <span className="text-base font-bold text-success font-[family-name:var(--font-heading)]">
          {formatBDT(post.maxBudget)}
        </span>
      </div>

      {/* Action */}
      <button className="btn btn-gold btn-sm w-full">
        আমার কাছে আছে
      </button>
    </div>
  );
}
