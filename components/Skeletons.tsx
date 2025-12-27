'use client'

// =====================================================
// LOADING SKELETON COMPONENTS
// =====================================================

// Base Skeleton Component
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-700/50 rounded ${className}`}
    />
  )
}

// =====================================================
// PROP FIRM CARD SKELETON
// =====================================================

export function PropFirmCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="h-6 w-12 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900/50 rounded-lg p-3">
            <Skeleton className="h-3 w-10 mx-auto mb-2" />
            <Skeleton className="h-5 w-14 mx-auto" />
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-14 rounded" />
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}

// =====================================================
// PROP FIRM LIST SKELETON
// =====================================================

interface PropFirmListSkeletonProps {
  count?: number
}

export function PropFirmListSkeleton({ count = 6 }: PropFirmListSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropFirmCardSkeleton key={i} />
      ))}
    </div>
  )
}

// =====================================================
// TABLE ROW SKELETON
// =====================================================

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-700/50">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-4 px-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// =====================================================
// BLOG CARD SKELETON
// =====================================================

export function BlogCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

export function BlogListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}

// =====================================================
// DEAL CARD SKELETON
// =====================================================

export function DealCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex gap-1 mb-4">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-14 rounded" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  )
}

// =====================================================
// TEXT SKELETON
// =====================================================

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  )
}

// =====================================================
// STAT CARD SKELETON
// =====================================================

export function StatCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}

// =====================================================
// PAGE LOADING SKELETON
// =====================================================

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Content */}
        <PropFirmListSkeleton count={6} />
      </div>
    </div>
  )
}
