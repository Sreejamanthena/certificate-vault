'use client';

import * as React from 'react';
import { CloudUpload, FolderSearch, Share2 } from 'lucide-react';

const features = [
  {
    icon: CloudUpload,
    title: 'Secure Storage',
    description:
      'Safely upload and manage certificates with enterprise-grade cloud-based storage. Your data is encrypted at rest and in transit.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: FolderSearch,
    title: 'Smart Organization',
    description:
      'Categorize certificates based on skills, domain, or organization. Find any certificate instantly with powerful search and filters.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Share2,
    title: 'Selective Sharing',
    description:
      'Share only selected certificates using secure private links. Set expiration dates and revoke access at any time.',
    gradient: 'from-violet-500 to-purple-600',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-violet-100/60 to-purple-100/60 dark:from-violet-950/30 dark:to-purple-950/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 mb-4">
            FEATURES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              CertVault?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to manage your professional credentials with confidence and ease.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col gap-5 p-8 rounded-2xl border bg-white/70 dark:bg-white/5 border-violet-100 dark:border-violet-900/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20 cursor-default"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-tr-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-3xl`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500K+', label: 'Certs Stored' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '256-bit', label: 'Encryption' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 py-6 px-4 rounded-2xl bg-background border border-border"
            >
              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
