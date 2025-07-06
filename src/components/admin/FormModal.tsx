
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  loading?: boolean;
  footer?: React.ReactNode;
}

const FormModal = ({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  children,
  loading,
  footer,
}: FormModalProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg h-[30rem] overflow-auto bg-gray-100">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>
          <div className="grid gap-4 py-4">{children}</div>
          {/* {footer ? (
            <DialogFooter>{footer}</DialogFooter>
          ) : onSubmit ? (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                >
                {loading ? "Processing..." : "Save"}
              </Button>
            </DialogFooter>
          ) : null} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
