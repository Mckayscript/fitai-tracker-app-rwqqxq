
import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export type ContentGenerationParams = {
  prompt: string;
  contentType?: 'workout' | 'meal-plan' | 'motivation' | 'tips' | 'custom';
  system?: string;
  temperature?: number;
  max_tokens?: number;
  format?: 'text' | 'markdown' | 'json';
  model?: string;
};

export type ContentGenerationResult = {
  url: string;
  path: string;
  duration_ms: number;
  model: string;
  input_images: number;
  tokens?: { prompt?: number; completion?: number; total?: number };
  format?: string;
  content?: string;
};

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: ContentGenerationResult; error: null }
  | { status: 'error'; data: null; error: string };

const SYSTEM_PROMPTS = {
  workout: 'You are a professional fitness trainer. Generate detailed, safe, and effective workout content. Include proper form instructions and safety tips.',
  'meal-plan': 'You are a certified nutritionist. Generate healthy, balanced meal plans with nutritional information. Consider dietary restrictions and fitness goals.',
  motivation: 'You are a motivational fitness coach. Generate inspiring, encouraging content that motivates people to achieve their fitness goals.',
  tips: 'You are a fitness and wellness expert. Generate practical, actionable tips for health, fitness, and wellness.',
  custom: 'You are a helpful fitness and wellness assistant. Provide accurate, helpful information.',
};

export function useContentGeneration() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });
  const [generatedText, setGeneratedText] = useState<string>('');
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    console.log('Content generation: Resetting state');
    setState({ status: 'idle', data: null, error: null });
    setGeneratedText('');
  }, []);

  const abort = useCallback(() => {
    console.log('Content generation: Aborting request');
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const generate = useCallback(async (params: ContentGenerationParams): Promise<ContentGenerationResult | null> => {
    const prompt = (params.prompt ?? '').trim();
    if (prompt.length < 3) {
      console.log('Content generation: Prompt too short');
      setState({ status: 'error', data: null, error: 'Prompt must be at least 3 characters.' });
      return null;
    }

    console.log('Content generation: Starting generation with params:', {
      contentType: params.contentType,
      promptLength: prompt.length,
      model: params.model || 'gpt-4o',
    });

    setState({ status: 'loading', data: null, error: null });
    setGeneratedText('');

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      // Get system prompt based on content type
      const systemPrompt = params.system || SYSTEM_PROMPTS[params.contentType || 'custom'];

      console.log('Content generation: Invoking generate-text function');
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: {
          prompt,
          system: systemPrompt,
          temperature: params.temperature ?? 0.7,
          max_tokens: params.max_tokens ?? 1000,
          format: params.format ?? 'markdown',
          model: params.model ?? 'gpt-4o',
        },
      });

      if (error) {
        console.error('Content generation: Function error:', error);
        throw new Error(error.message || 'Function error');
      }

      console.log('Content generation: Success, fetching generated text');
      const result = data as ContentGenerationResult;

      // Fetch the generated text from the URL
      const textResponse = await fetch(result.url);
      const text = await textResponse.text();
      
      console.log('Content generation: Text fetched, length:', text.length);
      setGeneratedText(text);

      const resultWithContent = { ...result, content: text };
      setState({ status: 'success', data: resultWithContent, error: null });
      return resultWithContent;
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        console.log('Content generation: Request aborted');
        return null;
      }
      console.error('Content generation: Error:', e?.message);
      setState({ status: 'error', data: null, error: e?.message ?? 'Unknown error' });
      return null;
    } finally {
      abortRef.current = null;
    }
  }, []);

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;
  const data = state.status === 'success' ? state.data : null;

  return { generate, loading, error, data, generatedText, reset, abort };
}
