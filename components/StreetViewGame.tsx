'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { MapPin, Sparkles, RefreshCw } from 'lucide-react'
import { LocationParser } from '@/lib/locationParser'
import { ScenarioGenerator } from '@/lib/scenarioGenerator'

interface GameScenario {
  id: string
  title: string
  description: string
  location: {
    name: string
    coordinates?: { lat: number; lng: number }
    country?: string
    region?: string
  }
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  generatedFrom: string
}

export default function StreetViewGame() {
  const [userPrompt, setUserPrompt] = useState('')
  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [detectedLocations, setDetectedLocations] = useState<string[]>([])

  const handlePromptChange = useCallback((value: string) => {
    setUserPrompt(value)
    // Parse locations from the prompt in real-time
    const locations = LocationParser.extractLocations(value)
    setDetectedLocations(locations)
  }, [])

  const generateScenario = async () => {
    if (!userPrompt.trim()) return

    setIsGenerating(true)
    try {
      // Parse specific locations from the user prompt
      const parsedLocations = LocationParser.extractLocations(userPrompt)
      
      // Generate scenario respecting the specified locations
      const scenario = await ScenarioGenerator.generateScenario(userPrompt, parsedLocations)
      setCurrentScenario(scenario)
    } catch (error) {
      console.error('Failed to generate scenario:', error)
      // Fallback to a simple scenario
      setCurrentScenario({
        id: Date.now().toString(),
        title: 'Custom Location Challenge',
        description: `Explore the area around ${detectedLocations.join(', ') || 'your specified location'} and try to identify key landmarks.`,
        location: {
          name: detectedLocations[0] || 'Unknown Location',
        },
        difficulty: 'medium',
        hints: ['Look for distinctive architecture', 'Check street signs', 'Observe the landscape'],
        generatedFrom: userPrompt
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resetGame = () => {
    setCurrentScenario(null)
    setUserPrompt('')
    setDetectedLocations([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            StreetView Explorer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate custom streetview scenarios by specifying locations in your prompt. 
            The AI will respect and use your specified locations to create engaging challenges.
          </p>
        </div>

        {/* Scenario Generator */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Scenario Generator
            </CardTitle>
            <CardDescription>
              Describe the type of challenge you want, and mention specific locations you'd like to explore
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Your Prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="e.g., 'Create a challenge in Tokyo, Japan focusing on traditional temples' or 'I want to explore the streets of Paris near the Eiffel Tower'"
                value={userPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Detected Locations */}
            {detectedLocations.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-700">
                  Detected Locations:
                </label>
                <div className="flex flex-wrap gap-2">
                  {detectedLocations.map((location, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={generateScenario} 
                disabled={!userPrompt.trim() || isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Scenario
                  </>
                )}
              </Button>
              {currentScenario && (
                <Button variant="outline" onClick={resetGame}>
                  New Game
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Scenario */}
        {currentScenario && (
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{currentScenario.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant={
                      currentScenario.difficulty === 'easy' ? 'default' :
                      currentScenario.difficulty === 'medium' ? 'secondary' : 'destructive'
                    }>
                      {currentScenario.difficulty.toUpperCase()}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {currentScenario.location.name}
                  </div>
                  {currentScenario.location.country && (
                    <div className="text-xs text-gray-500 mt-1">
                      {currentScenario.location.country}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Challenge Description:</h4>
                <p className="text-gray-700">{currentScenario.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Hints:</h4>
                <ul className="space-y-1">
                  {currentScenario.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="text-xs text-gray-500">
                <strong>Generated from:</strong> "{currentScenario.generatedFrom}"
              </div>

              {/* Placeholder for Street View integration */}
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-600 font-medium">Street View Integration</p>
                  <p className="text-sm text-gray-500">
                    Location: {currentScenario.location.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    (Street View API integration would go here)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!currentScenario && (
          <Card className="w-full bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-900">How to use:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">1.</span>
                    Write a prompt describing what kind of challenge you want
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">2.</span>
                    <strong>Mention specific locations</strong> you want to explore (cities, landmarks, countries)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">3.</span>
                    The AI will generate a scenario that respects your specified locations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">4.</span>
                    Enjoy your custom streetview challenge!
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}