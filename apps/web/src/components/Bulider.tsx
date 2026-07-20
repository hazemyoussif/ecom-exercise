import { useMemo } from 'react';
import StepComponent from './Step';
import iconCamera from '../assets/icons/camera-icon.svg';
import iconShield from '../assets/icons/shield-icon.svg';
import iconSensors from '../assets/icons/sensors-icon.svg';
import iconProtection from '../assets/icons/protection-icon.svg';
import { useAccordion } from '../hooks/useAccordion';
import { useBundle } from '../hooks/useBundle';

const steps = [
  { id: 'cameras', title: 'Choose your cameras', icon: iconCamera, label: '1' },
  { id: 'plan', title: 'Choose your plan', icon: iconShield, label: '2' },
  { id: 'sensors', title: 'Choose your sensors', icon: iconSensors, label: '3' },
  { id: 'protection', title: 'Add extra protection', icon: iconProtection, label: '4' },
];

const Builder = () => {
  const { products } = useBundle();
  const { activeStep, nextStep, openStep } = useAccordion();

  const productsByCategory = useMemo(
    () => new Map(steps.map((step) => [step.id, products.filter((product) => product.categoryId === step.id)])),
    [products],
  );

  return (
    <div className="builder-div">
      {steps.map((step, index) => (
        <StepComponent
          key={step.id}
          index={index}
          step={step}
          stepProducts={productsByCategory.get(step.id) ?? []}
          isOpen={index === activeStep}
          onOpenStep={openStep}
          onNextStep={nextStep}
          nextStepTitle={steps[index + 1]?.title}
        />
      ))}
    </div>
  );
};

export default Builder;