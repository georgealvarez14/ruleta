"use client"

import { useEffect, useRef } from "react"

interface SoundEffectsProps {
  isSpinning: boolean
  selectedVerb: any
  achievementUnlocked: boolean
}

export function SoundEffects({ isSpinning, selectedVerb, achievementUnlocked }: SoundEffectsProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const spinSoundRef = useRef<OscillatorNode | null>(null)
  const successSoundRef = useRef<OscillatorNode | null>(null)

  useEffect(() => {
    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  useEffect(() => {
    if (isSpinning && audioContextRef.current) {
      // Create spinning sound
      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start()
      spinSoundRef.current = oscillator
      
      // Stop the sound after 0.5 seconds
      setTimeout(() => {
        if (spinSoundRef.current) {
          spinSoundRef.current.stop()
          spinSoundRef.current = null
        }
      }, 500)
    }
  }, [isSpinning])

  useEffect(() => {
    if (selectedVerb && !isSpinning && audioContextRef.current) {
      // Create success sound
      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Success melody (do-mi-sol)
      const frequencies = [261.63, 329.63, 392.00] // C4, E4, G4
      
      frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(audioContext.destination)
        
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
        gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3)
        
        osc.start(audioContext.currentTime + index * 0.1)
        osc.stop(audioContext.currentTime + index * 0.1 + 0.3)
      })
    }
  }, [selectedVerb, isSpinning])

  useEffect(() => {
    if (achievementUnlocked && audioContextRef.current) {
      // Create achievement unlocked sound
      const audioContext = audioContextRef.current
      
      // Bell sound for achievement
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.5) // C6
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }, [achievementUnlocked])

  return null // This component renders nothing visual
}

// Hook to use sound effects
export function useSoundEffects() {
  const playSpinSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const playSuccessSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new AudioContext()
      
      // Create a success melody
      const notes = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
      
      notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.2)
        
        oscillator.start(audioContext.currentTime + index * 0.1)
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.2)
      })
    }
  }

  const playAchievementSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new AudioContext()
      
      // More elaborate achievement sound
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Ascending frequency for achievement effect
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.3) // C6
      oscillator.frequency.exponentialRampToValueAtTime(1567.98, audioContext.currentTime + 0.6) // G6
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.6)
    }
  }

  const playHappySound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new AudioContext()
      
      // Happy sound - ascending major chord with more volume
      const frequencies = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1) // Increased volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.4)
        
        oscillator.start(audioContext.currentTime + index * 0.1)
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.4)
      })
    }
  }

  const playSadSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const audioContext = new AudioContext()
      
      // Sad sound - descending minor chord with more volume
      const frequencies = [392.00, 349.23, 311.13, 261.63] // G4, F4, D#4, C4
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.12)
        gainNode.gain.setValueAtTime(0.18, audioContext.currentTime + index * 0.12) // Increased volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.12 + 0.5)
        
        oscillator.start(audioContext.currentTime + index * 0.12)
        oscillator.stop(audioContext.currentTime + index * 0.12 + 0.5)
      })
    }
  }

  return {
    playSpinSound,
    playSuccessSound,
    playAchievementSound,
    playHappySound,
    playSadSound
  }
}
