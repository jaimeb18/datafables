const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // "Bella" - warm, friendly female voice

export interface WordTiming {
  word: string;
  start: number;
  end: number;
  charStart: number; // character index in the original text
}

export async function generateSpeech(text: string): Promise<{ audioBuffer: Buffer; words: WordTiming[] }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  const words = buildWordTimings(data.alignment);

  return { audioBuffer, words };
}

function buildWordTimings(alignment: {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}): WordTiming[] {
  const words: WordTiming[] = [];
  let currentWord = "";
  let wordStart = 0;
  let wordCharStart = 0;

  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i];
    if (char === " " || char === "\n") {
      if (currentWord) {
        words.push({
          word: currentWord,
          start: wordStart,
          end: alignment.character_end_times_seconds[i - 1],
          charStart: wordCharStart,
        });
        currentWord = "";
      }
    } else {
      if (!currentWord) {
        wordStart = alignment.character_start_times_seconds[i];
        wordCharStart = i;
      }
      currentWord += char;
    }
  }
  if (currentWord) {
    words.push({
      word: currentWord,
      start: wordStart,
      end: alignment.character_end_times_seconds[alignment.characters.length - 1],
      charStart: wordCharStart,
    });
  }
  return words;
}
