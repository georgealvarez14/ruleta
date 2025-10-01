"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, TrendingUp, Zap, Clock, Award } from "lucide-react"

interface StatsProps {
  stats: {
    regular: number
    irregular: number
    total: number
    streak: number
    bestStreak: number
    averageTime: number
    perfectRounds: number
  }
}

export function StatsPanel({ stats }: StatsProps) {
  const regularPercentage = stats.total > 0 ? (stats.regular / stats.total) * 100 : 0
  const irregularPercentage = stats.total > 0 ? (stats.irregular / stats.total) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total verbs */}
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-3xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Verbs practiced</div>
        </div>

        {/* Regular verbs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Regular</span>
            </div>
            <span className="text-sm font-bold text-secondary">{stats.regular}</span>
          </div>
          <Progress
            value={regularPercentage}
            className="h-2"
            style={
              {
                "--progress-background": "hsl(var(--secondary))",
              } as React.CSSProperties
            }
          />
          <div className="text-xs text-muted-foreground text-right">{regularPercentage.toFixed(1)}%</div>
        </div>

        {/* Irregular verbs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Irregular</span>
            </div>
            <span className="text-sm font-bold text-accent">{stats.irregular}</span>
          </div>
          <Progress
            value={irregularPercentage}
            className="h-2"
            style={
              {
                "--progress-background": "hsl(var(--accent))",
              } as React.CSSProperties
            }
          />
          <div className="text-xs text-muted-foreground text-right">{irregularPercentage.toFixed(1)}%</div>
        </div>

        {/* Additional statistics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Best Streak</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.bestStreak}</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Average Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.averageTime > 0 ? `${(stats.averageTime / 1000).toFixed(1)}s` : "0s"}
            </div>
          </div>
        </div>

        {/* Motivational message */}
        {stats.total > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              {stats.total < 10
                ? "Keep practicing!"
                : stats.total < 25
                  ? "You're doing great!"
                  : stats.total < 50
                    ? "Excellent progress!"
                    : "You're a verb expert!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
