'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scissors, Calendar, Clock, User } from 'lucide-react';

function BottomNavContent() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Inicio',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/servicios',
      label: 'Servicios',
      icon: Scissors,
      isActive: pathname.startsWith('/servicios'),
    },
    {
      href: '/reservar',
      label: 'Reservar',
      icon: Calendar,
      isSpecial: true,
      isActive: pathname.startsWith('/reservar'),
    },
    {
      href: '/citas',
      label: 'Mis Citas',
      icon: Clock,
      isActive: pathname.startsWith('/citas'),
    },
    {
      href: '/perfil',
      label: 'Perfil',
      icon: User,
      isActive: pathname.startsWith('/perfil'),
    },
  ];

  return (
    <nav
      aria-label="Navegación principal de la aplicación"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E0D8] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:hidden transition-transform pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3.5 group focus:outline-none"
                aria-label="Reservar una cita"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 transform group-active:scale-95 ${
                    item.isActive
                      ? 'bg-[#171717] text-[#DFC27E] ring-2 ring-[#C9A34E]'
                      : 'bg-[#C9A34E] text-[#171717] hover:bg-[#A5802C]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    item.isActive ? 'text-[#C9A34E]' : 'text-[#171717]'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full py-1 transition-colors select-none group focus:outline-none ${
                item.isActive ? 'text-[#C9A34E]' : 'text-[#6B6863] hover:text-[#171717]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    item.isActive ? 'stroke-[2.5] text-[#C9A34E]' : 'stroke-[1.8]'
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C9A34E] rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  item.isActive ? 'font-bold text-[#171717]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={<div className="h-16 md:hidden" />}>
      <BottomNavContent />
    </Suspense>
  );
}
