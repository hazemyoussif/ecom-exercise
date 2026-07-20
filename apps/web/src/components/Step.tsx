import type { Product, Step } from '../types';
import ProductCard from './ProductCard';
import { Triangle } from 'lucide-react';
import './Step.css';
import { useSelectedCount } from '../hooks/useSelectedCount';

interface StepProps {
  index: number;
  step: Step;
  stepProducts: Product[];
  isOpen: boolean;
  onOpenStep: (step: number) => void;
  onNextStep: () => void;
  nextStepTitle?: string;
}

const StepComponent = ({ index, step, stepProducts, isOpen, onOpenStep, onNextStep, nextStepTitle }: StepProps) => {
  const selectionCount = useSelectedCount(step.id);

  return (
    <div className={`step-div ${isOpen ? 'opened-step' : 'closed-step'}`}>
      <div  className="header" onClick={() => onOpenStep(index)}>STEP {step.label} OF 4</div>
      <div className="content">
        <div className="title-bar">
          <div className="title"><img width="26" height="26" src={step.icon} alt={step.title} /><div>{step.title}</div></div>
          <div className="selection-count" onClick={() => onOpenStep(index)}>
            {selectionCount > 0 && <span className="selected-span">{selectionCount} selected</span>}
            <div className="step-toggle"  aria-label={`Open ${step.title}`}>
              <Triangle size={12} fill="#4F46E5" stroke="" className={`${!isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="step-products">
            {stepProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
      {isOpen && index < 3 && (
        <div className="next-step-div">
          <button className="step-button" type="button" onClick={onNextStep}>Next: {nextStepTitle}</button>
        </div>
      )}
    </div>
  );
};

export default StepComponent;