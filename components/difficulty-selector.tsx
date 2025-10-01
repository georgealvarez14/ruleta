"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Target, Zap, Crown, Lock, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DifficultyLevel {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  requirements: {
    totalVerbs: number
    bestStreak: number
    averageTime: number
  }
  benefits: string[]
  unlocked: boolean
}

interface DifficultySelectorProps {
  stats: {
    regular: number
    irregular: number
    total: number
    streak: number
    bestStreak: number
    averageTime: number
    perfectRounds: number
  }
  onDifficultyChange: (difficulty: DifficultyLevel) => void
  currentDifficulty: DifficultyLevel | null
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: "beginner",
    name: "Beginner",
    description: "Perfect for starting your verb adventure",
    icon: <Star className="h-5 w-5" />,
    color: "bg-green-500",
    requirements: {
      totalVerbs: 0,
      bestStreak: 0,
      averageTime: 0
    },
    benefits: [
      "Most common verbs",
      "Unlimited time",
      "Visual hints",
      "No pressure"
    ],
    unlocked: true
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "For students with basic experience",
    icon: <Target className="h-5 w-5" />,
    color: "bg-blue-500",
    requirements: {
      totalVerbs: 10,
      bestStreak: 3,
      averageTime: 5000
    },
    benefits: [
      "Mixed verbs",
      "Moderate time",
      "Fewer hints",
      "Basic challenges"
    ],
    unlocked: false
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "For experienced students",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-yellow-500",
    requirements: {
      totalVerbs: 25,
      bestStreak: 8,
      averageTime: 3000
    },
    benefits: [
      "Complex verbs",
      "Limited time",
      "No hints",
      "Intense challenges"
    ],
    unlocked: false
  },
  {
    id: "expert",
    name: "Expert",
    description: "For verb masters",
    icon: <Crown className="h-5 w-5" />,
    color: "bg-purple-500",
    requirements: {
      totalVerbs: 50,
      bestStreak: 15,
      averageTime: 2000
    },
    benefits: [
      "All verbs",
      "Extreme time",
      "No help",
      "Epic challenges"
    ],
    unlocked: false
  }
]

export function DifficultySelector({ stats, onDifficultyChange, currentDifficulty }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(currentDifficulty)

  // Calculate which levels are unlocked
  const unlockedLevels = DIFFICULTY_LEVELS.map(level => ({
    ...level,
    unlocked: level.requirements.totalVerbs <= stats.total &&
              level.requirements.bestStreak <= stats.bestStreak &&
              level.requirements.averageTime >= stats.averageTime
  }))

  const getProgressPercentage = (level: DifficultyLevel) => {
    const totalRequirements = 3
    let completedRequirements = 0

    if (stats.total >= level.requirements.totalVerbs) completedRequirements++
    if (stats.bestStreak >= level.requirements.bestStreak) completedRequirements++
    if (stats.averageTime <= level.requirements.averageTime || level.requirements.averageTime === 0) completedRequirements++

    return (completedRequirements / totalRequirements) * 100
  }

  const getRequirementStatus = (level: DifficultyLevel) => {
    return {
      totalVerbs: stats.total >= level.requirements.totalVerbs,
      bestStreak: stats.bestStreak >= level.requirements.bestStreak,
      averageTime: stats.averageTime <= level.requirements.averageTime || level.requirements.averageTime === 0
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Difficulty Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {unlockedLevels.map((level) => {
          const isSelected = selectedDifficulty?.id === level.id
          const isUnlocked = level.unlocked
          const progress = getProgressPercentage(level)
          const requirements = getRequirementStatus(level)

          return (
            <div
              key={level.id}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : isUnlocked 
                    ? "border-muted hover:border-primary/50 cursor-pointer" 
                    : "border-muted/50 opacity-60",
                "hover:scale-105"
              )}
              onClick={() => isUnlocked && setSelectedDifficulty(level)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full text-white",
                    isUnlocked ? level.color : "bg-gray-400"
                  )}>
                    {isUnlocked ? level.icon : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {level.name}
                      {isUnlocked && <Check className="h-4 w-4 text-green-500" />}
                    </h3>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={isUnlocked ? "default" : "secondary"}
                  className={isUnlocked ? "bg-green-500" : ""}
                >
                  {isUnlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>

              {/* Unlock progress */}
              {!isUnlocked && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress to unlock</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Requirements */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className={cn(
                  "p-2 rounded text-center",
                  requirements.totalVerbs ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                )}>
                  <div className="font-semibold">{level.requirements.totalVerbs}</div>
                  <div>Verbs</div>
                </div>
                <div className={cn(
                  "p-2 rounded text-center",
                  requirements.bestStreak ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                )}>
                  <div className="font-semibold">{level.requirements.bestStreak}</div>
                  <div>Streak</div>
                </div>
                <div className={cn(
                  "p-2 rounded text-center",
                  requirements.averageTime ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                )}>
                  <div className="font-semibold">
                    {level.requirements.averageTime > 0 ? `${level.requirements.averageTime/1000}s` : "∞"}
                  </div>
                  <div>Time</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  {level.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection button */}
              {isUnlocked && (
                <Button 
                  onClick={() => onDifficultyChange(level)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              )}
            </div>
          )
        })}

        {/* Additional information */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Complete more verbs and improve your statistics to unlock more challenging levels
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
