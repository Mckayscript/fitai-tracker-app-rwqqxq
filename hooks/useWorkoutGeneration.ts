
import { useCallback, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
};

export type DaySchedule = {
  day: string;
  focus: string;
  exercises: Exercise[];
};

export type WorkoutRoutine = {
  goal: string;
  daysPerWeek: number;
  sessionDuration: number;
  weeklySchedule: DaySchedule[];
  tips: string[];
  progressionPlan: string;
};

export type WorkoutResponse = {
  routine: WorkoutRoutine;
  generatedAt: string;
};

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: WorkoutResponse; error: null }
  | { status: 'error'; data: null; error: string };

export function useWorkoutGeneration() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  const generateRoutine = useCallback(async (
    goal: string,
    fitnessLevel?: string,
    daysPerWeek?: number,
    sessionDuration?: number
  ): Promise<WorkoutResponse | null> => {
    console.log('Generating workout routine for goal:', goal);
    setState({ status: 'loading', data: null, error: null });

    try {
      const { data, error } = await supabase.functions.invoke('generate-workout-routine', {
        body: { 
          goal,
          fitnessLevel: fitnessLevel || 'Intermediate',
          daysPerWeek: daysPerWeek || 4,
          sessionDuration: sessionDuration || 60
        },
      });

      if (error) {
        const message = error.message || 'Failed to generate workout routine';
        console.error('Workout generation error:', message);
        throw new Error(message);
      }

      const result = data as WorkoutResponse;
      console.log('Workout routine generated successfully');
      setState({ status: 'success', data: result, error: null });
      return result;
    } catch (err: any) {
      const message = err?.message ?? 'Unknown error occurred';
      console.error('Workout generation failed:', message);
      setState({ status: 'error', data: null, error: message });
      return null;
    }
  }, []);

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;
  const data = state.status === 'success' ? state.data : null;

  return { generateRoutine, loading, error, data, reset };
}
