# StreetView Explorer Game

A Next.js application that generates custom streetview scenarios based on user prompts, with intelligent location parsing that respects user-specified locations.

## 🎯 Linear Issue Resolution

**Issue:** [MAPHUNT-3] - "Prompt for specific location in generation"

**Solution:** The scenario generator AI now intelligently parses and respects specific locations mentioned in user prompts, ensuring that generated scenarios incorporate the user's intended locations.

## ✨ Features

- **Intelligent Location Parsing**: Extracts cities, countries, landmarks, and regions from natural language prompts
- **Location-Aware Scenario Generation**: Creates scenarios that respect and incorporate user-specified locations
- **Real-time Location Detection**: Shows detected locations as users type their prompts
- **Comprehensive Location Database**: Supports major cities, countries, landmarks, and regions worldwide
- **Dynamic Difficulty Adjustment**: Adjusts challenge difficulty based on location specificity
- **Context-Aware Hints**: Provides location-specific hints and cultural context

## 🚀 How It Works

### Location Parsing Engine (`/lib/locationParser.ts`)

The location parser uses multiple strategies to extract locations from user prompts:

1. **Pattern Matching**: Recognizes location indicators like "in Tokyo", "near the Eiffel Tower", "around Paris"
2. **Known Location Validation**: Cross-references against a comprehensive database of cities, countries, and landmarks
3. **Contextual Analysis**: Calculates confidence scores based on context and location indicators
4. **Multi-word Support**: Handles complex location names like "New York", "Times Square", "Big Ben"

### Scenario Generator (`/lib/scenarioGenerator.ts`)

The scenario generator creates engaging challenges that incorporate user-specified locations:

1. **Location Prioritization**: Selects primary location from user input (landmarks > cities > countries)
2. **Context-Aware Generation**: Uses location-specific features and cultural context
3. **Scenario Type Detection**: Analyzes prompts to determine challenge type (exploration, cultural, architectural)
4. **Dynamic Content**: Generates titles, descriptions, and hints tailored to specific locations

## 📝 Usage Examples

### Example 1: Specific City
```
Input: "Create a challenge in Tokyo, Japan focusing on traditional temples"
Output: 
- Detected Locations: Tokyo, Japan
- Generated Scenario: "Explore the Streets of Tokyo" with Japan-specific hints
```

### Example 2: Famous Landmark
```
Input: "I want to explore near the Eiffel Tower in Paris"
Output:
- Detected Locations: Eiffel Tower, Paris  
- Generated Scenario: "Cultural Journey Through Eiffel Tower" with Parisian context
```

### Example 3: Multiple Locations
```
Input: "Show me the architecture around Times Square and Central Park"
Output:
- Detected Locations: Times Square, Central Park
- Generated Scenario: Focuses on primary location with architectural emphasis
```

## 🧪 Testing

The implementation has been thoroughly tested with various location-specific prompts:

- ✅ City and country combinations ("Tokyo, Japan")
- ✅ Landmark-specific requests ("near the Eiffel Tower")  
- ✅ Multiple location handling ("Times Square and Central Park")
- ✅ Cultural and architectural prompts
- ✅ Edge cases (no locations, unknown locations)

## 🏗️ Technical Implementation

### Core Components

- **`StreetViewGame.tsx`**: Main game interface with real-time location detection
- **`LocationParser`**: Advanced location extraction and validation engine
- **`ScenarioGenerator`**: Context-aware scenario creation system
- **UI Components**: Modern, responsive interface built with Radix UI and Tailwind CSS

### Key Features

1. **Real-time Location Detection**: Shows detected locations as users type
2. **Intelligent Fallbacks**: Handles unknown locations gracefully
3. **Confidence Scoring**: Validates location matches with confidence metrics
4. **Cultural Context**: Incorporates location-specific cultural and architectural features
5. **Extensible Design**: Easy to add new locations and scenario types

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 How to Use

1. **Enter a Prompt**: Describe the type of challenge you want and mention specific locations
2. **Review Detected Locations**: The system will highlight locations it found in your prompt
3. **Generate Scenario**: Click "Generate Scenario" to create a custom challenge
4. **Explore**: Use the generated hints and context to explore the virtual location

## 🔧 Configuration

The system can be extended by:

- Adding new locations to `LocationParser.KNOWN_LOCATIONS`
- Creating location-specific contexts in `ScenarioGenerator.LOCATION_CONTEXTS`
- Adding new scenario templates in `SCENARIO_TEMPLATES`

## 📊 Supported Locations

- **Major Cities**: Tokyo, Paris, London, New York, Rome, Berlin, and 50+ more
- **Countries**: Japan, France, Germany, Italy, Spain, United States, and 30+ more  
- **Landmarks**: Eiffel Tower, Times Square, Big Ben, Colosseum, and 20+ more
- **Regions**: US States, European regions, and major metropolitan areas

## 🎯 Linear Issue Status

✅ **RESOLVED**: The scenario generator AI now successfully respects and incorporates specific locations mentioned in user prompts, fully addressing the requirements of MAPHUNT-3.