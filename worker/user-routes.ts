import { Hono } from "hono";
// Define the environment bindings, including the Gemini API key secret
interface Env {
  GEMINI_API_KEY: string;
}
// Define the structure for the Gemini API response
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/translate', async (c) => {
    const apiKey = c.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set.');
      return c.json({ success: false, error: 'Server configuration error: Missing API key.' }, 500);
    }
    try {
      const formData = await c.req.formData();
      const file = formData.get('file');
      const direction = formData.get('direction');
      if (!(file instanceof File)) {
        return c.json({ success: false, error: 'File is required.' }, 400);
      }
      if (direction !== 'en-id' && direction !== 'id-en') {
        return c.json({ success: false, error: 'Valid translation direction is required.' }, 400);
      }
      const sourceLanguage = direction === 'en-id' ? 'English' : 'Indonesian';
      const targetLanguage = direction === 'en-id' ? 'Indonesian' : 'English';
      const fileContent = await file.text();
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Preserve the original formatting, including line breaks, paragraphs, and spacing, as closely as possible. Do not add any extra commentary, introductory text, or explanations. Only provide the translated text.\n\n---\n\n${fileContent}`;
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      const geminiResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      if (!geminiResponse.ok) {
        const errorBody = await geminiResponse.text();
        console.error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}`, errorBody);
        return c.json({ success: false, error: 'Failed to communicate with the translation service.' }, 502);
      }
      const result = await geminiResponse.json<GeminiResponse>();
      const translatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!translatedText) {
        console.error('Invalid response structure from Gemini API:', result);
        return c.json({ success: false, error: 'Failed to parse the translation response.' }, 500);
      }
      const translatedFileName = `translated_${file.name}`;
      return new Response(translatedText, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${translatedFileName}"`,
        },
      });
    } catch (error) {
      console.error('Translation endpoint error:', error);
      return c.json({ success: false, error: 'An unexpected error occurred while processing your request.' }, 500);
    }
  });
}