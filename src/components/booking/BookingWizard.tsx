
import { useState, useEffect } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import TripSelection from "./steps/TripSelection";
import BusSelection from "./steps/BusSelection";
import SeatSelection from "./steps/SeatSelection";
import PassengerInfo from "./steps/PassengerInfo";
import Payment from "./steps/Payment";
import Confirmation from "./steps/Confirmation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

// Define all steps in the booking process
const STEPS = [
  { id: "tripSelection", label: "Trip Details" },
  { id: "busSelection", label: "Select Bus" },
  { id: "seatSelection", label: "Choose Seats" },
  { id: "passengerInfo", label: "Passenger Details" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" }
];

const BookingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState<Record<string, boolean>>({});
  const { departure, destination, date } = useBookingStore();

  // Check if initial booking data exists when component mounts
  useEffect(() => {
    // If the user navigated from the homepage with pre-filled data
    if (departure && destination && date) {
      // Mark the first step as complete since we have this data
      setIsCompleted(prev => ({ ...prev, tripSelection: true }));
    }
  }, [departure, destination, date]);

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // Mark the current step as completed
      setIsCompleted(prev => ({ ...prev, [STEPS[currentStep].id]: true }));
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      // If at first step, go back to home
      navigate("/");
    }
  };

  // Update step complete status
  const setStepComplete = (stepId: string, isComplete: boolean) => {
    setIsCompleted(prev => ({ ...prev, [stepId]: isComplete }));
  };

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TripSelection onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case 1:
        return <BusSelection onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case 2:
        return <SeatSelection onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case 3:
        return <PassengerInfo onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case 4:
        return <Payment onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case 5:
        return <Confirmation />;
      default:
        return null;
    }
  };

  // Determine if the next button should be disabled
  const isNextDisabled = !isCompleted[STEPS[currentStep]?.id];
  
  // Hide navigation buttons on confirmation step
  const showNavButtons = currentStep !== STEPS.length - 1;

  return (
    <div className="max-w-4xl mx-auto ">
      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-gray-400"}`}
              >
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-1
                    ${index < currentStep ? "bg-primary text-white" : 
                      index === currentStep ? "border-2 border-primary text-primary" : 
                      "border-2 border-gray-300 text-gray-400"}
                  `}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span className="text-xs font-medium">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div 
                  className={`w-12 h-0.5 mx-1 ${
                    index < currentStep ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {showNavButtons && (
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={goToPrevStep}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {currentStep === 0 ? "Back to Home" : "Previous"}
          </Button>
          
          <Button 
            onClick={goToNextStep} 
            disabled={isNextDisabled}
            className="flex items-center"
          >
            {STEPS[currentStep + 1]?.label || "Next"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
