import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ number: string; title: string }>;
  onStepClick?: (stepIndex: number) => void;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      {/* Visual Step Dots and Lines */}
      <div className="flex items-center justify-between relative">
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isClickable = stepNum < currentStep && onStepClick;

          return (
            <React.Fragment key={s.number}>
              {/* Step indicator node */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(stepNum)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 select-none ${
                    isCompleted
                      ? 'bg-[#141416] text-[#FAF9F5] shadow-xs cursor-pointer hover:bg-[#252529]'
                      : isCurrent
                      ? 'bg-[#FAF9F5] text-[#141416] ring-2 ring-[#8EA633] ring-offset-2 ring-offset-[#FAF9F5] shadow-sm font-extrabold'
                      : 'bg-[#FAF9F5] text-[#888894] border border-[rgba(20,20,22,0.14)] cursor-not-allowed opacity-75'
                  }`}
                  aria-label={`Step ${s.number}: ${s.title}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-[#8EA633]" />
                  ) : (
                    <span>{s.number}</span>
                  )}
                </button>

                {/* Desktop step title label */}
                <span
                  className={`hidden md:block mt-1.5 text-[11px] font-medium transition-colors text-center whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#141416] font-bold'
                      : isCompleted
                      ? 'text-[#575762]'
                      : 'text-[#888894]'
                  }`}
                >
                  {s.title}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 h-[2px] bg-[rgba(20,20,22,0.08)] relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-[#141416] transition-all duration-300 origin-left"
                    style={{
                      transform: stepNum < currentStep ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Title display */}
      <div className="block md:hidden text-center mt-3">
        <span className="text-xs font-semibold text-[#8EA633] uppercase tracking-wider">
          Step {steps[currentStep - 1]?.number}
        </span>
        <h3 className="text-sm font-bold text-[#141416]">
          {steps[currentStep - 1]?.title}
        </h3>
      </div>
    </div>
  );
};
