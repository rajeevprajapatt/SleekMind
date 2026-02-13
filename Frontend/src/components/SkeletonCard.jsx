import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      
      {/* Navbar Skeleton */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        <div className="h-6 w-28 bg-slate-700 rounded animate-pulse" />

        <div className="hidden md:flex gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-16 bg-slate-700 rounded animate-pulse"
            />
          ))}
        </div>

        <div className="h-8 w-8 bg-slate-700 rounded-full animate-pulse" />
      </div>

      {/* Hero Content */}
      <div className="flex flex-col items-center text-center px-6 mt-16 space-y-6">

        {/* Title */}
        <div className="space-y-3 max-w-4xl w-full">
          <div className="h-10 md:h-14 w-full bg-slate-700 rounded animate-pulse" />
          <div className="h-10 md:h-14 w-3/4 mx-auto bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 max-w-3xl w-full">
          <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-5/6 mx-auto bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <div className="h-12 w-36 bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-12 w-40 bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Bottom Cards / Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12 mt-16">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-56 bg-slate-700 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;