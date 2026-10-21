import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  showSubtitle = true,
  className = '',
}: BrandLogoProps) {
  const sizeMap = {
    sm: { diameter: 40, textRosi: 'text-xs', textSub: 'text-[7px]' },
    md: { diameter: 52, textRosi: 'text-sm', textSub: 'text-[8px]' },
    lg: { diameter: 72, textRosi: 'text-lg', textSub: 'text-[10px]' },
    xl: { diameter: 104, textRosi: 'text-2xl', textSub: 'text-[12px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sello circular negro con borde dorado */}
      <div
        className="relative flex items-center justify-center rounded-full bg-[#171717] shadow-md border-2 border-[#C9A34E] shrink-0 transition-transform duration-300 hover:scale-105"
        style={{
          width: currentSize.diameter,
          height: currentSize.diameter,
        }}
        aria-label="Logotipo oficial de Rosi Studio"
      >
        {/* Anillo interior sutil */}
        <div className="absolute inset-1 rounded-full border border-[#C9A34E]/40 pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center px-1">
          <span
            className="font-heading font-bold tracking-widest text-[#C9A34E] leading-none"
            style={{ fontSize: size === 'sm' ? '11px' : size === 'md' ? '14px' : size === 'lg' ? '20px' : '28px' }}
          >
            ROSI
          </span>
          <span
            className="text-[#DFC27E] tracking-[0.25em] font-medium leading-tight"
            style={{ fontSize: size === 'sm' ? '6px' : size === 'md' ? '7px' : size === 'lg' ? '9px' : '12px' }}
          >
            STUDIO
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="flex flex-col">
          <span className="font-heading font-semibold text-lg text-[#171717] tracking-tight leading-snug">
            ROSI STUDIO
          </span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A34E]">
            Expertos en Belleza
          </span>
        </div>
      )}
    </div>
  );
}
