![DataFables Banner](public/banner.png)

# DataFables
AI-powered personalized storybook platform for children, combining Gemini generative AI with ElevenLabs narration and real-time safety moderation.

Built for kids aged 2–10. Every story is unique, illustrated, narrated, and safe.

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js) ![Gemini](https://img.shields.io/badge/Gemini-4285F4?logo=google) ![ElevenLabs](https://img.shields.io/badge/ElevenLabs-000?logo=elevenlabs) ![Snowflake](https://img.shields.io/badge/Snowflake-29B5E8?logo=snowflake) ![Hacklytics 2026](https://img.shields.io/badge/Hacklytics-2026-purple)

---

## Overview

DataFables lets children design their own character, choose a story topic and age group, and instantly receive a personalized multi-page storybook — complete with AI-generated illustrations and professional narration. Every story is automatically screened for child safety before being shown.

---

## Key Features

- **Personalized stories**: Gemini generates unique multi-page stories based on topic, age group, and custom character
- **Pixel art character designer**: Customize hair, skin tone, outfit, shoes, and accessories
- **AI narration**: ElevenLabs reads every page aloud in a natural voice
- **Child safety**: Every story is screened by SafetyKit before display
- **Similar stories**: Actian VectorAI surfaces related story recommendations
- **Achievement system**: Kids earn XP, coins, and badges as they read
- **Shop**: Spend coins to unlock new character items
- **Multilingual**: Full UI support for 10 languages
- **Snowflake integration**: Story data and facts stored and retrieved via Snowflake Cortex

---

## Live Demo

```bash
git clone https://github.com/jaimeb18/datafables
cd datafables
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | Full-stack React framework |
| **Google Gemini** | Story generation + illustration |
| **ElevenLabs** | Text-to-speech narration |
| **Snowflake** | Data storage + Cortex AI fact retrieval |
| **SafetyKit** | Child safety content moderation |
| **Actian VectorAI** | Vector similarity search for story recommendations |
| **Tailwind CSS** | Styling |
| **TypeScript** | Type safety |

---

## How It Works

### Story Generation Flow
1. **Design**: User customizes their character (hair, skin, outfit, accessories)
2. **Configure**: Choose a topic, age group, and language
3. **Generate**: Gemini writes a multi-page branching story + illustrations in parallel
4. **Safety check**: SafetyKit screens all content before display
5. **Narrate**: ElevenLabs voices each page on demand
6. **Store**: Story metadata saved to Snowflake + Actian for future recommendations

### Safety Pipeline
Every story goes through SafetyKit's content moderation API before being shown to the user. If no SafetyKit key is available, a Gemini-based fallback safety check is used. A safety badge is displayed on every story showing the safety score.

### Similar Stories (Actian VectorAI)
Story titles and topics are embedded using `sentence-transformers` and stored in Actian VectorAI DB. When a story ends, the top 3 most similar stories are surfaced via vector similarity search, with match percentages shown.

---

## Project Structure

```
datafables/
├── app/
│   ├── api/
│   │   ├── generate/        # Story + image generation endpoint
│   │   ├── narrate/         # ElevenLabs TTS endpoint
│   │   └── recommend/       # Actian similar stories endpoint
│   └── page.tsx             # Main app page
├── components/
│   ├── StoryForm.tsx         # Character designer + story config
│   ├── StoryDisplay.tsx      # Multi-page story viewer
│   ├── AchievementPanel.tsx  # Achievement tracker
│   ├── ShopPanel.tsx         # Coin shop
│   └── SimilarStories.tsx    # Actian-powered recommendations
├── lib/
│   ├── achievements.ts       # XP, coins, level system
│   ├── actian.ts             # Actian VectorAI client
│   ├── safetykit.ts          # SafetyKit + Gemini fallback
│   └── shop.ts               # Shop items + purchase logic
├── python/
│   ├── actian_server.py      # FastAPI proxy for Actian gRPC
│   └── docker-compose.yml    # Actian VectorAI DB container
└── public/
    ├── achievements/         # Achievement badge images
    └── magic-ball.png        # Loading animation
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- API keys (see below)

### Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=DATAFABLES
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SAFETYKIT_API_KEY=your_safetykit_key
ACTIAN_PROXY_URL=http://localhost:8001
```

### Running Actian (optional)

```bash
cd python
docker compose up -d
pip install -r requirements.txt
uvicorn actian_server:app --port 8001
```

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

---

## Achievement System

| Achievement | Requirement | XP |
|---|---|---|
| First Story | Generate your first story | 10 XP |
| Bookworm | Read 5 stories | 25 XP |
| Word Wizard | Read 10 stories | 50 XP |
| Character Designer | Customize a character | 15 XP |
| Story Marathon | Generate 3 stories in one session | 40 XP |

---

## Team

**Hacklytics 2026 — Georgia Tech**

- [@luanamaldaner](https://github.com/luanamaldaner)
- [@NicolasMurg](https://github.com/NicolasMurg)
- [@jaimeb18](https://github.com/jaimeb18)
- [@viv2612](https://github.com/viv2612)

---

## License

MIT License — Built for Hacklytics 2026
