'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { Calendar, User, ShieldCheck, MapPin } from 'lucide-react';

function AppHeaderContent() {
  const pathname = usePathname();

  const desktopNavLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/productos', label: 'Productos' },
    { href: '/citas', label: 'Mis Citas' },
    { href: '/perfil', label: 'Perfil' },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E5E0D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-18">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Ir al inicio de Rosi Studio"
          >
            <BrandLogo size="sm" showSubtitle={false} />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base md:text-lg text-[#171717] leading-none">
                ROSI STUDIO
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[0.18em] text-[#C9A34E]">
                Expertos en Belleza
              </span>
            </div>
          </Link>

          {/* Mobile Right: City chip & Profile icon button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E9E1D4]/60 text-[10px] text-[#171717] font-medium border border-[#E5E0D8]">
              <MapPin className="w-3 h-3 text-[#C9A34E]" />
              <span>Los Olivos, Lima</span>
            </div>

            <Link
              href="/perfil"
              className="w-8 h-8 rounded-full bg-white border border-[#E5E0D8] text-[#171717] flex items-center justify-center hover:bg-[#E9E1D4]/40 transition-colors shadow-sm"
              title="Mi Perfil"
              aria-label="Ir a mi perfil"
            >
              <User className="w-4 h-4 text-[#171717]" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {desktopNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider font-bold transition-colors py-1 relative ${
                    active ? 'text-[#C9A34E]' : 'text-[#171717] hover:text-[#C9A34E]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#C9A34E] rounded-full" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/admin"
              className="text-xs flex items-center gap-1.5 text-[#6B6863] hover:text-[#171717] px-2.5 py-1.5 rounded-lg border border-[#E5E0D8] hover:bg-[#E9E1D4]/40 transition-colors"
              title="Panel de Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span className="font-semibold">Admin</span>
            </Link>

            <Link
              href="/reservar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-xs shadow-sm hover:shadow transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Cita</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function AppHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-30 w-full bg-[#F8F6F2]/95 border-b border-[#E5E0D8] h-14 md:h-18 flex items-center px-4" />
      }
    >
      <AppHeaderContent />
    </Suspense>
  );
}
