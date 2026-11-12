import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ZodError } from 'zod';
import {
  productTextGenerationBodySchema,
  translationBodySchema,
  generalPromptBodySchema,
  languageSchema,
} from './ai.validator';

describe('AI Request Validation Schemas', () => {
  // ─── 1. Product Text Generation Tests ────────────────────────────────────────

  it('1. Validates valid product input successfully with Unicode Indian text', () => {
    const input = {
      productName: 'बनारसी रेशमी साड़ी (Banarasi Silk Saree)',
      description: 'शुद्ध रेशम और सोने की ज़री से हाथ से बुनी गई पारंपरिक साड़ी।',
      keywords: ['handloom', 'banarasi', 'zari', 'silk'],
      category: 'WEAVING_HANDLOOM',
      targetLanguage: 'hi',
      tone: 'storytelling',
    };

    const parsed = productTextGenerationBodySchema.parse(input);
    assert.strictEqual(parsed.productName, input.productName);
    assert.strictEqual(parsed.targetLanguage, 'hi');
    assert.strictEqual(parsed.category, 'WEAVING_HANDLOOM');
    assert.strictEqual(parsed.tone, 'storytelling');
  });

  it('2. Rejects empty product description when productName is also missing or empty', () => {
    // Both empty
    assert.throws(
      () => {
        productTextGenerationBodySchema.parse({
          productName: '',
          description: '',
          targetLanguage: 'hi',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        return true;
      },
    );

    // Whitespace-only description with no name
    assert.throws(
      () => {
        productTextGenerationBodySchema.parse({
          description: '      ',
          targetLanguage: 'en',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        return true;
      },
    );
  });

  it('3. Rejects excessively long input for product description and prompt', () => {
    // Excessively long product description (> 3000 chars)
    const longDesc = 'a'.repeat(3001);
    assert.throws(
      () => {
        productTextGenerationBodySchema.parse({
          productName: 'Terracotta Vase',
          description: longDesc,
          targetLanguage: 'en',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        const issues = err.issues.map((i) => i.message);
        assert(issues.some((m) => m.includes('cannot exceed 3000')));
        return true;
      },
    );

    // Excessively long prompt (> 4000 chars)
    const longPrompt = 'x'.repeat(4001);
    assert.throws(
      () => {
        generalPromptBodySchema.parse({
          prompt: longPrompt,
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        const issues = err.issues.map((i) => i.message);
        assert(issues.some((m) => m.includes('cannot exceed 4000')));
        return true;
      },
    );
  });

  // ─── 2. Language Validation Tests ────────────────────────────────────────────

  it('4. Validates valid Hindi and English language selection in various cases', () => {
    assert.strictEqual(languageSchema.parse('hi'), 'hi');
    assert.strictEqual(languageSchema.parse('HI'), 'hi');
    assert.strictEqual(languageSchema.parse('hindi'), 'hi');
    assert.strictEqual(languageSchema.parse('  Hindi  '), 'hi');

    assert.strictEqual(languageSchema.parse('en'), 'en');
    assert.strictEqual(languageSchema.parse('EN'), 'en');
    assert.strictEqual(languageSchema.parse('english'), 'en');
    assert.strictEqual(languageSchema.parse('  English  '), 'en');
  });

  it('5. Rejects unsupported language selection with friendly error', () => {
    assert.throws(
      () => {
        languageSchema.parse('klingon');
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        assert.match(err.issues[0].message, /unsupported language/i);
        return true;
      },
    );

    assert.throws(
      () => {
        languageSchema.parse('xyz123');
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        assert.match(err.issues[0].message, /unsupported language/i);
        return true;
      },
    );
  });

  // ─── 3. Translation Validation Tests ─────────────────────────────────────────

  it('6. Validates a valid translation request', () => {
    const input = {
      sourceText: 'यह हस्तनिर्मित मिट्टी का घड़ा है।',
      sourceLanguage: 'hi',
      targetLanguage: 'en',
    };

    const parsed = translationBodySchema.parse(input);
    assert.strictEqual(parsed.sourceText, input.sourceText);
    assert.strictEqual(parsed.sourceLanguage, 'hi');
    assert.strictEqual(parsed.targetLanguage, 'en');
  });

  it('7. Rejects identical source and target language in translation', () => {
    // Both 'en'
    assert.throws(
      () => {
        translationBodySchema.parse({
          sourceText: 'Handmade pottery pot',
          sourceLanguage: 'en',
          targetLanguage: 'en',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        const issues = err.issues.map((i) => i.message);
        assert(issues.some((m) => m.includes('cannot be the same')));
        return true;
      },
    );

    // 'English' and 'en' (normalized to identical code)
    assert.throws(
      () => {
        translationBodySchema.parse({
          sourceText: 'Handmade pottery pot',
          sourceLanguage: 'English',
          targetLanguage: 'en',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        const issues = err.issues.map((i) => i.message);
        assert(issues.some((m) => m.includes('cannot be the same')));
        return true;
      },
    );
  });

  // ─── 4. General Prompt Validation Tests ──────────────────────────────────────

  it('8. Rejects empty or whitespace-only prompt', () => {
    assert.throws(
      () => {
        generalPromptBodySchema.parse({
          prompt: '',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        const issues = err.issues.map((i) => i.message);
        assert(issues.some((m) => m.includes('cannot be empty')));
        return true;
      },
    );

    assert.throws(
      () => {
        generalPromptBodySchema.parse({
          prompt: '    \n\t   ',
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        const issues = err.issues.map((i) => i.message);
        assert(issues.some((m) => m.includes('cannot be empty')));
        return true;
      },
    );
  });

  it('9. Rejects unexpected unknown fields when strict validation is enabled', () => {
    assert.throws(
      () => {
        generalPromptBodySchema.parse({
          prompt: 'Generate product title',
          unexpectedHax: true,
        });
      },
      (err: unknown) => {
        assert(err instanceof ZodError);
        return true;
      },
    );
  });
});
