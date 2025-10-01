"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { useSoundEffects } from "@/components/sound-effects"

interface Verb {
  verb: string
  type: "regular" | "irregular"
  past: string
  pastParticiple: string
}

interface VerbRouletteProps {
  verbs: Verb[]
  isSpinning: boolean
  selectedVerb: Verb | null
  onSpinClick?: () => void
}

export function VerbRoulette({ verbs, isSpinning, selectedVerb, onSpinClick }: VerbRouletteProps) {
  const [rotation, setRotation] = useState(0)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [spinSpeed, setSpinSpeed] = useState(1)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const rouletteRef = useRef<HTMLDivElement>(null)
  const { playHappySound, playSadSound } = useSoundEffects()

  useEffect(() => {
    if (isSpinning) {
      // Spinning sound effect (simulated with vibration if available)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200])
      }

      // Generate random rotation for visual effect
      const spins = 8 + Math.random() * 7 // 8-15 complete turns for more excitement
      const finalRotation = rotation + spins * 360 + Math.random() * 360
      setRotation(finalRotation)

      // Variable speed effect
      setSpinSpeed(3)
      setTimeout(() => setSpinSpeed(2), 1000)
      setTimeout(() => setSpinSpeed(1), 2000)
      setTimeout(() => setSpinSpeed(0.5), 3000)

      // Highlight effect during spinning with more dynamic patterns
      const interval = setInterval(() => {
        setHighlightedIndex(Math.floor(Math.random() * 20))
      }, 80)

      setTimeout(() => {
        clearInterval(interval)
        setHighlightedIndex(null)
        setSpinSpeed(1)
      }, 4000)
    }
  }, [isSpinning, rotation])

  // Confetti effect when a verb is selected
  useEffect(() => {
    if (selectedVerb && !isSpinning) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [selectedVerb, isSpinning])

  // Handle spin click
  const handleSpinClick = () => {
    if (isSpinning) return
    
    // Call the parent's spin function
    if (onSpinClick) {
      onSpinClick()
    }
  }

  // Handle pronunciation feedback
  const handlePronunciationFeedback = (isCorrect: boolean) => {
    setShowFeedback(isCorrect ? "correct" : "incorrect")
    
    // Play sound effect
    if (isCorrect) {
      // Happy sound
      playHappySound()
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    } else {
      // Sad sound
      playSadSound()
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    }
    
    // Auto-hide feedback after 3 seconds
    setTimeout(() => setShowFeedback(null), 3000)
  }

  // Show only a selection of verbs for visualization
  const displayVerbs = verbs.slice(0, 20)

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Enhanced bright background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-red-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Enhanced circular roulette */}
      <div className="relative w-[500px] h-[500px] mx-auto">
        <div
          ref={rouletteRef}
          className={cn(
            "w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4000ms] ease-out",
            isSpinning && "animate-spin",
            "shadow-2xl",
            "hover:scale-105 transition-transform duration-300",
            "border-8 border-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-orange-400"
          )}
          style={{
            transform: `rotate(${rotation}deg) scale(${isSpinning ? 1.05 : 1})`,
            background: `conic-gradient(${displayVerbs
              .map((verb, index) => {
                const startAngle = (index / displayVerbs.length) * 360
                const endAngle = ((index + 1) / displayVerbs.length) * 360
                const color = verb.type === "regular" 
                  ? "hsl(200, 100%, 70%)" // Azul cian vibrante
                  : "hsl(320, 100%, 70%)" // Rosa magenta vibrante
                return `${color} ${startAngle}deg ${endAngle}deg`
              })
              .join(", ")})`,
            filter: isSpinning ? "blur(1px) brightness(1.4) saturate(1.6)" : "brightness(1.3) saturate(1.4)",
            animation: isSpinning ? `spin ${spinSpeed}s linear infinite` : "none",
            boxShadow: isSpinning 
              ? "0 0 80px rgba(59, 130, 246, 0.8), 0 0 160px rgba(168, 85, 247, 0.6), 0 0 240px rgba(236, 72, 153, 0.4), 0 0 320px rgba(251, 146, 60, 0.3)"
              : "0 0 60px rgba(59, 130, 246, 0.6), 0 0 120px rgba(168, 85, 247, 0.4), 0 0 180px rgba(236, 72, 153, 0.3), 0 0 240px rgba(251, 146, 60, 0.2)"
          }}
        >
          {/* Verb segments */}
          {displayVerbs.map((verb, index) => {
            const angle = (index / displayVerbs.length) * 360
            const isHighlighted = highlightedIndex === index

            return (
              <div
                key={`${verb.verb}-${index}`}
                className={cn(
                  "absolute w-full h-full flex items-center justify-center text-white font-bold text-lg transition-all duration-200",
                  isHighlighted && "scale-125 z-10 drop-shadow-lg",
                  "hover:scale-110 transition-transform duration-200"
                )}
                style={{
                  transform: `rotate(${angle + 9}deg)`,
                  transformOrigin: "50% 50%",
                  textShadow: isHighlighted 
                    ? "0 0 25px rgba(255,255,255,1), 0 0 50px rgba(34,211,238,0.9), 0 0 75px rgba(168,85,247,0.7), 0 0 100px rgba(255,215,0,0.5)" 
                    : "0 5px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)",
                }}
              >
                <span
                  className={cn(
                    "absolute transition-all duration-200 font-extrabold",
                    isHighlighted && "animate-pulse text-yellow-300"
                  )}
                  style={{
                    transform: `translateY(-180px) rotate(${-angle - 9}deg)`,
                    fontSize: isHighlighted ? "1.4rem" : "1.1rem",
                    fontWeight: "900",
                    color: isHighlighted ? "#fde047" : "#ffffff"
                  }}
                >
                  {verb.verb.toUpperCase()}
                </span>
              </div>
            )
          })}
        </div>

        {/* Enhanced indicator/arrow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
          <div className="relative">
            <div className="w-0 h-0 border-l-12 border-r-12 border-b-24 border-l-transparent border-r-transparent border-b-gradient-to-b from-yellow-400 to-red-500 drop-shadow-2xl"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-b-20 border-l-transparent border-r-transparent border-b-white"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">🎯</div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xl animate-ping">✨</div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg animate-pulse">⭐</div>
          </div>
        </div>

        {/* Enhanced roulette center */}
        <button 
          onClick={handleSpinClick}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 via-pink-500 to-orange-500 rounded-full flex items-center justify-center z-10 border-6 border-white shadow-2xl hover:scale-110 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative">
            <span className="text-white font-bold text-2xl drop-shadow-lg">
              {isSpinning ? "🎪" : "SPIN"}
            </span>
            {isSpinning && (
              <>
                <div className="absolute inset-0 rounded-full border-3 border-blue-300 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute inset-0 rounded-full border-2 border-pink-300 animate-ping" style={{animationDelay: '1s'}}></div>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Enhanced confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-4 h-4 rounded-full animate-bounce",
                selectedVerb?.type === "regular" ? "bg-blue-400" : "bg-pink-400",
              )}
              style={{
                top: `${5 + Math.random() * 90}%`,
                left: `${5 + Math.random() * 90}%`,
                animationDelay: `${i * 30}ms`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                boxShadow: "0 0 10px rgba(255,255,255,0.8)"
              }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-3xl animate-ping"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 60}ms`,
                animationDuration: "1.5s",
              }}
            >
              ⭐
            </div>
          ))}
          {[...Array(15)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute text-2xl animate-bounce"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: "2s",
              }}
            >
              💫
            </div>
          ))}
        </div>
      )}

      {/* Wave effect when a verb is selected */}
      {selectedVerb && !isSpinning && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-[500px] h-[500px] rounded-full border-4 animate-ping",
                selectedVerb.type === "regular" ? "border-blue-400/40" : "border-pink-400/40",
              )}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animationDelay: `${i * 400}ms`,
                animationDuration: "2.5s",
              }}
            />
          ))}
        </div>
      )}

      {/* Feedback faces after pronunciation */}
      {selectedVerb && !isSpinning && !showFeedback && (
        <div className="absolute inset-0 pointer-events-auto flex items-center justify-center z-50">
          <div className="p-8 rounded-2xl text-center font-bold text-lg bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-4 border-blue-300 shadow-2xl">
            <div className="space-y-4">
              <div className="text-2xl mb-4">How did you pronounce it?</div>
              <div className="text-3xl font-bold text-blue-600 mb-6">
                "{selectedVerb.verb}"
              </div>
              
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handlePronunciationFeedback(true)}
                  className="p-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  <div className="text-6xl">😊</div>
                  <div className="text-sm font-bold mt-2">Good!</div>
                </button>
                
                <button
                  onClick={() => handlePronunciationFeedback(false)}
                  className="p-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  <div className="text-6xl">😢</div>
                  <div className="text-sm font-bold mt-2">Bad</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback result display */}
      {showFeedback && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className={cn(
            "p-6 rounded-2xl text-center font-bold text-lg transition-all duration-500 transform scale-110",
            showFeedback === "correct" 
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-4 border-green-300 shadow-2xl" 
              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-4 border-red-300 shadow-2xl"
          )}>
            {showFeedback === "correct" ? (
              <div className="space-y-3">
                {/* Caritas felices con animaciones */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-6xl animate-bounce" style={{animationDelay: '0s'}}>😊</div>
                  <div className="text-8xl animate-bounce" style={{animationDelay: '0.2s'}}>😄</div>
                  <div className="text-6xl animate-bounce" style={{animationDelay: '0.4s'}}>😊</div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">Excellent! 🎉</span>
                  <span className="text-xl text-green-600">Great pronunciation! 🌟</span>
                </div>
                
                {/* Caritas adicionales */}
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl animate-spin" style={{animationDuration: '2s'}}>🎉</div>
                  <div className="text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>⭐</div>
                  <div className="text-4xl animate-spin" style={{animationDuration: '2s', animationDelay: '1s'}}>🎉</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Caritas tristes con animaciones */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-6xl animate-pulse" style={{animationDelay: '0s'}}>😢</div>
                  <div className="text-8xl animate-pulse" style={{animationDelay: '0.2s'}}>😞</div>
                  <div className="text-6xl animate-pulse" style={{animationDelay: '0.4s'}}>😢</div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">Try again</span>
                  <span className="text-xl text-red-600">Keep practicing! 💪</span>
                </div>
                
                {/* Caritas de ánimo */}
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl animate-bounce" style={{animationDelay: '0.3s'}}>💪</div>
                  <div className="text-4xl animate-bounce" style={{animationDelay: '0.6s'}}>🔥</div>
                  <div className="text-4xl animate-bounce" style={{animationDelay: '0.9s'}}>💪</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
