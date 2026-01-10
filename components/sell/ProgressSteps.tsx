import { Check } from "lucide-react";

interface ProgressStepsProps {
    currentStep: number;
}

const steps = [
    { num: 1, label: "Details" },
    { num: 2, label: "Pricing" },
    { num: 3, label: "Photos" },
    { num: 4, label: "Review" }
];

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
    return (
        <div className="mb-10">
            <div className="flex justify-center items-center">
                {steps.map((stepInfo, index) => (
                    <div key={stepInfo.num} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep > stepInfo.num
                                        ? 'bg-green-600 text-white'
                                        : currentStep === stepInfo.num
                                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {currentStep > stepInfo.num ? <Check className="w-5 h-5" /> : stepInfo.num}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= stepInfo.num ? 'text-gray-900' : 'text-gray-400'}`}>
                                {stepInfo.label}
                            </span>
                        </div>
                        {index < 3 && (
                            <div className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all duration-300 ${currentStep > stepInfo.num ? 'bg-green-600' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}