'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import {
  signInWithGoogle,
  signOut,
  subscribeToAuth,
} from '@/lib/firebase/auth';
import { AdminUser } from '@/types';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';
import {
  LogOut,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsProcessing(true);
    try {
      const res = await signInWithGoogle();
      if (res.user) {
        setCurrentUser({
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          isAdmin: res.isAdmin,
        });
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <AppHeader />

      <main className="flex-1 px-4 sm:px-6 py-5 max-w-xl mx-auto w-full space-y-5">
        <h1 className="font-heading text-2xl font-bold text-[#171717] tracking-tight">
          Mi Perfil
        </h1>

        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E0D8] shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#171717] text-[#DFC27E] flex items-center justify-center border-2 border-[#C9A34E] shrink-0 font-heading text-xl font-bold">
              {currentUser?.displayName
                ? currentUser.displayName.charAt(0).toUpperCase()
                : 'U'}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg text-[#171717] truncate">
                {currentUser?.displayName || 'Cliente Invitado'}
              </h2>
              <p className="text-xs text-[#6B6863] truncate">
                {currentUser?.email || 'Navegando sin iniciar sesión'}
              </p>

              {currentUser ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {currentUser.isAdmin ? 'Administradora' : 'Sesión Activa'}
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Modo Invitado
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E0D8]">
            {currentUser ? (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleLogin}
                className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Acceder con Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="bg-white rounded-3xl border border-[#E5E0D8] shadow-sm divide-y divide-[#E5E0D8] overflow-hidden text-xs">
          <Link
            href="/citas"
            className="p-4 flex items-center justify-between hover:bg-[#F8F6F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E9E1D4]/60 text-[#171717] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#C9A34E]" />
              </div>
              <div>
                <span className="font-bold text-[#171717] block">Mis Citas</span>
                <span className="text-[11px] text-[#6B6863]">Revisar turnos y estados</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6863]" />
          </Link>

          <Link
            href="/reservar"
            className="p-4 flex items-center justify-between hover:bg-[#F8F6F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E9E1D4]/60 text-[#171717] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#C9A34E]" />
              </div>
              <div>
                <span className="font-bold text-[#171717] block">Reservar Cita</span>
                <span className="text-[11px] text-[#6B6863]">Elegir servicios y horario</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6863]" />
          </Link>

          <a
            href={`tel:${DEMO_BUSINESS_CONFIG.phone}`}
            className="p-4 flex items-center justify-between hover:bg-[#F8F6F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E9E1D4]/60 text-[#171717] flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#A5802C]" />
              </div>
              <div>
                <span className="font-bold text-[#171717] block">Contacto Telefónico</span>
                <span className="text-[11px] text-[#6B6863]">{DEMO_BUSINESS_CONFIG.phone}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6863]" />
          </a>

          <Link
            href="/admin"
            className="p-4 flex items-center justify-between hover:bg-[#F8F6F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#171717] text-[#DFC27E] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#171717] block">Panel de Administración</span>
                <span className="text-[11px] text-[#6B6863]">Gestión de citas y horarios</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6863]" />
          </Link>
        </div>

        {/* Business details snippet */}
        <div className="bg-[#F8F6F2] p-4 rounded-2xl border border-[#E5E0D8] text-center space-y-1 text-xs">
          <span className="font-heading font-bold text-[#171717] block">
            ROSI STUDIO • Expertos en Belleza
          </span>
          <p className="text-[11px] text-[#6B6863]">
            {DEMO_BUSINESS_CONFIG.address}
          </p>
          <span className="text-[10px] text-[#6B6863] block pt-1">
            Versión 1.0.0 (PWA Ready)
          </span>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
