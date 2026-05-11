export default function VinylDisc({ size = 140, spinning = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      style={{ animation: spinning ? 'spin-slow 8s linear infinite' : 'none' }}
    >
      <defs>
        <radialGradient id="vinyl-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#2a2a2e" />
          <stop offset="30%"  stopColor="#111" />
          <stop offset="60%"  stopColor="#1a1a1e" />
          <stop offset="100%" stopColor="#0d0d0f" />
        </radialGradient>
        <radialGradient id="label-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#1DB954" />
          <stop offset="100%" stopColor="#148f3f" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="70" fill="url(#vinyl-grad)" />
      {[60, 52, 44, 36, 28, 20].map((r) => (
        <circle key={r} cx="70" cy="70" r={r}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
      ))}
      <circle cx="70" cy="70" r="18" fill="url(#label-grad)" />
      <circle cx="70" cy="70" r="5"  fill="#0a0a0b" />
      <text x="70" y="67" textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="5"
        fontFamily="DM Sans,sans-serif" fontWeight="600">SPOTI</text>
      <text x="70" y="74" textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="5"
        fontFamily="DM Sans,sans-serif" fontWeight="600">CHECK</text>
    </svg>
  );
}
