
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
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
// import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useNavigationGuard } from '@/hooks/useNavigationGuard';

// Define all steps in the booking process
const STEPS = [
  { id: "tripSelection", label: "Trip Details" },
  { id: "busSelection", label: "Select Bus" },
  { id: "seatSelection", label: "Choose Seats" },
  { id: "passengerInfo", label: "Passenger Details" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" }
];


  const slides = [
    {
      image: "/cm1.jpeg",
      alt: "Corpers Drive luxury bus"
    },
    {
      image: "/cm2.jpeg",
      alt: "NYSC corps members traveling"
    },
    {
      image: "/cm2.jpeg",
      alt: "Modern transportation hub"
    }
  ];

const BookingWizard = () => {
  const navigate = useNavigate();
  // const [currentStep, setCurrentStep] = useState(0);
  const currentStep = useBookingStore((state) => state.currentStep);
  const setCurrentStep = useBookingStore((state) => state.setCurrentStep);
  // Remove: const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState<Record<string, boolean>>({});
  const [showRestrictedDialog, setShowRestrictedDialogue] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);

  const { 
    departure, 
    destination, 
    date, 
    hasSubmittedPassengerData, 
    resetForm 
  } = useBookingStore();

  console.log("departure:", departure, "destination:", destination, "date:", date, "hasSubmittedPassengerData:", hasSubmittedPassengerData);
  


  // Prevent navigation when passenger data has been submitted
  useNavigationGuard({
    shouldPrevent: hasSubmittedPassengerData && currentStep < STEPS.length - 1,
    message: "Your booking is in progress. Leaving now will lose your progress.",
    onNavigationAttempt: () => setShowNavigationWarning(true)
  });


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
    // 1️⃣ Block if passenger data has been submitted and we’re on or before step 3
    if (hasSubmittedPassengerData && currentStep <= 3) {
      setShowRestrictedDialogue(true);
      return;
    }

    // 2️⃣ Otherwise, navigate as normal
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      // If at first step, go back to home
      navigate("/");
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (hasSubmittedPassengerData && stepIndex < 4 ) {
      setShowRestrictedDialogue(true);
      return;
    }

  // Allow navigation to completed steps only
  if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };

  const handleForceNavigation = () => {
    resetForm();
    setShowNavigationWarning(false);
    navigate("/");
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
    <div className="max-w-4xl mx-auto">
      
      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-gray-400"}
                ${hasSubmittedPassengerData && index < 4 ? "cursor-not-allowed opacity-60" : ""}
                `}
                onClick={() => handleStepClick(index)}
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

      {/* Progress Protection Warning */}
      {hasSubmittedPassengerData && currentStep !== STEPS.length - 1 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Booking in Progress:</strong> Your passenger information has been saved. 
            Please complete the payment process to secure your booking.
          </p>
        </div>
      )}

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

       {/* Restricted Access Dialog */}
      <AlertDialog open={showRestrictedDialog} onOpenChange={setShowRestrictedDialogue}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changes Not Allowed</AlertDialogTitle>
            <AlertDialogDescription>
              You cannot go back and modify your trip details, bus selection, or seat selection 
              after submitting passenger information. This ensures your booking remains secure 
              and prevents conflicts with seat reservations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowRestrictedDialogue(false)}>
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navigation Warning Dialog */}
      <AlertDialog open={showNavigationWarning} onOpenChange={setShowNavigationWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Booking Process?</AlertDialogTitle>
            <AlertDialogDescription>
              Your booking is in progress and passenger information has been saved. 
              If you leave now, you will lose all progress and need to start over.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowNavigationWarning(false)}>
              Stay and Complete Booking
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleForceNavigation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Leave and Lose Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};



export default BookingWizard;
