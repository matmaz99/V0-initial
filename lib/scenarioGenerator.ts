/**
 * ScenarioGenerator - Generates streetview game scenarios that respect user-specified locations
 * This addresses the Linear issue MAPHUNT-3: "Prompt for specific location in generation"
 */

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

interface LocationContext {
  name: string
  type: 'city' | 'country' | 'landmark' | 'region'
  knownFeatures: string[]
  culturalContext: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export class ScenarioGenerator {
  // Location-specific context database
  private static readonly LOCATION_CONTEXTS: Record<string, LocationContext> = {
    'Tokyo': {
      name: 'Tokyo',
      type: 'city',
      knownFeatures: ['neon signs', 'crowded crossings', 'vending machines', 'traditional temples', 'modern skyscrapers'],
      culturalContext: ['Japanese text', 'left-hand traffic', 'unique architecture', 'cherry blossoms'],
      difficulty: 'medium'
    },
    'Paris': {
      name: 'Paris',
      type: 'city',
      knownFeatures: ['Haussmanian architecture', 'wide boulevards', 'cafés', 'metro entrances', 'wrought iron balconies'],
      culturalContext: ['French signage', 'cobblestone streets', 'artistic heritage', 'fashion districts'],
      difficulty: 'easy'
    },
    'London': {
      name: 'London',
      type: 'city',
      knownFeatures: ['red double-decker buses', 'black cabs', 'Georgian architecture', 'phone booths', 'parks'],
      culturalContext: ['English signage', 'left-hand traffic', 'royal heritage', 'pub culture'],
      difficulty: 'easy'
    },
    'New York': {
      name: 'New York',
      type: 'city',
      knownFeatures: ['yellow taxis', 'fire escapes', 'grid street system', 'brownstone buildings', 'skyscrapers'],
      culturalContext: ['diverse neighborhoods', 'street art', 'food trucks', 'subway grates'],
      difficulty: 'medium'
    },
    'Rome': {
      name: 'Rome',
      type: 'city',
      knownFeatures: ['ancient ruins', 'cobblestone streets', 'fountains', 'piazzas', 'terracotta roofs'],
      culturalContext: ['Italian signage', 'historical layers', 'religious architecture', 'gelato shops'],
      difficulty: 'medium'
    },
    'Berlin': {
      name: 'Berlin',
      type: 'city',
      knownFeatures: ['modern architecture', 'wide streets', 'tram lines', 'graffiti art', 'parks'],
      culturalContext: ['German signage', 'historical significance', 'cultural diversity', 'bike lanes'],
      difficulty: 'medium'
    },
    // Landmarks
    'Eiffel Tower': {
      name: 'Eiffel Tower',
      type: 'landmark',
      knownFeatures: ['iron lattice structure', 'Champ de Mars', 'Seine River views', 'tourist crowds'],
      culturalContext: ['Parisian architecture', 'French culture', 'romantic atmosphere'],
      difficulty: 'easy'
    },
    'Times Square': {
      name: 'Times Square',
      type: 'landmark',
      knownFeatures: ['bright billboards', 'yellow cabs', 'street performers', 'crowds', 'theaters'],
      culturalContext: ['American commercialism', 'Broadway shows', 'urban energy'],
      difficulty: 'easy'
    },
    'Big Ben': {
      name: 'Big Ben',
      type: 'landmark',
      knownFeatures: ['clock tower', 'Gothic architecture', 'Thames River', 'Westminster area'],
      culturalContext: ['British heritage', 'parliamentary area', 'historical significance'],
      difficulty: 'easy'
    },
    // Countries (for broader scenarios)
    'Japan': {
      name: 'Japan',
      type: 'country',
      knownFeatures: ['unique signage', 'compact cars', 'vending machines', 'traditional elements'],
      culturalContext: ['distinct culture', 'technological advancement', 'natural beauty'],
      difficulty: 'hard'
    },
    'France': {
      name: 'France',
      type: 'country',
      knownFeatures: ['diverse architecture', 'wine regions', 'historical sites', 'countryside'],
      culturalContext: ['rich cultural heritage', 'culinary tradition', 'artistic legacy'],
      difficulty: 'hard'
    }
  }

  // Scenario templates based on prompt types
  private static readonly SCENARIO_TEMPLATES = {
    exploration: {
      titleFormats: [
        'Explore the Streets of {location}',
        'Discover Hidden Gems in {location}',
        'Navigate Through {location}',
        'Wander Around {location}'
      ],
      descriptionFormats: [
        'Take a virtual walk through the streets of {location} and identify key landmarks and cultural features.',
        'Explore the unique characteristics of {location} by observing architectural details and local elements.',
        'Discover what makes {location} special by examining the streetscape and surroundings.'
      ]
    },
    challenge: {
      titleFormats: [
        '{location} Street Challenge',
        'Find Your Way in {location}',
        'The {location} Navigation Test',
        'Decode the Streets of {location}'
      ],
      descriptionFormats: [
        'Test your geographical knowledge by identifying specific features and landmarks in {location}.',
        'Can you determine your exact location in {location} using only visual clues?',
        'Navigate through {location} using architectural and cultural hints to pinpoint your position.'
      ]
    },
    cultural: {
      titleFormats: [
        'Cultural Journey Through {location}',
        'Discover {location}\'s Heritage',
        'The Culture of {location}',
        '{location} Through Local Eyes'
      ],
      descriptionFormats: [
        'Immerse yourself in the local culture of {location} by observing daily life and cultural markers.',
        'Learn about {location} through its architecture, signage, and cultural elements visible on the streets.',
        'Experience the unique cultural identity of {location} through careful observation of local details.'
      ]
    },
    architectural: {
      titleFormats: [
        'Architectural Tour of {location}',
        'Building Styles in {location}',
        '{location}\'s Urban Design',
        'The Architecture of {location}'
      ],
      descriptionFormats: [
        'Study the distinctive architectural features that define {location}\'s urban landscape.',
        'Identify different building styles and urban planning elements characteristic of {location}.',
        'Explore how architecture reflects the history and culture of {location}.'
      ]
    }
  }

  /**
   * Generate a scenario based on user prompt and detected locations
   */
  static async generateScenario(userPrompt: string, detectedLocations: string[]): Promise<GameScenario> {
    // Determine the primary location
    const primaryLocation = this.selectPrimaryLocation(detectedLocations)
    const locationContext = this.getLocationContext(primaryLocation)
    
    // Analyze prompt to determine scenario type
    const scenarioType = this.analyzePromptType(userPrompt)
    
    // Generate scenario components
    const title = this.generateTitle(primaryLocation, scenarioType)
    const description = this.generateDescription(primaryLocation, scenarioType, locationContext)
    const difficulty = this.determineDifficulty(locationContext, detectedLocations.length)
    const hints = this.generateHints(locationContext, scenarioType)

    return {
      id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      location: {
        name: primaryLocation,
        country: this.inferCountry(primaryLocation),
        region: this.inferRegion(primaryLocation)
      },
      difficulty,
      hints,
      generatedFrom: userPrompt
    }
  }

  /**
   * Select the primary location from detected locations
   */
  private static selectPrimaryLocation(locations: string[]): string {
    if (locations.length === 0) {
      return 'Unknown Location'
    }

    // Prioritize specific landmarks, then cities, then countries
    const landmarks = locations.filter(loc => this.LOCATION_CONTEXTS[loc]?.type === 'landmark')
    const cities = locations.filter(loc => this.LOCATION_CONTEXTS[loc]?.type === 'city')
    const countries = locations.filter(loc => this.LOCATION_CONTEXTS[loc]?.type === 'country')

    if (landmarks.length > 0) return landmarks[0]
    if (cities.length > 0) return cities[0]
    if (countries.length > 0) return countries[0]
    
    return locations[0] // Fallback to first detected location
  }

  /**
   * Get location context, with fallback for unknown locations
   */
  private static getLocationContext(locationName: string): LocationContext {
    const knownContext = this.LOCATION_CONTEXTS[locationName]
    if (knownContext) {
      return knownContext
    }

    // Generate fallback context for unknown locations
    return {
      name: locationName,
      type: 'city', // Assume city by default
      knownFeatures: ['local architecture', 'street signs', 'cultural elements', 'urban layout'],
      culturalContext: ['local language', 'regional characteristics', 'cultural markers'],
      difficulty: 'medium'
    }
  }

  /**
   * Analyze prompt to determine scenario type
   */
  private static analyzePromptType(prompt: string): keyof typeof ScenarioGenerator.SCENARIO_TEMPLATES {
    const promptLower = prompt.toLowerCase()
    
    if (promptLower.includes('challenge') || promptLower.includes('test') || promptLower.includes('difficult')) {
      return 'challenge'
    }
    if (promptLower.includes('culture') || promptLower.includes('heritage') || promptLower.includes('tradition')) {
      return 'cultural'
    }
    if (promptLower.includes('architecture') || promptLower.includes('building') || promptLower.includes('design')) {
      return 'architectural'
    }
    
    return 'exploration' // Default
  }

  /**
   * Generate scenario title
   */
  private static generateTitle(location: string, scenarioType: keyof typeof ScenarioGenerator.SCENARIO_TEMPLATES): string {
    const templates = this.SCENARIO_TEMPLATES[scenarioType].titleFormats
    const template = templates[Math.floor(Math.random() * templates.length)]
    return template.replace('{location}', location)
  }

  /**
   * Generate scenario description
   */
  private static generateDescription(
    location: string, 
    scenarioType: keyof typeof ScenarioGenerator.SCENARIO_TEMPLATES,
    context: LocationContext
  ): string {
    const templates = this.SCENARIO_TEMPLATES[scenarioType].descriptionFormats
    const template = templates[Math.floor(Math.random() * templates.length)]
    let description = template.replace('{location}', location)

    // Add location-specific details
    if (context.knownFeatures.length > 0) {
      const features = context.knownFeatures.slice(0, 2).join(' and ')
      description += ` Look out for ${features} that are characteristic of this area.`
    }

    return description
  }

  /**
   * Determine difficulty based on location context and specificity
   */
  private static determineDifficulty(context: LocationContext, locationCount: number): 'easy' | 'medium' | 'hard' {
    // More specific locations (landmarks) are easier
    if (context.type === 'landmark') return 'easy'
    
    // Multiple locations or countries are harder
    if (locationCount > 2 || context.type === 'country') return 'hard'
    
    // Use context difficulty or default to medium
    return context.difficulty || 'medium'
  }

  /**
   * Generate hints based on location context and scenario type
   */
  private static generateHints(context: LocationContext, scenarioType: keyof typeof ScenarioGenerator.SCENARIO_TEMPLATES): string[] {
    const hints: string[] = []

    // Add location-specific hints
    if (context.knownFeatures.length > 0) {
      hints.push(`Look for ${context.knownFeatures[0]} in the area`)
    }
    
    if (context.culturalContext.length > 0) {
      hints.push(`Notice the ${context.culturalContext[0]} around you`)
    }

    // Add scenario-type specific hints
    switch (scenarioType) {
      case 'challenge':
        hints.push('Pay attention to street signs and building numbers')
        hints.push('Look for unique architectural details')
        break
      case 'cultural':
        hints.push('Observe how locals use the space')
        hints.push('Notice cultural symbols and decorations')
        break
      case 'architectural':
        hints.push('Study the building materials and construction styles')
        hints.push('Look at window designs and roof structures')
        break
      default:
        hints.push('Take note of the overall atmosphere and environment')
        hints.push('Look for distinctive landmarks or features')
    }

    // Add general hints
    hints.push('Check the vegetation and climate clues')
    hints.push('Observe the traffic patterns and vehicle types')

    return hints.slice(0, 4) // Limit to 4 hints
  }

  /**
   * Infer country from location name
   */
  private static inferCountry(locationName: string): string | undefined {
    const locationMappings: Record<string, string> = {
      'Tokyo': 'Japan',
      'Paris': 'France',
      'London': 'United Kingdom',
      'New York': 'United States',
      'Rome': 'Italy',
      'Berlin': 'Germany',
      'Eiffel Tower': 'France',
      'Times Square': 'United States',
      'Big Ben': 'United Kingdom'
    }

    return locationMappings[locationName]
  }

  /**
   * Infer region from location name
   */
  private static inferRegion(locationName: string): string | undefined {
    const regionMappings: Record<string, string> = {
      'Tokyo': 'Kanto',
      'Paris': 'Île-de-France',
      'London': 'Greater London',
      'New York': 'New York State',
      'Rome': 'Lazio',
      'Berlin': 'Brandenburg'
    }

    return regionMappings[locationName]
  }

  /**
   * Validate that the scenario respects the user's location intent
   */
  static validateLocationRespect(scenario: GameScenario, originalLocations: string[]): boolean {
    if (originalLocations.length === 0) return true

    const scenarioLocation = scenario.location.name.toLowerCase()
    const originalLocationNames = originalLocations.map(loc => loc.toLowerCase())

    // Check if the scenario location matches any of the original locations
    return originalLocationNames.some(loc => 
      scenarioLocation.includes(loc) || loc.includes(scenarioLocation)
    )
  }
}