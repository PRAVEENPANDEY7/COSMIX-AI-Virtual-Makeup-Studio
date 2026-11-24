'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TryOnStudio } from '@/components/studio/TryOnStudio';

export default function TryOnPage() {
  return (
    <div className="min-h-screen bg-[#FDF4F1] text-[#32171F] flex flex-col font-sans selection:bg-[#F4DDD5] selection:text-[#32171F]">
      {/* 1. Existing Header — Strictly Preserved and Untouched */}
      <Header />

      {/* 2. Main Try-On Page Content (Directly Below Existing Header) */}
      <main className="flex-1 pt-20 sm:pt-32 pb-12 sm:pb-16 w-full flex flex-col justify-center">
        <TryOnStudio />
      </main>

      {/* 3. Existing Footer */}
      <Footer />
    </div>
  );
}
