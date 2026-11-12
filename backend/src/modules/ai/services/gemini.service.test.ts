import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { GoogleGenAI } from '@google/genai';
import { GeminiService } from './gemini.service';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/AppError';

describe('GeminiService', () => {
  const originalApiKey = env.GEMINI_API_KEY;

  beforeEach(() => {
    // Reset client before each test
    GeminiService.setClient(null);
    (env as { GEMINI_API_KEY?: string }).GEMINI_API_KEY = 'test-dummy-api-key';
  });

  afterEach(() => {
    GeminiService.setClient(null);
    (env as { GEMINI_API_KEY?: string }).GEMINI_API_KEY = originalApiKey;
  });

  it('a. Rejects request with HTTP 503 when GEMINI_API_KEY is missing or empty', async () => {
    (env as { GEMINI_API_KEY?: string }).GEMINI_API_KEY = undefined;
    GeminiService.setClient(null);

    await assert.rejects(
      async () => {
        await GeminiService.generateText('Test prompt');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 503);
        assert.match(err.message, /not configured/i);
        return true;
      },
    );
  });

  it('b. Rejects empty or whitespace-only prompts with HTTP 400', async () => {
    // Empty prompt
    await assert.rejects(
      async () => {
        await GeminiService.generateText('');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 400);
        assert.match(err.message, /cannot be empty/i);
        return true;
      },
    );

    // Whitespace-only prompt
    await assert.rejects(
      async () => {
        await GeminiService.generateText('    \n\t  ');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 400);
        assert.match(err.message, /cannot be empty/i);
        return true;
      },
    );
  });

  it('c. Successfully generates and returns clean text response', async () => {
    const expectedOutput = 'Handcrafted terracotta pottery vase with floral motifs.';

    const mockClient = {
      models: {
        generateContent: async (params: { model: string; contents: string }) => {
          assert.strictEqual(params.model, GeminiService.DEFAULT_MODEL);
          assert.strictEqual(params.contents, 'Create product description');
          return {
            text: `  ${expectedOutput}  \n`,
          };
        },
      },
    } as unknown as GoogleGenAI;

    GeminiService.setClient(mockClient);

    const result = await GeminiService.generateText('Create product description');
    assert.strictEqual(result, expectedOutput);
  });

  it('d. Rejects empty model response with HTTP 502', async () => {
    const mockClient = {
      models: {
        generateContent: async () => {
          return { text: '   ' };
        },
      },
    } as unknown as GoogleGenAI;

    GeminiService.setClient(mockClient);

    await assert.rejects(
      async () => {
        await GeminiService.generateText('Test prompt');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 502);
        assert.match(err.message, /empty response/i);
        return true;
      },
    );
  });

  it('e. Handles Gemini API failures and maps them to appropriate AppError', async () => {
    // 1. Rate limit error (429)
    const rateLimitClient = {
      models: {
        generateContent: async () => {
          throw new Error('429 Too Many Requests: RESOURCE_EXHAUSTED quota exceeded');
        },
      },
    } as unknown as GoogleGenAI;

    GeminiService.setClient(rateLimitClient);

    await assert.rejects(
      async () => {
        await GeminiService.generateText('Test rate limit');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 429);
        assert.match(err.message, /rate limit/i);
        return true;
      },
    );

    // 2. Service unavailable (503)
    const unavailableClient = {
      models: {
        generateContent: async () => {
          throw new Error('503 Service UNAVAILABLE: Model is overloaded');
        },
      },
    } as unknown as GoogleGenAI;

    GeminiService.setClient(unavailableClient);

    await assert.rejects(
      async () => {
        await GeminiService.generateText('Test unavailable');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 503);
        assert.match(err.message, /temporarily unavailable/i);
        return true;
      },
    );

    // 3. Generic failure (502)
    const genericErrorClient = {
      models: {
        generateContent: async () => {
          throw new Error('Internal network socket reset');
        },
      },
    } as unknown as GoogleGenAI;

    GeminiService.setClient(genericErrorClient);

    await assert.rejects(
      async () => {
        await GeminiService.generateText('Test generic failure');
      },
      (err: unknown) => {
        assert(err instanceof AppError);
        assert.strictEqual(err.statusCode, 502);
        assert.match(err.message, /failed to generate response/i);
        return true;
      },
    );
  });
});
