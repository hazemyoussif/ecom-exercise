import { useCallback } from 'react';
import { useBundle } from './useBundle';

export function useAccordion() {
  const { bundle, nextStep, previousStep, setActiveStep } = useBundle();

  const openStep = useCallback((step: number) => {
    setActiveStep(step);
  }, [setActiveStep]);

  return {
    activeStep: bundle.activeStep,
    nextStep,
    previousStep,
    openStep,
  };
}