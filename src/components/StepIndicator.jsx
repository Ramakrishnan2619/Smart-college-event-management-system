import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => {
        const isCompleted = i + 1 < currentStep;
        const isActive = i + 1 === currentStep;

        return (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                style={{
                  backgroundColor: isCompleted || isActive ? 'var(--accent)' : 'var(--bg-surface)',
                  color: isCompleted || isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isCompleted || isActive ? 'none' : '2px solid var(--border)',
                }}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {isCompleted ? <Check size={18} /> : i + 1}
              </motion.div>
              <span
                className="text-xs mt-2 font-medium whitespace-nowrap"
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 h-0.5 mx-2 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: isCompleted ? 'var(--accent)' : 'var(--border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
