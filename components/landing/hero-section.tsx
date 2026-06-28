'use client';

import * as React from 'react';
import { ArrowRight, Play, Shield, Lock, CloudUpload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 w-fit">
              <Shield className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide">
                Trusted by 10,000+ professionals
              </span>
            </div>

            {/* Heading */}
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                Securely Store{' '}
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  & Share
                </span>{' '}
                Your Certificates
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Organize academic, professional, and skill certificates in one secure digital vault.
                To safely store your achievements and control how they are shared.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white border-0 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 px-8 py-6 text-base font-semibold rounded-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-border hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all duration-300 px-8 py-6 text-base font-semibold rounded-xl"
                >
                  <Play className="mr-2 w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform duration-200" />
                  Learn More
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CloudUpload className="w-4 h-4 text-violet-500" />
                Secure cloud storage
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-violet-500" />
                Enterprise-grade security
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4 text-violet-500" />
                End-to-end encrypted
              </div>
            </div>
          </div>

          {/* Right column — illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Main card */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-violet-100 dark:border-violet-900/50">
                <img
                  src="https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Digital certificate management dashboard"
                  className="w-full h-72 sm:h-80 lg:h-96 object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 via-transparent to-transparent" />
              </div>

              {/* Floating card 1 */}
              <div className="absolute -top-6 -left-6 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/50 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-violet-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Secure Storage</p>
                    <p className="text-[11px] text-muted-foreground">Encrypted files</p>
                  </div>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="absolute -bottom-6 -right-6 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/50 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-violet-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">247 Certs</p>
                    <p className="text-[11px] text-muted-foreground">Safely stored</p>
                  </div>
                </div>
              </div>

              {/* Floating card 3 - Encryption */}
              <div className="absolute top-1/2 -right-8 z-20 hidden lg:flex backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/50 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-violet-500/15 -translate-y-1/2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">256-bit</p>
                    <p className="text-[11px] text-muted-foreground">Encryption</p>
                  </div>
                </div>
              </div>

              {/* Background glow */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-400/20 to-purple-400/20 dark:from-violet-600/20 dark:to-purple-600/20 rounded-3xl blur-2xl scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
