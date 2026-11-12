import { GoogleGenAI } from '@google/genai';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/AppError';
import { logger } from '../../../utils/logger';

export interface GenerateTextOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * GeminiService provides foundational access to Google Gemini models
 * for text generation, translation, and craft content assistance.
 */
export class GeminiService {
  public static readonly DEFAULT_MODEL = 'gemini-2.5-flash';

  private static client: GoogleGenAI | null = null;

  /**
   * Lazily initializes and returns the GoogleGenAI client singleton.
   * Throws AppError(503) if GEMINI_API_KEY is not configured.
   */
  public static getClient(): GoogleGenAI {
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      throw new AppError('Gemini API is not configured on the server.', 503);
    }

    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey });
    }

    return this.client;
  }

  /**
   * Sets or overrides the GoogleGenAI client instance (useful for unit testing and mocking).
   */
  public static setClient(client: GoogleGenAI | null): void {
    this.client = client;
  }

  /**
   * Generates text using the configured Gemini model.
   *
   * @param prompt The input text prompt to send to Gemini
   * @param options Optional generation parameters (model, system instruction, temperature)
   * @returns Clean generated text string
   */
  public static async generateText(
    prompt: string,
    options?: GenerateTextOptions,
  ): Promise<string> {
    if (!prompt || prompt.trim() === '') {
      throw new AppError('Prompt cannot be empty.', 400);
    }

    const client = this.getClient();
    const model = options?.model || this.DEFAULT_MODEL;

    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt.trim(),
        config: {
          systemInstruction: options?.systemInstruction,
          temperature: options?.temperature,
          maxOutputTokens: options?.maxOutputTokens,
        },
      });

      const text = response.text?.trim();

      if (!text || text.length === 0) {
        throw new AppError('Gemini returned an empty response. Please try again.', 502);
      }

      return text;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      const rawMessage = error instanceof Error ? error.message : String(error);
      const sanitizedMessage = this.sanitize(rawMessage);

      logger.error(`Gemini generation failed: ${sanitizedMessage}`);

      // Handle rate limits (HTTP 429 / RESOURCE_EXHAUSTED / quota)
      if (
        sanitizedMessage.includes('429') ||
        sanitizedMessage.includes('RESOURCE_EXHAUSTED') ||
        sanitizedMessage.toLowerCase().includes('quota')
      ) {
        throw new AppError(
          'Gemini rate limit exceeded. Please wait a moment and try again.',
          429,
        );
      }

      // Handle service availability / timeouts (HTTP 503 / UNAVAILABLE / overloaded)
      if (
        sanitizedMessage.includes('503') ||
        sanitizedMessage.includes('UNAVAILABLE') ||
        sanitizedMessage.toLowerCase().includes('overloaded')
      ) {
        throw new AppError(
          'Gemini service is temporarily unavailable. Please try again shortly.',
          503,
        );
      }

      // Handle authentication or permission errors
      if (
        sanitizedMessage.includes('401') ||
        sanitizedMessage.includes('403') ||
        sanitizedMessage.includes('PERMISSION_DENIED') ||
        sanitizedMessage.toLowerCase().includes('api key')
      ) {
        throw new AppError(
          'Gemini API authentication failed. Please check server configuration.',
          502,
        );
      }

      // General provider error fallback
      throw new AppError('Failed to generate response from Gemini API.', 502);
    }
  }

  /**
   * Sanitizes strings to ensure the API key is never exposed in logs or errors.
   */
  private static sanitize(text: string): string {
    const key = env.GEMINI_API_KEY;
    if (!key || key.trim() === '') {
      return text;
    }
    return text.replaceAll(key, '[REDACTED_API_KEY]');
  }
}
