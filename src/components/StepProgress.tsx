import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepProgressProps {
    currentStep: number;
    steps: string[];
}

const StepProgress = ({ currentStep, steps }: StepProgressProps) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Steps */}
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center relative z-10">
                            {/* Step Circle */}
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border-2 transition-colors ${isCompleted
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : isCurrent
                                            ? "bg-background border-primary text-primary"
                                            : "bg-background border-border text-muted-foreground"
                                    }`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span>{stepNumber}</span>
                                )}
                            </motion.div>

                            {/* Step Label */}
                            <motion.p
                                className={`mt-2 text-xs font-medium text-center max-w-[100px] ${isCurrent
                                        ? "text-primary"
                                        : isCompleted
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    }`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.1 }}
                            >
                                {step}
                            </motion.p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepProgress;
