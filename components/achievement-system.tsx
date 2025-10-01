"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Zap, Clock, Star, Crown, Medal, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  condition: (stats: any) => boolean
  unlocked: boolean
  category: "practice" | "speed" | "streak" | "mastery"
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface AchievementSystemProps {
  stats: {
    regular: number
    irregular: number
    total: number
    streak: number
    bestStreak: number
    averageTime: number
    perfectRounds: number
  }
  onAchievementUnlocked: (achievement: Achievement) => void
}

const ACHIEVEMENTS: Achievement[] = [
  // Practice achievements
  {
    id: "first-steps",
    title: "First Steps",
    description: "Practice your first verb",
    icon: <Target className="h-5 w-5" />,
    condition: (stats) => stats.total >= 1,
    unlocked: false,
    category: "practice",
    rarity: "common"
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Practice 10 verbs",
    icon: <Star className="h-5 w-5" />,
    condition: (stats) => stats.total >= 10,
    unlocked: false,
    category: "practice",
    rarity: "common"
  },
  {
    id: "dedicated-learner",
    title: "Dedicated Student",
    description: "Practice 25 verbs",
    icon: <Medal className="h-5 w-5" />,
    condition: (stats) => stats.total >= 25,
    unlocked: false,
    category: "practice",
    rarity: "rare"
  },
  {
    id: "verb-master",
    title: "Verb Master",
    description: "Practice 50 verbs",
    icon: <Crown className="h-5 w-5" />,
    condition: (stats) => stats.total >= 50,
    unlocked: false,
    category: "practice",
    rarity: "epic"
  },
  {
    id: "verb-legend",
    title: "Verb Legend",
    description: "Practice 100 verbs",
    icon: <Trophy className="h-5 w-5" />,
    condition: (stats) => stats.total >= 100,
    unlocked: false,
    category: "practice",
    rarity: "legendary"
  },

  // Streak achievements
  {
    id: "hot-streak",
    title: "Hot Streak",
    description: "Get a streak of 5",
    icon: <Zap className="h-5 w-5" />,
    condition: (stats) => stats.bestStreak >= 5,
    unlocked: false,
    category: "streak",
    rarity: "rare"
  },
  {
    id: "unstoppable",
    title: "Unstoppable",
    description: "Get a streak of 10",
    icon: <Zap className="h-5 w-5" />,
    condition: (stats) => stats.bestStreak >= 10,
    unlocked: false,
    category: "streak",
    rarity: "epic"
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Get a streak of 20",
    icon: <Crown className="h-5 w-5" />,
    condition: (stats) => stats.bestStreak >= 20,
    unlocked: false,
    category: "streak",
    rarity: "legendary"
  },

  // Speed achievements
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Average less than 2 seconds",
    icon: <Clock className="h-5 w-5" />,
    condition: (stats) => stats.averageTime <= 2000,
    unlocked: false,
    category: "speed",
    rarity: "rare"
  },
  {
    id: "lightning-fast",
    title: "Lightning Speed",
    description: "Average less than 1 second",
    icon: <Zap className="h-5 w-5" />,
    condition: (stats) => stats.averageTime <= 1000,
    unlocked: false,
    category: "speed",
    rarity: "epic"
  },

  // Mastery achievements
  {
    id: "balanced-learner",
    title: "Balanced Learner",
    description: "Practice 10 regular and 10 irregular verbs",
    icon: <Target className="h-5 w-5" />,
    condition: (stats) => stats.regular >= 10 && stats.irregular >= 10,
    unlocked: false,
    category: "mastery",
    rarity: "rare"
  },
  {
    id: "irregular-expert",
    title: "Irregular Expert",
    description: "Practice 25 irregular verbs",
    icon: <Award className="h-5 w-5" />,
    condition: (stats) => stats.irregular >= 25,
    unlocked: false,
    category: "mastery",
    rarity: "epic"
  }
]

export function AchievementSystem({ stats, onAchievementUnlocked }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [showNotification, setShowNotification] = useState<Achievement | null>(null)

  useEffect(() => {
    const newAchievements = achievements.map(achievement => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        onAchievementUnlocked(achievement)
        setShowNotification(achievement)
        setTimeout(() => setShowNotification(null), 5000)
        return { ...achievement, unlocked: true }
      }
      return achievement
    })
    
    setAchievements(newAchievements)
  }, [stats, achievements, onAchievementUnlocked])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500"
      case "rare": return "bg-blue-500"
      case "epic": return "bg-purple-500"
      case "legendary": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "practice": return "📚"
      case "speed": return "⚡"
      case "streak": return "🔥"
      case "mastery": return "🎯"
      default: return "🏆"
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="space-y-4">
      {/* Achievement unlocked notification */}
      {showNotification && (
        <Card className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 animate-in slide-in-from-top-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎉</div>
              <div>
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                <p className="text-sm text-muted-foreground">{showNotification.title}</p>
                <p className="text-xs text-muted-foreground">{showNotification.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements ({unlockedCount}/{totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-2 mb-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon("practice")}</span>
              <span>Practice: {achievements.filter(a => a.category === "practice" && a.unlocked).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon("streak")}</span>
              <span>Streaks: {achievements.filter(a => a.category === "streak" && a.unlocked).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon("speed")}</span>
              <span>Speed: {achievements.filter(a => a.category === "speed" && a.unlocked).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon("mastery")}</span>
              <span>Mastery: {achievements.filter(a => a.category === "mastery" && a.unlocked).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                achievement.unlocked 
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
                  : "bg-muted/30 border-muted opacity-60"
              )}
            >
              <div className={cn(
                "p-2 rounded-full text-white",
                achievement.unlocked ? getRarityColor(achievement.rarity) : "bg-gray-300"
              )}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    "font-semibold",
                    achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {achievement.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      achievement.unlocked ? "border-current" : "border-muted-foreground"
                    )}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <p className={cn(
                  "text-sm",
                  achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground/60"
                )}>
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className="text-2xl">✅</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
