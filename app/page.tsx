"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, BookOpen, Volume2 } from "lucide-react"
import { VerbRoulette } from "@/components/verb-roulette"
import { VerbCard } from "@/components/verb-card"
import { StatsPanel } from "@/components/stats-panel"
import { AchievementSystem } from "@/components/achievement-system"
import { ChallengeModes } from "@/components/challenge-modes"
import { useSoundEffects } from "@/components/sound-effects"
import { SocialShare } from "@/components/social-share"
import { DifficultySelector } from "@/components/difficulty-selector"
import { WordDisplay } from "@/components/word-display"
import { cn } from "@/lib/utils"

// 100 verbs distributed alphabetically (50 regular, 50 irregular)
const VERBS: Array<{ verb: string; type: "regular" | "irregular"; past: string; pastParticiple: string }> = [
  // A-E
  { verb: "accept", type: "regular", past: "accepted", pastParticiple: "accepted" },
  { verb: "achieve", type: "regular", past: "achieved", pastParticiple: "achieved" },
  { verb: "add", type: "regular", past: "added", pastParticiple: "added" },
  { verb: "agree", type: "regular", past: "agreed", pastParticiple: "agreed" },
  { verb: "allow", type: "regular", past: "allowed", pastParticiple: "allowed" },
  { verb: "appear", type: "regular", past: "appeared", pastParticiple: "appeared" },
  { verb: "arrive", type: "regular", past: "arrived", pastParticiple: "arrived" },
  { verb: "ask", type: "regular", past: "asked", pastParticiple: "asked" },
  { verb: "believe", type: "regular", past: "believed", pastParticiple: "believed" },
  { verb: "belong", type: "regular", past: "belonged", pastParticiple: "belonged" },
  { verb: "call", type: "regular", past: "called", pastParticiple: "called" },
  { verb: "carry", type: "regular", past: "carried", pastParticiple: "carried" },
  { verb: "change", type: "regular", past: "changed", pastParticiple: "changed" },
  { verb: "clean", type: "regular", past: "cleaned", pastParticiple: "cleaned" },
  { verb: "close", type: "regular", past: "closed", pastParticiple: "closed" },
  { verb: "cook", type: "regular", past: "cooked", pastParticiple: "cooked" },
  { verb: "create", type: "regular", past: "created", pastParticiple: "created" },
  { verb: "dance", type: "regular", past: "danced", pastParticiple: "danced" },
  { verb: "decide", type: "regular", past: "decided", pastParticiple: "decided" },
  { verb: "deliver", type: "regular", past: "delivered", pastParticiple: "delivered" },
  { verb: "develop", type: "regular", past: "developed", pastParticiple: "developed" },
  { verb: "discover", type: "regular", past: "discovered", pastParticiple: "discovered" },
  { verb: "enjoy", type: "regular", past: "enjoyed", pastParticiple: "enjoyed" },
  { verb: "enter", type: "regular", past: "entered", pastParticiple: "entered" },
  { verb: "explain", type: "regular", past: "explained", pastParticiple: "explained" },

  // F-M
  { verb: "finish", type: "regular", past: "finished", pastParticiple: "finished" },
  { verb: "follow", type: "regular", past: "followed", pastParticiple: "followed" },
  { verb: "happen", type: "regular", past: "happened", pastParticiple: "happened" },
  { verb: "help", type: "regular", past: "helped", pastParticiple: "helped" },
  { verb: "include", type: "regular", past: "included", pastParticiple: "included" },
  { verb: "increase", type: "regular", past: "increased", pastParticiple: "increased" },
  { verb: "join", type: "regular", past: "joined", pastParticiple: "joined" },
  { verb: "jump", type: "regular", past: "jumped", pastParticiple: "jumped" },
  { verb: "kill", type: "regular", past: "killed", pastParticiple: "killed" },
  { verb: "laugh", type: "regular", past: "laughed", pastParticiple: "laughed" },
  { verb: "learn", type: "regular", past: "learned", pastParticiple: "learned" },
  { verb: "listen", type: "regular", past: "listened", pastParticiple: "listened" },
  { verb: "live", type: "regular", past: "lived", pastParticiple: "lived" },
  { verb: "look", type: "regular", past: "looked", pastParticiple: "looked" },
  { verb: "love", type: "regular", past: "loved", pastParticiple: "loved" },
  { verb: "manage", type: "regular", past: "managed", pastParticiple: "managed" },
  { verb: "move", type: "regular", past: "moved", pastParticiple: "moved" },

  // N-S
  { verb: "need", type: "regular", past: "needed", pastParticiple: "needed" },
  { verb: "open", type: "regular", past: "opened", pastParticiple: "opened" },
  { verb: "play", type: "regular", past: "played", pastParticiple: "played" },
  { verb: "receive", type: "regular", past: "received", pastParticiple: "received" },
  { verb: "remember", type: "regular", past: "remembered", pastParticiple: "remembered" },
  { verb: "return", type: "regular", past: "returned", pastParticiple: "returned" },
  { verb: "save", type: "regular", past: "saved", pastParticiple: "saved" },
  { verb: "serve", type: "regular", past: "served", pastParticiple: "served" },
  { verb: "show", type: "regular", past: "showed", pastParticiple: "showed" },
  { verb: "start", type: "regular", past: "started", pastParticiple: "started" },
  { verb: "stop", type: "regular", past: "stopped", pastParticiple: "stopped" },
  { verb: "study", type: "regular", past: "studied", pastParticiple: "studied" },

  // T-Z
  { verb: "talk", type: "regular", past: "talked", pastParticiple: "talked" },
  { verb: "travel", type: "regular", past: "traveled", pastParticiple: "traveled" },
  { verb: "try", type: "regular", past: "tried", pastParticiple: "tried" },
  { verb: "turn", type: "regular", past: "turned", pastParticiple: "turned" },
  { verb: "use", type: "regular", past: "used", pastParticiple: "used" },
  { verb: "visit", type: "regular", past: "visited", pastParticiple: "visited" },
  { verb: "wait", type: "regular", past: "waited", pastParticiple: "waited" },
  { verb: "walk", type: "regular", past: "walked", pastParticiple: "walked" },
  { verb: "want", type: "regular", past: "wanted", pastParticiple: "wanted" },
  { verb: "watch", type: "regular", past: "watched", pastParticiple: "watched" },
  { verb: "work", type: "regular", past: "worked", pastParticiple: "worked" },

  // IRREGULAR VERBS (50)
  { verb: "be", type: "irregular", past: "was/were", pastParticiple: "been" },
  { verb: "become", type: "irregular", past: "became", pastParticiple: "become" },
  { verb: "begin", type: "irregular", past: "began", pastParticiple: "begun" },
  { verb: "break", type: "irregular", past: "broke", pastParticiple: "broken" },
  { verb: "bring", type: "irregular", past: "brought", pastParticiple: "brought" },
  { verb: "build", type: "irregular", past: "built", pastParticiple: "built" },
  { verb: "buy", type: "irregular", past: "bought", pastParticiple: "bought" },
  { verb: "catch", type: "irregular", past: "caught", pastParticiple: "caught" },
  { verb: "choose", type: "irregular", past: "chose", pastParticiple: "chosen" },
  { verb: "come", type: "irregular", past: "came", pastParticiple: "come" },
  { verb: "cut", type: "irregular", past: "cut", pastParticiple: "cut" },
  { verb: "do", type: "irregular", past: "did", pastParticiple: "done" },
  { verb: "draw", type: "irregular", past: "drew", pastParticiple: "drawn" },
  { verb: "drink", type: "irregular", past: "drank", pastParticiple: "drunk" },
  { verb: "drive", type: "irregular", past: "drove", pastParticiple: "driven" },
  { verb: "eat", type: "irregular", past: "ate", pastParticiple: "eaten" },
  { verb: "fall", type: "irregular", past: "fell", pastParticiple: "fallen" },
  { verb: "feel", type: "irregular", past: "felt", pastParticiple: "felt" },
  { verb: "find", type: "irregular", past: "found", pastParticiple: "found" },
  { verb: "fly", type: "irregular", past: "flew", pastParticiple: "flown" },
  { verb: "forget", type: "irregular", past: "forgot", pastParticiple: "forgotten" },
  { verb: "get", type: "irregular", past: "got", pastParticiple: "gotten" },
  { verb: "give", type: "irregular", past: "gave", pastParticiple: "given" },
  { verb: "go", type: "irregular", past: "went", pastParticiple: "gone" },
  { verb: "grow", type: "irregular", past: "grew", pastParticiple: "grown" },
  { verb: "have", type: "irregular", past: "had", pastParticiple: "had" },
  { verb: "hear", type: "irregular", past: "heard", pastParticiple: "heard" },
  { verb: "hide", type: "irregular", past: "hid", pastParticiple: "hidden" },
  { verb: "hold", type: "irregular", past: "held", pastParticiple: "held" },
  { verb: "keep", type: "irregular", past: "kept", pastParticiple: "kept" },
  { verb: "know", type: "irregular", past: "knew", pastParticiple: "known" },
  { verb: "leave", type: "irregular", past: "left", pastParticiple: "left" },
  { verb: "lose", type: "irregular", past: "lost", pastParticiple: "lost" },
  { verb: "make", type: "irregular", past: "made", pastParticiple: "made" },
  { verb: "meet", type: "irregular", past: "met", pastParticiple: "met" },
  { verb: "pay", type: "irregular", past: "paid", pastParticiple: "paid" },
  { verb: "put", type: "irregular", past: "put", pastParticiple: "put" },
  { verb: "read", type: "irregular", past: "read", pastParticiple: "read" },
  { verb: "ride", type: "irregular", past: "rode", pastParticiple: "ridden" },
  { verb: "ring", type: "irregular", past: "rang", pastParticiple: "rung" },
  { verb: "run", type: "irregular", past: "ran", pastParticiple: "run" },
  { verb: "say", type: "irregular", past: "said", pastParticiple: "said" },
  { verb: "see", type: "irregular", past: "saw", pastParticiple: "seen" },
  { verb: "sell", type: "irregular", past: "sold", pastParticiple: "sold" },
  { verb: "send", type: "irregular", past: "sent", pastParticiple: "sent" },
  { verb: "sing", type: "irregular", past: "sang", pastParticiple: "sung" },
  { verb: "sit", type: "irregular", past: "sat", pastParticiple: "sat" },
  { verb: "sleep", type: "irregular", past: "slept", pastParticiple: "slept" },
  { verb: "speak", type: "irregular", past: "spoke", pastParticiple: "spoken" },
  { verb: "spend", type: "irregular", past: "spent", pastParticiple: "spent" },
  { verb: "stand", type: "irregular", past: "stood", pastParticiple: "stood" },
  { verb: "swim", type: "irregular", past: "swam", pastParticiple: "swum" },
  { verb: "take", type: "irregular", past: "took", pastParticiple: "taken" },
  { verb: "teach", type: "irregular", past: "taught", pastParticiple: "taught" },
  { verb: "tell", type: "irregular", past: "told", pastParticiple: "told" },
  { verb: "think", type: "irregular", past: "thought", pastParticiple: "thought" },
  { verb: "throw", type: "irregular", past: "threw", pastParticiple: "thrown" },
  { verb: "understand", type: "irregular", past: "understood", pastParticiple: "understood" },
  { verb: "wake", type: "irregular", past: "woke", pastParticiple: "woken" },
  { verb: "wear", type: "irregular", past: "wore", pastParticiple: "worn" },
  { verb: "win", type: "irregular", past: "won", pastParticiple: "won" },
  { verb: "write", type: "irregular", past: "wrote", pastParticiple: "written" },
]

