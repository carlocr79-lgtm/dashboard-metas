export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'kpi') {
    return (
      <div className="skeleton-pulse" style={{ background: '#e2e8f0', height: '120px', borderRadius: '20px', width: '100%' }}></div>
    );
  }

  if (type === 'table-row') {
    return (
      <div className="skeleton-pulse" style={{ background: '#e2e8f0', height: '40px', borderRadius: '8px', width: '100%', marginBottom: '8px' }}></div>
    );
  }

  // default 'card'
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="skeleton-pulse" style={{ background: '#cbd5e1', height: '24px', borderRadius: '6px', width: '40%' }}></div>
      <div className="skeleton-pulse" style={{ background: '#e2e8f0', height: '16px', borderRadius: '4px', width: '100%' }}></div>
      <div className="skeleton-pulse" style={{ background: '#e2e8f0', height: '16px', borderRadius: '4px', width: '80%' }}></div>
      <div className="skeleton-pulse" style={{ background: '#e2e8f0', height: '60px', borderRadius: '12px', width: '100%' }}></div>
    </div>
  );
}
