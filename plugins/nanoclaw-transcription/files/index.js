import fs from 'fs';
import path from 'path';

function readEnvKey(key) {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      if (trimmed.slice(0, eq).trim() !== key) continue;
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      return val || undefined;
    }
  } catch { /* .env not found */ }
  return undefined;
}

async function transcribeWithOpenAI(audioPath, apiKey) {
  const openaiModule = await import('openai');
  const OpenAI = openaiModule.default;
  const { toFile } = openaiModule;

  const openai = new OpenAI({ apiKey });
  const buffer = fs.readFileSync(audioPath);
  const file = await toFile(buffer, 'voice.ogg', { type: 'audio/ogg' });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'text',
  });

  return /** @type {string} */ (transcription);
}

const FALLBACK = '[Voice Message - transcription unavailable]';

/**
 * onInboundMessage hook — transcribe voice notes from any channel.
 * Channel plugins set mediaType='audio' and mediaHostPath for audio messages.
 */
export async function onInboundMessage(msg, channel) {
  if (msg.mediaType !== 'audio' || !msg.mediaHostPath) return msg;
  if (!fs.existsSync(msg.mediaHostPath)) return msg;

  const apiKey = process.env.OPENAI_API_KEY || readEnvKey('OPENAI_API_KEY');
  if (!apiKey) {
    msg.content = msg.content ? `${msg.content}\n${FALLBACK}` : FALLBACK;
    return msg;
  }

  try {
    const transcript = await transcribeWithOpenAI(msg.mediaHostPath, apiKey);

    if (transcript) {
      const trimmed = transcript.trim();
      msg.content = msg.content.replace(/\[audio: [^\]]+\]/, `[Voice: ${trimmed}]`);
    } else {
      msg.content = msg.content ? `${msg.content}\n${FALLBACK}` : FALLBACK;
    }
  } catch (err) {
    console.error('Transcription plugin error:', err);
    msg.content = msg.content
      ? `${msg.content}\n[Voice Message - transcription failed]`
      : '[Voice Message - transcription failed]';
  }

  return msg;
}
