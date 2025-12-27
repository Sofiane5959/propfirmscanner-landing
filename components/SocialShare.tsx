'use client'

import { useState } from 'react'
import { 
  Share2, Twitter, Linkedin, Facebook, Link2, 
  Check, Mail
} from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  compact?: boolean
}

export default function SocialShare({ url, title, description, compact = false }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Share:</span>
        <button
          onClick={() => openShareWindow(shareLinks.twitter)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={() => openShareWindow(shareLinks.linkedin)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </button>
        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-semibold">Share this article</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => openShareWindow(shareLinks.twitter)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 rounded-lg transition-colors"
        >
          <Twitter className="w-4 h-4" />
          <span>Twitter</span>
        </button>

        <button
          onClick={() => openShareWindow(shareLinks.linkedin)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 rounded-lg transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </button>

        <button
          onClick={() => openShareWindow(shareLinks.facebook)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 rounded-lg transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </button>

        <a
          href={shareLinks.email}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </a>

        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            copied 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Floating Share Bar (for articles)
export function FloatingShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 bg-gray-800 border border-gray-700 rounded-xl p-2">
      <button
        onClick={() => openShareWindow(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}
        className="p-2 text-gray-400 hover:text-[#1DA1F2] hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </button>
      <button
        onClick={() => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
        className="p-2 text-gray-400 hover:text-[#0A66C2] hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </button>
      <button
        onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
        className="p-2 text-gray-400 hover:text-[#1877F2] hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
      </button>
      <div className="border-t border-gray-700 my-1" />
      <button
        onClick={copyToClipboard}
        className={`p-2 rounded-lg transition-colors ${
          copied ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
      </button>
    </div>
  )
}
