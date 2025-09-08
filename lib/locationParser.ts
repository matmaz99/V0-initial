/**
 * LocationParser - Extracts and validates location mentions from user prompts
 * This addresses the Linear issue MAPHUNT-3: "Prompt for specific location in generation"
 */

interface LocationMatch {
  text: string
  type: 'city' | 'country' | 'landmark' | 'region' | 'address'
  confidence: number
}

export class LocationParser {
  // Common location patterns and known locations
  private static readonly LOCATION_PATTERNS = [
    // Cities with common suffixes
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*,\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, // "Paris, France"
    /\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi, // "in Tokyo"
    /\bat\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi, // "at Times Square"
    /\bnear\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi, // "near the Eiffel Tower"
    /\baround\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi, // "around Manhattan"
    /\bexplore\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi, // "explore London"
    /\bvisit\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi, // "visit Rome"
  ]

  // Known cities, countries, and landmarks for validation
  private static readonly KNOWN_LOCATIONS = new Set([
    // Major cities
    'Tokyo', 'Paris', 'London', 'New York', 'Los Angeles', 'Chicago', 'Sydney', 'Melbourne',
    'Berlin', 'Munich', 'Rome', 'Milan', 'Madrid', 'Barcelona', 'Amsterdam', 'Brussels',
    'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki',
    'Moscow', 'St Petersburg', 'Istanbul', 'Athens', 'Dublin', 'Edinburgh', 'Zurich',
    'Geneva', 'Lisbon', 'Porto', 'Bucharest', 'Sofia', 'Zagreb', 'Ljubljana', 'Bratislava',
    
    // Countries
    'Japan', 'France', 'England', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium',
    'Austria', 'Switzerland', 'Czech Republic', 'Hungary', 'Poland', 'Sweden', 'Denmark',
    'Norway', 'Finland', 'Russia', 'Turkey', 'Greece', 'Ireland', 'Scotland', 'Portugal',
    'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'United States', 'Canada',
    'Australia', 'New Zealand', 'Brazil', 'Argentina', 'Chile', 'Mexico', 'India', 'China',
    'South Korea', 'Thailand', 'Vietnam', 'Singapore', 'Malaysia', 'Indonesia', 'Philippines',
    
    // Famous landmarks and areas
    'Eiffel Tower', 'Times Square', 'Big Ben', 'Colosseum', 'Sagrada Familia', 'Statue of Liberty',
    'Golden Gate Bridge', 'Tower Bridge', 'Arc de Triomphe', 'Notre Dame', 'Louvre', 'Buckingham Palace',
    'Westminster', 'Central Park', 'Brooklyn Bridge', 'Hollywood', 'Beverly Hills', 'Manhattan',
    'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Shibuya', 'Shinjuku', 'Harajuku',
    'Champs Elysees', 'Montmartre', 'Latin Quarter', 'Soho', 'Covent Garden', 'Camden',
    'Red Square', 'Kremlin', 'Acropolis', 'Parthenon', 'Vatican', 'St Peters', 'Trevi Fountain',
    'Spanish Steps', 'Piazza Navona', 'Trastevere', 'Brandenburg Gate', 'Checkpoint Charlie',
    'Alexanderplatz', 'Oktoberfest', 'Neuschwanstein', 'Santorini', 'Mykonos', 'Crete',
    'Ibiza', 'Mallorca', 'Canary Islands', 'Madeira', 'Azores'
  ])

  // US States
  private static readonly US_STATES = new Set([
    'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio',
    'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia', 'Washington',
    'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri', 'Maryland',
    'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana',
    'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Iowa', 'Nevada',
    'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska', 'West Virginia',
    'Idaho', 'Hawaii', 'New Hampshire', 'Maine', 'Montana', 'Rhode Island',
    'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming'
  ])

