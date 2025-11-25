
import { useCallback, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export type FoodItem = {
  name: string;
  portion_size_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
};

export type FoodAnalysisResult = {
  foods: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  duration_ms: number;
};

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: FoodAnalysisResult; error: null }
  | { status: 'error'; data: null; error: string };

export function useFoodAnalysis() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  const analyzeFood = useCallback(async (imageUri: string): Promise<FoodAnalysisResult | null> => {
    setState({ status: 'loading', data: null, error: null });

    try {
      // Convert image URI to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(blob);
      const imageBase64 = await base64Promise;

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { imageBase64 },
      });

      if (error) {
        const message = error.message || 'Analysis failed';
        throw new Error(message);
      }

      const result = data as FoodAnalysisResult;
      setState({ status: 'success', data: result, error: null });
      return result;
    } catch (err: any) {
      const message = err?.message ?? 'Unknown error occurred';
      setState({ status: 'error', data: null, error: message });
      return null;
    }
  }, []);

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;
  const data = state.status === 'success' ? state.data : null;

  return { analyzeFood, loading, error, data, reset };
}
