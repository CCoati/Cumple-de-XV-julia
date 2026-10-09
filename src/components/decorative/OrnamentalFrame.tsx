'use client';

interface OrnamentalFrameProps {
  className?: string;
}

export default function OrnamentalFrame({ className = '' }: OrnamentalFrameProps) {
  return (
    <div className={`absolute inset-3 sm:inset-6 md:inset-8 lg:inset-10 pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 600 850"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Outer scalloped border: 600 x 850, corner radius 28, corner offset 28 */}
        <path
          d="
            M 48 20
            L 552 20
            A 28 28 0 0 1 580 48
            L 580 802
            A 28 28 0 0 1 552 830
            L 48 830
            A 28 28 0 0 1 20 802
            L 20 48
            A 28 28 0 0 1 48 20
            Z
          "
          stroke="#8B9D7D"
          strokeWidth="1.2"
          fill="none"
          opacity="0.85"
        />

        {/* Inner scalloped border with 8px inset */}
        <path
          d="
            M 54 28
            L 546 28
            A 26 26 0 0 1 572 54
            L 572 796
            A 26 26 0 0 1 546 822
            L 54 822
            A 26 26 0 0 1 28 796
            L 28 54
            A 26 26 0 0 1 54 28
            Z
          "
          stroke="#A3B18A"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