  /**
   * Extract locations from a user prompt
   * @param prompt - The user's input prompt
   * @returns Array of detected location names
   */
  static extractLocations(prompt: string): string[] {
    if (!prompt || typeof prompt !== 'string') {
      return []
    }

    const locations = new Set<string>()
    const matches: LocationMatch[] = []

    // Apply each pattern to find potential locations
    for (const pattern of this.LOCATION_PATTERNS) {
      pattern.lastIndex = 0 // Reset regex state
      let match
      while ((match = pattern.exec(prompt)) !== null) {
        const locationText = match[1]?.trim()
        if (locationText && locationText.length > 1) {
          matches.push({
            text: locationText,
            type: this.inferLocationType(locationText),
            confidence: this.calculateConfidence(locationText, prompt)
          })
        }
      }
    }

    // Also look for standalone known locations
    const words = prompt.split(/\s+/)
    for (let i = 0; i < words.length; i++) {
      // Check single words
      const word = words[i].replace(/[^\w\s]/g, '')
      if (this.isKnownLocation(word)) {
        matches.push({
          text: word,
          type: this.inferLocationType(word),
          confidence: 0.8
        })
      }

      // Check two-word combinations
      if (i < words.length - 1) {
        const twoWords = `${word} ${words[i + 1].replace(/[^\w\s]/g, '')}`
        if (this.isKnownLocation(twoWords)) {
          matches.push({
            text: twoWords,
            type: this.inferLocationType(twoWords),
            confidence: 0.9
          })
        }
      }

      // Check three-word combinations
      if (i < words.length - 2) {
        const threeWords = `${word} ${words[i + 1].replace(/[^\w\s]/g, '')} ${words[i + 2].replace(/[^\w\s]/g, '')}`
        if (this.isKnownLocation(threeWords)) {
          matches.push({
            text: threeWords,
            type: this.inferLocationType(threeWords),
            confidence: 0.95
          })
        }
      }
    }

    // Filter and deduplicate matches
    const validMatches = matches
      .filter(match => match.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence)

    // Remove duplicates and overlapping matches
    const seen = new Set<string>()
    for (const match of validMatches) {
      const normalized = match.text.toLowerCase()
      if (!seen.has(normalized)) {
        seen.add(normalized)
        locations.add(match.text)
      }
    }

    return Array.from(locations)
  }

  /**
   * Check if a text is a known location
   */
  private static isKnownLocation(text: string): boolean {
    const normalized = text.trim()
    return this.KNOWN_LOCATIONS.has(normalized) || this.US_STATES.has(normalized)
  }

  /**
   * Infer the type of location based on the text
   */
  private static inferLocationType(text: string): LocationMatch['type'] {
    if (this.US_STATES.has(text)) return 'region'
    if (text.includes('Tower') || text.includes('Bridge') || text.includes('Square')) return 'landmark'
    if (/^[A-Z][a-z]+$/.test(text) && this.KNOWN_LOCATIONS.has(text)) {
      // Could be city or country, default to city for single words
      return 'city'
    }
    return 'city' // Default assumption
  }

  /**
   * Calculate confidence score for a location match
   */
  private static calculateConfidence(location: string, context: string): number {
    let confidence = 0.5 // Base confidence

    // Higher confidence for known locations
    if (this.isKnownLocation(location)) {
      confidence += 0.3
    }

    // Higher confidence if mentioned with location indicators
    const locationIndicators = ['in', 'at', 'near', 'around', 'visit', 'explore', 'from', 'to']
    const contextLower = context.toLowerCase()
    const locationLower = location.toLowerCase()
    
    for (const indicator of locationIndicators) {
      if (contextLower.includes(`${indicator} ${locationLower}`)) {
        confidence += 0.2
        break
      }
    }

    // Higher confidence for capitalized proper nouns
    if (/^[A-Z]/.test(location)) {
      confidence += 0.1
    }

    // Lower confidence for very short or very long strings
    if (location.length < 3 || location.length > 50) {
      confidence -= 0.2
    }

    return Math.min(1.0, Math.max(0.0, confidence))
  }

  /**
   * Validate and enrich location information
   * This could be extended to use geocoding APIs in the future
   */
  static validateAndEnrichLocation(locationName: string): {
    name: string
    isValid: boolean
    type: string
    suggestions?: string[]
  } {
    const isValid = this.isKnownLocation(locationName)
    const type = this.inferLocationType(locationName)
    
    return {
      name: locationName,
      isValid,
      type,
      suggestions: isValid ? undefined : this.getSimilarLocations(locationName)
    }
  }

  /**
   * Get similar locations for suggestions (simple implementation)
   */
  private static getSimilarLocations(input: string): string[] {
    const inputLower = input.toLowerCase()
    const similar: string[] = []
    
    for (const location of this.KNOWN_LOCATIONS) {
      if (location.toLowerCase().includes(inputLower) || 
          inputLower.includes(location.toLowerCase())) {
        similar.push(location)
        if (similar.length >= 3) break
      }
    }
    
    return similar
  }
}