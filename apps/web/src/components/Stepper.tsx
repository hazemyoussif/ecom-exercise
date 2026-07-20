import { Minus, Plus } from 'lucide-react';
import './Stepper.css';

type StepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canDecrement?: boolean;
  compact?: boolean;
};

export default function Stepper({ value, onIncrement, onDecrement, canDecrement = value > 0, compact = false }: StepperProps) {
  return (
    <div className={`stepper ${compact ? 'stepper--compact' : 'stepper--regular'}`}>
      <button onClick={onDecrement} disabled={!canDecrement} className="stepper__button" type="button">
        <Minus size={10} className="text-[#6f7882]" />
      </button>
      <span className={`stepper__value ${compact ? 'stepper__value--compact' : 'stepper__value--regular'}`}>{value}</span>
      <button onClick={onIncrement} className="stepper__button stepper__button--secondary" type="button">
        <Plus size={10} className="text-[#525963]" />
      </button>
    </div>
  );
}