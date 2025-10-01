"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Twitter, Facebook, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialShareProps {
  stats: {
    regular: number
    irregular: number
    total: number
    streak: number
    bestStreak: number
    averageTime: number
    perfectRounds: number
  }
  selectedVerb?: any
}

export function SocialShare({ stats, selectedVerb }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const generateShareText = () => {
    const verbText = selectedVerb ? ` I just practiced the verb "${selectedVerb.verb}"` : ""
    const streakText = stats.bestStreak > 0 ? ` My best streak is ${stats.bestStreak} verbs.` : ""
    const timeText = stats.averageTime > 0 ? ` Average time: ${(stats.averageTime / 1000).toFixed(1)}s.` : ""
    
    return `🎯 I'm learning English verbs with Verb Roulette!${verbText}${streakText}${timeText} Join me in this learning adventure! #VerbRoulette #LearnEnglish #Verbs`
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying:', err)
    }
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(generateShareText())
    const url = encodeURIComponent(shareUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText())
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (!isOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setIsOpen(true)} 
            variant="outline" 
            className="w-full"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share my progress
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Progress
          </div>
          <Button 
            onClick={() => setIsOpen(false)} 
            variant="ghost" 
            size="sm"
          >
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message preview */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <p className="text-sm">{generateShareText()}</p>
        </div>

        {/* Highlighted statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Verbs</div>
          </div>
          <div className="text-center p-2 bg-yellow-100 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{stats.bestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleTwitterShare}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            <Twitter className="h-4 w-4 mr-2" />
            Share on Twitter
          </Button>
          
          <Button 
            onClick={handleFacebookShare}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Facebook className="h-4 w-4 mr-2" />
            Share on Facebook
          </Button>
          
          <Button 
            onClick={handleWhatsAppShare}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share on WhatsApp
          </Button>
          
          <Button 
            onClick={handleCopy}
            variant="outline"
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy text
              </>
            )}
          </Button>
        </div>

        {/* Motivational message */}
        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            Share your progress and motivate others to learn English! 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
