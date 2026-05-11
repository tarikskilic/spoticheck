export default function WaveBars({ count = 5, color = '#1DB954', height = 32, active = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            background: color,
            borderRadius: 2,
            height: '100%',
            animation: active ? `wave-bar ${0.6 + i * 0.12}s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.1}s`,
            opacity: active ? 1 : 0.3,
            transform: active ? 'none' : 'scaleY(0.3)',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}
