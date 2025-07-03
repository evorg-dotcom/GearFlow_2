# React + TypeScript + Vite

# GearFlo - AI-Powered Car Diagnostics

GearFlo is a comprehensive automotive diagnostic platform that combines traditional database-driven diagnostics with cutting-edge AI analysis powered by Google's Gemini AI.

## Features

### Core Diagnostics
- **Manual Diagnostic Tool**: Input vehicle symptoms and get comprehensive analysis
- **OBD-II Integration**: Connect OBD-II scanners for real-time diagnostic data (coming soon)
- **Diagnostic History**: Track and manage all your diagnostic sessions
- **Community Hub**: Share experiences and get help from other automotive enthusiasts

### AI-Powered Analysis (Coming Soon)
- **Gemini AI Integration**: Advanced AI analysis using Google's Gemini 1.5 Flash model
- **Intelligent Diagnostics**: AI-powered insights based on vehicle symptoms and data
- **Risk Assessment**: Safety evaluations and driving recommendations
- **Preventive Maintenance**: AI-suggested maintenance and prevention tips

### Performance Parts Catalog
- **Curated Parts Database**: Verified performance parts from trusted brands
- **Compatibility Matching**: Find parts specific to your vehicle
- **Installation Guides**: Step-by-step installation instructions
- **Retailer Integration**: Direct links to trusted automotive retailers

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Google Gemini 1.5 Flash API
- **Security**: Custom WAF implementation + input validation
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI Studio account (for AI features)

### Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

```env
# Required - Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - AI Features
VITE_GEMINI_API_KEY=your_gemini_api_key

# Development
VITE_APP_ENV=development
VITE_ENABLE_SECURITY_LOGGING=true
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## AI Features Setup

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### AI Analysis Features

- **Rate Limiting**: 10 requests per hour per user
- **Model**: Gemini 1.5 Flash for fast, efficient analysis
- **Safety**: Built-in disclaimers and safety warnings
- **Fallback**: Graceful degradation when AI is unavailable

## Database Schema

The application uses Supabase with the following key tables:
- `profiles` - User profile information
- `diagnostic_issues` - Diagnostic data and history
- `community_posts` - Community forum posts
- `post_replies` - Forum post replies
- `reply_votes` - Voting system for replies

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Web Application Firewall (WAF)**: Custom input validation and threat detection
- **Rate Limiting**: API and feature usage limits
- **Input Sanitization**: Comprehensive input validation
- **CSRF Protection**: Cross-site request forgery prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: The AI analysis feature is in beta and should be used as supplementary information only. Always consult a qualified mechanic for professional diagnosis and repair recommendations.
