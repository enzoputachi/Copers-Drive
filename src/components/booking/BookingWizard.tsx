import { useState, useEffect } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import TripSelection from "./steps/TripSelection";
import BusSelection from "./steps/BusSelection";
import SeatSelection from "./steps/SeatSelection";
import PassengerInfo from "./steps/PassengerInfo";
import Payment from "./steps/Payment";
import Confirmation from "./steps/Confirmation";
import { ChevronRight, ChevronLeft, CalendarIcon, MapPin, Users } from "lucide-react";
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
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { format } from 'date-fns';

// Define all possible steps
const ALL_STEPS = [
  { id: "tripSelection", label: "Trip Details" },
  { id: "busSelection", label: "Select Bus" },
  { id: "seatSelection", label: "Choose Seats" },
  { id: "passengerInfo", label: "Passenger Details" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" }
];

const BookingWizard = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState<Record<string, boolean>>({});
  const [showRestrictedDialog, setShowRestrictedDialogue] = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [showPaymentBackWarning, setShowPaymentBackWarning] = useState(false);
  const [activeSteps, setActiveSteps] = useState(ALL_STEPS);

  const { 
    departure, 
    destination, 
    date, 
    passengers,
    hasSubmittedPassengerData, 
    resetForm,
    createdAt,
    setCreatedAt,
    currentStep,
    setCurrentStep,
  } = useBookingStore();

  // Determine which steps to show based on whether user came from Hero
  useEffect(() => {
    const hasHeroData = departure && destination && date;
    
    if (hasHeroData) {
      // Skip TripSelection - start from BusSelection
      const stepsWithoutTripSelection = ALL_STEPS.filter(step => step.id !== "tripSelection");
      setActiveSteps(stepsWithoutTripSelection);
      
      // Mark trip selection as completed since we have the data
      setIsCompleted(prev => ({ ...prev, tripSelection: true }));
      
      // Set createdAt if not already set
      if (!createdAt) {
        setCreatedAt(new Date().toISOString());
      }
      
      // Reset current step to 0 (which will be busSelection now)
      if (currentStep === 0) {
        setCurrentStep(0);
      }
    } else {
      // Show all steps including TripSelection
      setActiveSteps(ALL_STEPS);
    }
  }, [departure, destination, date, createdAt, setCreatedAt, currentStep, setCurrentStep]);

  // Prevent navigation when passenger data has been submitted
  useNavigationGuard({
    shouldPrevent: hasSubmittedPassengerData && currentStep < activeSteps.length - 1,
    message: "Your booking is in progress. Leaving now will lose your progress.",
    onNavigationAttempt: () => setShowNavigationWarning(true)
  });

  const goToNextStep = () => {
    if (currentStep < activeSteps.length - 1) {
      // Mark the current step as completed
      setIsCompleted(prev => ({ ...prev, [activeSteps[currentStep].id]: true }));
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevStep = () => {
    const paymentStepIndex = activeSteps.findIndex(step => step.id === "payment");
    const restrictedStepIndex = activeSteps.findIndex(step => step.id === "payment");
    const targetStep = currentStep - 1;

    // Special handling for payment page - show warning instead of blocking
    if (hasSubmittedPassengerData && currentStep === paymentStepIndex) {
      setShowPaymentBackWarning(true);
      return;
    }

    // Block if passenger data has been submitted and we're trying to go before payment step
    if (hasSubmittedPassengerData && targetStep < restrictedStepIndex) {
      setShowRestrictedDialogue(true);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      // If at first step, go back to home
      navigate("/");
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const paymentStepIndex = activeSteps.findIndex(step => step.id === "payment");
    const restrictedStepIndex = activeSteps.findIndex(step => step.id === "payment");
    
    // Special handling for payment page - show warning instead of blocking
    if (hasSubmittedPassengerData && currentStep === paymentStepIndex && stepIndex < paymentStepIndex) {
      setShowPaymentBackWarning(true);
      return;
    }

    // Block if passenger data has been submitted and trying to go before payment step
    if (hasSubmittedPassengerData && stepIndex < restrictedStepIndex) {
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

  const handlePaymentBackWithReset = () => {
    resetForm();
    setShowPaymentBackWarning(false);
    // Reset to the beginning or previous step
    navigate("/");
    setCurrentStep(Math.max(0, currentStep - 1));
    window.scrollTo(0, 0);
  };

  // Update step complete status
  const setStepComplete = (stepId: string, isComplete: boolean) => {
    setIsCompleted(prev => ({ ...prev, [stepId]: isComplete }));
  };

  // Render the current step component
  const renderStep = () => {
    const currentStepId = activeSteps[currentStep]?.id;
    
    switch (currentStepId) {
      case "tripSelection":
        return <TripSelection onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case "busSelection":
        return <BusSelection onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case "seatSelection":
        return <SeatSelection onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case "passengerInfo":
        return <PassengerInfo onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case "payment":
        return <Payment onComplete={() => goToNextStep()} setStepComplete={setStepComplete} />;
      case "confirmation":
        return <Confirmation />;
      default:
        return null;
    }
  };

  // Determine if the next button should be disabled
  const isNextDisabled = !isCompleted[activeSteps[currentStep]?.id];
  
  // Hide navigation buttons on confirmation step
  const showNavButtons = currentStep !== activeSteps.length - 1;

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max">
          {activeSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-gray-400"}
                ${hasSubmittedPassengerData && index < activeSteps.findIndex(s => s.id === "payment") ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
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
              {index < activeSteps.length - 1 && (
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

      {/* Show trip details summary if we skipped TripSelection */}
      {!activeSteps.find(step => step.id === "tripSelection") && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-lg">Trip Details</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
            >
              Modify
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Route */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Route</span>
              </div>
              <p className="font-medium">{departure} → {destination}</p>
            </div>
            
            {/* Date */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Date</span>
              </div>
              <p className="font-medium">
                {date ? format(date, "EEEE, MMMM d, yyyy") : "No date selected"}
              </p>
            </div>
            
            {/* Passengers */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Passengers</span>
              </div>
              <p className="font-medium">{passengers} passenger{passengers > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Protection Warning */}
      {hasSubmittedPassengerData && currentStep !== activeSteps.length - 1 && (
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
            {activeSteps[currentStep + 1]?.label || "Next"}
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

      {/* Payment Back Warning Dialog */}
      <AlertDialog open={showPaymentBackWarning} onOpenChange={setShowPaymentBackWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Going Back Will Reset Your Data</AlertDialogTitle>
            <AlertDialogDescription>
              You are currently on the payment page with passenger information already saved. 
              Going back will erase all your booking data including passenger details, seat selection, 
              and bus selection. You will need to start the booking process from the beginning.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPaymentBackWarning(false)}>
              Stay on Payment Page
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePaymentBackWithReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Go Back and Reset Data
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