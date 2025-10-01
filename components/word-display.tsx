"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Eye, EyeOff, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Verb {
  verb: string
  type: "regular" | "irregular"
  past: string
  pastParticiple: string
}

interface WordDisplayProps {
  verb: Verb | null
  onPlayPronunciation: (verb: string) => void
}

export function WordDisplay({ verb, onPlayPronunciation }: WordDisplayProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [spellingAttempt, setSpellingAttempt] = useState("")
  const [spellingResult, setSpellingResult] = useState<"correct" | "incorrect" | null>(null)
  const [showSpellingMode, setShowSpellingMode] = useState(false)

  useEffect(() => {
    if (verb) {
      setShowAnswer(false)
      setSpellingAttempt("")
      setSpellingResult(null)
      setShowSpellingMode(false)
    }
  }, [verb])

  const handleSpellingCheck = () => {
    if (spellingAttempt.toLowerCase() === verb?.verb.toLowerCase()) {
      setSpellingResult("correct")
      // Efecto de sonido de éxito
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      // Auto-hide después de 3 segundos
      setTimeout(() => setSpellingResult(null), 3000)
    } else {
      setSpellingResult("incorrect")
      // Efecto de sonido de error
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
      // Auto-hide después de 2 segundos
      setTimeout(() => setSpellingResult(null), 2000)
    }
  }

  const resetSpelling = () => {
    setSpellingAttempt("")
    setSpellingResult(null)
  }

  if (!verb) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center bg-gray-900/50 border-gray-700">
        <CardContent className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            ¡Gira la ruleta!
          </h3>
          <p className="text-gray-400">
            Selecciona un verbo para comenzar a practicar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="min-h-[400px] bg-gray-900/50 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-gray-200">
          <span className="text-2xl">📝</span>
          Palabra para Deletrear
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verbo principal en grande */}
        <div className="text-center">
          <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-in fade-in-50 slide-in-from-bottom-4 drop-shadow-2xl">
            {verb.verb.toUpperCase()}
          </div>
          <Badge 
            variant={verb.type === "regular" ? "secondary" : "default"}
            className={cn(
              "text-lg px-4 py-2",
              verb.type === "regular" ? "bg-cyan-500 text-white" : "bg-purple-500 text-white"
            )}
          >
            {verb.type === "regular" ? "Regular" : "Irregular"}
          </Badge>
        </div>

        {/* Botones de control */}
        <div className="flex justify-center gap-3">
          <Button 
            onClick={() => onPlayPronunciation(verb.verb)}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Volume2 className="h-5 w-5" />
            Escuchar
          </Button>
          
          <Button 
            onClick={() => setShowAnswer(!showAnswer)}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            {showAnswer ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            {showAnswer ? "Ocultar" : "Ver"} Respuestas
          </Button>

          <Button 
            onClick={() => setShowSpellingMode(!showSpellingMode)}
            variant={showSpellingMode ? "default" : "outline"}
            size="lg"
            className="flex items-center gap-2"
          >
            📝
            {showSpellingMode ? "Salir" : "Deletrear"}
          </Button>
        </div>

        {/* Modo de deletreo */}
        {showSpellingMode && (
          <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h4 className="text-lg font-semibold text-center text-gray-200">Modo Deletreo</h4>
            
            <div className="space-y-3">
              <input
                type="text"
                value={spellingAttempt}
                onChange={(e) => setSpellingAttempt(e.target.value)}
                placeholder="Escribe el verbo aquí..."
                className="w-full p-3 text-center text-xl font-bold border-2 border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSpellingCheck()}
              />
              
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={handleSpellingCheck}
                  disabled={!spellingAttempt}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Verificar
                </Button>
                
                <Button 
                  onClick={resetSpelling}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Limpiar
                </Button>
              </div>

              {/* Resultado del deletreo */}
              {spellingResult && (
                <div className={cn(
                  "p-6 rounded-lg text-center font-bold text-lg transition-all duration-500 transform",
                  spellingResult === "correct" 
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 scale-105" 
                    : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-300 scale-105"
                )}>
                  {spellingResult === "correct" ? (
                    <div className="space-y-3">
                      {/* Caritas felices con animaciones */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-5xl animate-bounce" style={{animationDelay: '0s'}}>😊</div>
                        <div className="text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>😄</div>
                        <div className="text-5xl animate-bounce" style={{animationDelay: '0.4s'}}>😊</div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
                        <span className="text-2xl">¡Correcto! 🎉</span>
                        <span className="text-lg text-green-600">¡Excelente trabajo! 🌟</span>
                      </div>
                      
                      {/* Caritas adicionales */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-3xl animate-spin" style={{animationDuration: '2s'}}>🎉</div>
                        <div className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>⭐</div>
                        <div className="text-3xl animate-spin" style={{animationDuration: '2s', animationDelay: '1s'}}>🎉</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Caritas tristes con animaciones */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-5xl animate-pulse" style={{animationDelay: '0s'}}>😢</div>
                        <div className="text-6xl animate-pulse" style={{animationDelay: '0.2s'}}>😞</div>
                        <div className="text-5xl animate-pulse" style={{animationDelay: '0.4s'}}>😢</div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="h-8 w-8 text-red-600 animate-pulse" />
                        <span className="text-2xl">Inténtalo de nuevo</span>
                        <span className="text-lg text-red-600">¡No te rindas! 💪</span>
                      </div>
                      
                      {/* Caritas de ánimo */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>💪</div>
                        <div className="text-3xl animate-bounce" style={{animationDelay: '0.6s'}}>🔥</div>
                        <div className="text-3xl animate-bounce" style={{animationDelay: '0.9s'}}>💪</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Respuestas (cuando se muestran) */}
        {showAnswer && (
          <div className="space-y-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border-2 border-cyan-400/20">
            <h4 className="text-lg font-semibold text-center text-gray-200">Formas del Verbo</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-600">
                <div className="text-sm text-gray-400 mb-1">Pasado Simple</div>
                <div className="text-2xl font-bold text-cyan-400">{verb.past}</div>
              </div>
              
              <div className="text-center p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-600">
                <div className="text-sm text-gray-400 mb-1">Participio Pasado</div>
                <div className="text-2xl font-bold text-purple-400">{verb.pastParticiple}</div>
              </div>
            </div>

            {/* Ejemplo de uso */}
            <div className="text-center p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">Ejemplo</div>
              <div className="text-lg font-medium text-gray-200">
                I {verb.verb} every day.
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="text-center text-sm text-gray-400">
          💡 <strong>Tip:</strong> Usa el modo deletreo para practicar la escritura del verbo
        </div>
      </CardContent>
    </Card>
  )
}
