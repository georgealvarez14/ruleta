"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timer, Zap, Target, Crown, Clock, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChallengeMode {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  duration: number // en segundos
  target: number // número de verbos objetivo
  difficulty: "easy" | "medium" | "hard" | "expert"
  color: string
}

interface ChallengeModesProps {
  onStartChallenge: (mode: ChallengeMode) => void
  isActive: boolean
  currentMode: ChallengeMode | null
  timeRemaining: number
  verbsCompleted: number
  onCompleteChallenge: () => void
}

const CHALLENGE_MODES: ChallengeMode[] = [
  {
    id: "speed-round",
    name: "Quick Round",
    description: "Complete 10 verbs in 60 seconds",
    icon: <Zap className="h-5 w-5" />,
    duration: 60,
    target: 10,
    difficulty: "easy",
    color: "bg-blue-500"
  },
  {
    id: "marathon",
    name: "Marathon",
    description: "Complete 25 verbs in 3 minutes",
    icon: <Target className="h-5 w-5" />,
    duration: 180,
    target: 25,
    difficulty: "medium",
    color: "bg-green-500"
  },
  {
    id: "lightning",
    name: "Lightning Speed",
    description: "Complete 15 verbs in 45 seconds",
    icon: <Zap className="h-5 w-5" />,
    duration: 45,
    target: 15,
    difficulty: "hard",
    color: "bg-yellow-500"
  },
  {
    id: "master-challenge",
    name: "Master Challenge",
    description: "Complete 50 verbs in 5 minutes",
    icon: <Crown className="h-5 w-5" />,
    duration: 300,
    target: 50,
    difficulty: "expert",
    color: "bg-purple-500"
  }
]

export function ChallengeModes({ 
  onStartChallenge, 
  isActive, 
  currentMode, 
  timeRemaining, 
  verbsCompleted, 
  onCompleteChallenge 
}: ChallengeModesProps) {
  const [selectedMode, setSelectedMode] = useState<ChallengeMode | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [bestScores, setBestScores] = useState<Record<string, number>>({})

  useEffect(() => {
    // Load best scores from localStorage
    const saved = localStorage.getItem('verb-roulette-best-scores')
    if (saved) {
      setBestScores(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isActive && currentMode && timeRemaining <= 0) {
      // Challenge completed
      const score = verbsCompleted
      const currentBest = bestScores[currentMode.id] || 0
      
      if (score > currentBest) {
        const newBestScores = { ...bestScores, [currentMode.id]: score }
        setBestScores(newBestScores)
        localStorage.setItem('verb-roulette-best-scores', JSON.stringify(newBestScores))
      }
      
      setShowResults(true)
      onCompleteChallenge()
    }
  }, [timeRemaining, isActive, currentMode, verbsCompleted, bestScores, onCompleteChallenge])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 border-green-200"
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200"
      case "hard": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expert": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!currentMode) return 0
    return Math.min((verbsCompleted / currentMode.target) * 100, 100)
  }

  const getTimeProgressPercentage = () => {
    if (!currentMode) return 0
    return ((currentMode.duration - timeRemaining) / currentMode.duration) * 100
  }

  if (showResults && currentMode) {
    const score = verbsCompleted
    const target = currentMode.target
    const success = score >= target
    const bestScore = bestScores[currentMode.id] || 0
    const isNewRecord = score > bestScore

    return (
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {success ? "🎉 Challenge Completed!" : "⏰ Time's Up"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{score}</div>
            <div className="text-sm text-muted-foreground">verbs completed out of {target}</div>
          </div>

          {isNewRecord && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-bold text-yellow-800">New Record!</div>
              <div className="text-sm text-yellow-700">Personal best score</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{bestScore}</div>
              <div className="text-xs text-muted-foreground">Best score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{target}</div>
              <div className="text-xs text-muted-foreground">Target</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setShowResults(false)} 
              variant="outline" 
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowResults(false)
                onStartChallenge(currentMode)
              }} 
              className="flex-1"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isActive && currentMode) {
    return (
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            {currentMode.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Verb progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {verbsCompleted}/{currentMode.target}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
          </div>

          {/* Time remaining */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Time</span>
              <span className={cn(
                "text-sm font-bold",
                timeRemaining <= 10 ? "text-red-500" : "text-muted-foreground"
              )}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Progress value={getTimeProgressPercentage()} className="h-2" />
          </div>

          {/* Real-time statistics */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{verbsCompleted}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{formatTime(timeRemaining)}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Challenge Modes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {CHALLENGE_MODES.map((mode) => (
          <div
            key={mode.id}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105",
              selectedMode?.id === mode.id 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50"
            )}
            onClick={() => setSelectedMode(mode)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-full text-white", mode.color)}>
                  {mode.icon}
                </div>
                <h3 className="font-semibold">{mode.name}</h3>
              </div>
              <Badge className={getDifficultyColor(mode.difficulty)}>
                {mode.difficulty}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {mode.description}
            </p>

            <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(mode.duration)}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {mode.target} verbs
              </div>
              {bestScores[mode.id] && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Best: {bestScores[mode.id]}
                </div>
              )}
            </div>

            {selectedMode?.id === mode.id && (
              <Button 
                onClick={() => onStartChallenge(mode)} 
                className="w-full"
                size="sm"
              >
                Start Challenge
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