export default function VerbRoulettePage() {
  const [selectedVerb, setSelectedVerb] = useState<(typeof VERBS)[0] | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [stats, setStats] = useState({ 
    regular: 0, 
    irregular: 0, 
    total: 0, 
    streak: 0, 
    bestStreak: 0, 
    averageTime: 0, 
    perfectRounds: 0 
  })
  const [challengeMode, setChallengeMode] = useState<any>(null)
  const [isChallengeActive, setIsChallengeActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [challengeVerbsCompleted, setChallengeVerbsCompleted] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [lastSpinTime, setLastSpinTime] = useState<number | null>(null)
  const [achievementUnlocked, setAchievementUnlocked] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { playSpinSound, playSuccessSound, playAchievementSound, playHappySound, playSadSound } = useSoundEffects()

  const spinRoulette = () => {
    console.log('🎯 Spin button clicked!', { isSpinning, selectedVerb })
    
    if (isSpinning) {
      console.log('⚠️ Already spinning, ignoring click')
      return
    }

    console.log('🚀 Starting spin...')
    
    // Clear selected verb first
    setSelectedVerb(null)
    
    // Activate spinning state
    setIsSpinning(true)
    
    const startTime = Date.now()
    setLastSpinTime(startTime)
    
    // Play spinning sound
    try {
      playSpinSound()
    } catch (error) {
      console.log('🔊 Sound error:', error)
    }

    // Simulate roulette spin with random duration
    const spinDuration = 3000 + Math.random() * 2000 // 3-5 seconds
    console.log('⏱️ Spin duration:', spinDuration, 'ms')

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * VERBS.length)
      const verb = VERBS[randomIndex]
      console.log('🎲 Selected verb:', verb)
      
      // Stop spinning and show result
      setIsSpinning(false)
      setSelectedVerb(verb)
      
      // Play success sound
      try {
        playSuccessSound()
      } catch (error) {
        console.log('🔊 Success sound error:', error)
      }

      const endTime = Date.now()
      const spinTime = endTime - startTime

      // Update statistics
      setStats((prev) => {
        const newStats = {
          regular: prev.regular + (verb.type === "regular" ? 1 : 0),
          irregular: prev.irregular + (verb.type === "irregular" ? 1 : 0),
          total: prev.total + 1,
          streak: prev.streak + 1,
          bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
          averageTime: prev.total > 0 ? (prev.averageTime * prev.total + spinTime) / (prev.total + 1) : spinTime,
          perfectRounds: prev.perfectRounds
        }
        console.log('📊 Updated stats:', newStats)
        return newStats
      })

      // Update challenge counter if active
      if (isChallengeActive) {
        setChallengeVerbsCompleted(prev => prev + 1)
      }

      // Update current streak
      setCurrentStreak(prev => prev + 1)
      
      console.log('✅ Spin completed successfully!')
    }, spinDuration)
  }

  const resetStats = () => {
    setStats({ 
      regular: 0, 
      irregular: 0, 
      total: 0, 
      streak: 0, 
      bestStreak: 0, 
      averageTime: 0, 
      perfectRounds: 0 
    })
    setSelectedVerb(null)
    setCurrentStreak(0)
  }

  const startChallenge = (mode: any) => {
    setChallengeMode(mode)
    setIsChallengeActive(true)
    setTimeRemaining(mode.duration)
    setChallengeVerbsCompleted(0)
    
    // Start timer
    challengeTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsChallengeActive(false)
          if (challengeTimerRef.current) {
            clearInterval(challengeTimerRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const completeChallenge = () => {
    setIsChallengeActive(false)
    setChallengeMode(null)
    if (challengeTimerRef.current) {
      clearInterval(challengeTimerRef.current)
    }
  }

  const handleAchievementUnlocked = (achievement: any) => {
    // Sound effect for unlocked achievement
    playAchievementSound()
    
    // Vibration if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
    
    // Show achievement notification
    setAchievementUnlocked(true)
    setTimeout(() => setAchievementUnlocked(false), 1000)
  }

  const handleDifficultyChange = (difficulty: any) => {
    setCurrentDifficulty(difficulty)
    // Here you could implement additional logic based on difficulty
    // For example, filter verbs, change tenses, etc.
  }

  const playPronunciation = (verb: string) => {
    console.log('🔊 Playing pronunciation for:', verb)
    
    // Use Web Speech API for pronunciation
    if ("speechSynthesis" in window) {
      try {
        // Stop any previous pronunciation
        speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(verb)
        utterance.lang = "en-US"
        utterance.rate = 0.8
        utterance.volume = 1.0
        utterance.pitch = 1.0
        
        // Events for debugging
        utterance.onstart = () => console.log('🔊 Speech started')
        utterance.onend = () => console.log('🔊 Speech ended')
        utterance.onerror = (event) => console.log('🔊 Speech error:', event.error)
        
        speechSynthesis.speak(utterance)
        console.log('🔊 Speech synthesis initiated')
      } catch (error) {
        console.error('🔊 Error with speech synthesis:', error)
        alert('Error playing pronunciation. Make sure your browser supports text-to-speech.')
      }
    } else {
      console.log('🔊 Speech synthesis not supported')
      alert('Your browser does not support text-to-speech. Try Chrome, Firefox or Safari.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 text-balance animate-in fade-in-50 slide-in-from-top-4">
              🎯 Verb Roulette
            </h1>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">🚀</div>
            <div className="absolute -top-1 -left-1 text-lg animate-ping">⭐</div>
            <div className="absolute -bottom-2 -right-1 text-lg animate-bounce">🎪</div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-pretty mb-6">
            Learn 100 English verbs in a fun way! Spin the roulette, complete challenges and unlock achievements.
          </p>
          
          {/* Quick progress indicators */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
              <div className="text-xs text-gray-400">Verbs Practiced</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">{stats.bestStreak}</div>
              <div className="text-xs text-gray-400">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {stats.total > 0 ? Math.round((stats.total / 100) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-400">Total Progress</div>
            </div>
          </div>

          {/* General progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>0</span>
              <span>100 verbs</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${Math.min((stats.total / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Centered Roulette */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-200 mb-4">🎯 Verb Roulette</h2>
            <p className="text-gray-400 mb-6">Click "Spin" to select a verb</p>
          </div>

          {/* Roulette */}
          <div className="mb-8">
            <VerbRoulette 
              verbs={VERBS} 
              isSpinning={isSpinning} 
              selectedVerb={selectedVerb} 
              onSpinClick={spinRoulette}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => {
                console.log('🔥 Button clicked directly!')
                spinRoulette()
              }} 
              disabled={isSpinning} 
              size="lg" 
              className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {isSpinning ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Spinning...
                </div>
              ) : (
                "🎪 Spin Roulette"
              )}
            </Button>

            <Button 
              onClick={resetStats} 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Streak indicator */}
          {currentStreak > 0 && (
            <div className="text-center p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg mb-8">
              <div className="text-3xl font-bold text-yellow-400">🔥 {currentStreak}</div>
              <div className="text-sm text-yellow-300">Current streak</div>
            </div>
          )}
        </div>

        {/* Big Word when it appears */}
        {selectedVerb && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 animate-in fade-in-50 slide-in-from-bottom-4 drop-shadow-2xl">
                {selectedVerb.verb.toUpperCase()}
              </div>
              
              <Badge 
                variant={selectedVerb.type === "regular" ? "secondary" : "default"}
                className={cn(
                  "text-2xl px-6 py-3 mb-6",
                  selectedVerb.type === "regular" ? "bg-cyan-500 text-white" : "bg-purple-500 text-white"
                )}
              >
                {selectedVerb.type === "regular" ? "Regular" : "Irregular"}
              </Badge>

              {/* Pronunciation feedback section */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-300 shadow-2xl">
                <div className="text-2xl font-bold text-blue-800 mb-4">How did you pronounce it?</div>
                <div className="text-3xl font-bold text-blue-600 mb-6">
                  "{selectedVerb.verb}"
                </div>
                
                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={() => {
                      // Happy feedback
                      playHappySound()
                      if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100])
                      }
                      setSelectedVerb(null)
                    }}
                    className="p-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <div className="text-8xl">😊</div>
                    <div className="text-lg font-bold mt-3">Good!</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Sad feedback
                      playSadSound()
                      if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200])
                      }
                      setSelectedVerb(null)
                    }}
                    className="p-6 rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <div className="text-8xl">😢</div>
                    <div className="text-lg font-bold mt-3">Bad</div>
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => playPronunciation(selectedVerb.verb)}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 text-lg"
                >
                  <Volume2 className="h-5 w-5" />
                  Listen
                </Button>
                
                <Button 
                  onClick={() => setSelectedVerb(null)}
                  size="lg"
                  className="text-lg"
                >
                  ✕ Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
