"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Verb {
  verb: string
  type: "regular" | "irregular"
  past: string
  pastParticiple: string
}

interface VerbCardProps {
  verb: Verb
  onPlayPronunciation: (verb: string) => void
}

export function VerbCard({ verb, onPlayPronunciation }: VerbCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-4",
        verb.type === "regular"
          ? "border-secondary bg-gradient-to-br from-card to-secondary/10"
          : "border-accent bg-gradient-to-br from-card to-accent/10",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">{verb.verb}</CardTitle>
          <Badge
            variant={verb.type === "regular" ? "secondary" : "default"}
            className={cn(
              "text-xs font-semibold",
              verb.type === "regular" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground",
            )}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {verb.type === "regular" ? "Regular" : "Irregular"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Verb forms */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Past:</span>
              <span className="font-semibold">{verb.past}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Past Participle:</span>
              <span className="font-semibold">{verb.pastParticiple}</span>
            </div>
          </div>
        </div>

        {/* Pronunciation button */}
        <Button onClick={() => onPlayPronunciation(verb.verb)} variant="outline" size="sm" className="w-full">
          <Volume2 className="h-4 w-4 mr-2" />
          Listen pronunciation
        </Button>

        {/* Usage example */}
        <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
          <p className="text-sm text-muted-foreground mb-1">Example:</p>
          <p className="text-sm font-medium">{getExampleSentence(verb)}</p>
        </div>
      </CardContent>

      {/* Decorative effect */}
      <div
        className={cn(
          "absolute top-0 right-0 w-20 h-20 opacity-10",
          verb.type === "regular" ? "bg-secondary" : "bg-accent",
        )}
        style={{
          clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
        }}
      />
    </Card>
  )
}

function getExampleSentence(verb: Verb): string {
  const examples: Record<string, string> = {
    be: "I am happy today.",
    have: "I have a new car.",
    do: "I do my homework every day.",
    say: "She says hello to everyone.",
    get: "I get up early in the morning.",
    make: "They make delicious cookies.",
    go: "We go to school by bus.",
    know: "I know the answer.",
    take: "Please take your time.",
    see: "I can see the mountains.",
    come: "Come here, please.",
    think: "I think it's a good idea.",
    look: "Look at that beautiful sunset.",
    want: "I want to learn English.",
    give: "Give me your hand.",
    use: "I use my computer every day.",
    find: "I can't find my keys.",
    tell: "Tell me a story.",
    ask: "Ask me any question.",
    work: "I work in an office.",
    seem: "It seems like a good plan.",
    feel: "I feel happy today.",
    try: "Try your best!",
    leave: "Don't leave without me.",
    call: "Call me later, please.",
  }

  return examples[verb.verb] || `I ${verb.verb} every day.`
}
