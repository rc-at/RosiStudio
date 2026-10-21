'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { Menu, X, Calendar, ShieldCheck } from 'lucide-react';

function NavbarContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/productos', label: 'Productos' },
    { href: '/reservar', label: 'Reservar Cita' },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#E5E0D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34E] rounded-lg">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#C9A34E] relative py-1 ${
                    active ? 'text-[#C9A34E] font-semibold' : 'text-[#171717]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A34E] rounded-full" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/admin"
              className="text-xs flex items-center gap-1.5 text-[#6B6863] hover:text-[#171717] px-2.5 py-1.5 rounded-md hover:bg-[#E9E1D4]/40 transition-colors"
              title="Acceso Administradora"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span>Admin</span>
            </Link>

            <Link
              href="/reservar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Ahora</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/reservar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A34E] text-[#171717] font-semibold text-xs shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#171717] hover:bg-[#E9E1D4]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A34E]"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E0D8] bg-[#F8F6F2] animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#E9E1D4]/60 text-[#171717] font-bold border-l-4 border-[#C9A34E]'
                    : 'text-[#171717] hover:bg-[#E9E1D4]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-[#E5E0D8]">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#6B6863] hover:text-[#171717] hover:bg-[#E9E1D4]/30"
              >
                <ShieldCheck className="w-4 h-4 text-[#C9A34E]" />
                <span>Panel de Administración</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 w-full bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#E5E0D8] h-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
            <BrandLogo size="md" />
          </div>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
