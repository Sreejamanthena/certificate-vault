'use client';

import * as React from 'react';
import { Upload, Tag, Link2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Certificates',
    description:
      'Drag and drop your PDF or image certificates. Supports all major formats including PDFs, JPEGs, and PNGs.',
    gradient: 'from-violet-500 to-purple-600',
    dotColor: 'bg-violet-500',
  },
  {
    step: '02',
    icon: Tag,
    title: 'Organize by Categories',
    description:
      'Tag and categorize your certificates by skill, domain, issuer, or organization for lightning-fast retrieval.',
    gradient: 'from-purple-500 to-indigo-600',
    dotColor: 'bg-purple-500',
  },
  {
    step: '03',
    icon: Link2,
    title: 'Generate Secure Share Links',
    description:
      'Create private shareable links for specific certificates. Set expiration dates and control access with a click.',
    gradient: 'from-indigo-500 to-blue-600',
    dotColor: 'bg-indigo-500',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-violet-50/50 dark:via-violet-950/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            No complicated setup. Start managing your certificates in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-px">
            <div className="w-full h-full bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 dark:from-violet-700 dark:via-purple-700 dark:to-indigo-700 opacity-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex flex-col items-center text-center gap-6">
                  {/* Step indicator */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl shadow-violet-500/25 transition-transform duration-300 hover:scale-110`}
                    >
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 max-w-xs">
                    <div className="text-xs font-bold tracking-widest text-muted-foreground">
                      STEP {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl blur opacity-30" />
            <div className="relative flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-10 py-8 rounded-2xl shadow-2xl shadow-violet-500/30">
              <div className="text-center sm:text-left">
                <p className="text-lg font-bold mb-1">Ready to secure your certificates?</p>
                <p className="text-violet-200 text-sm">Join thousands of professionals today.</p>
              </div>
              <a
                href="#"
                className="flex-shrink-0 bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-all duration-200 text-sm shadow-lg hover:-translate-y-0.5"
              >
                Start for Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
