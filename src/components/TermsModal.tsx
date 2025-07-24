import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAgree }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-2xl">
            <Shield className="mr-3 h-6 w-6 text-primary" />
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 min-h-0 pr-4">
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed pb-4">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="space-y-4">
              <p className="font-semibold text-foreground">
                Please read these terms carefully before using Corpers Drive services:
              </p>
              
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Booking Validity:</strong> Booking is only valid after full payment via official channels; tickets are non-transferable and expire 30 minutes after departure.
                </li>
                <li>
                  <strong>Refund Policy:</strong> Commitment fees are non-refundable. A 50% refund may be granted on request if full payment has already been made.
                </li>
                <li>
                  <strong>Departure Requirements:</strong> Passengers must arrive at least 30 minutes before departure and may be required to present valid identification.
                </li>
                <li>
                  <strong>Code of Conduct:</strong> Misconduct, smoking, alcohol, or illegal substance use is strictly prohibited during travel.
                </li>
                <li>
                  <strong>Luggage Policy:</strong> A maximum of 10kg of luggage is allowed per passenger on the sprinter bus; excess luggage attracts additional fees.
                </li>
                <li>
                  <strong>Liability:</strong> Corpers Drive is not liable for delays, missed trips, or lost items. Travel is undertaken at passengers' own risk.
                </li>
                <li>
                  <strong>Cancellations:</strong> Cancellations must be made at least 24 hours before departure. Refunds are at the company's discretion.
                </li>
                <li>
                  <strong>Pick-up Services:</strong> Pick-up services in Ijebu-Ode, Shagamu, and IFE must be pre-booked with full payment. Punctuality is mandatory.
                </li>
                <li>
                  <strong>Governing Law:</strong> These Terms are governed by Nigerian law and Federal Road Safety Corps (FRSC) regulations.
                </li>
                <li>
                  <strong>Agreement:</strong> Booking or using our service means you agree to all terms. Contact us via email at{" "}
                  <a href="mailto:corpersdrive@gmail.com" className="text-primary underline">
                    corpersdrive@gmail.com
                  </a>{" "}
                  or call{" "}
                  <a href="tel:+2348141241741" className="text-primary underline">
                    08141241741
                  </a>.
                </li>
              </ol>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="font-semibold text-foreground mb-2">
                  Agreement to Terms
                </p>
                <p className="text-sm">
                  By clicking "I Agree" below, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex gap-6 flex-shrink-0 bg-slate-200 p-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAgree} className="bg-primary hover:bg-primary-dark">
            I Agree to Terms
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Demo component to test the modal
const TermsModalDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)} className='md:hidden'>
        Open Terms Modal
      </Button>
      
      <TermsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAgree={() => {
          alert('Terms agreed!');
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default TermsModal;