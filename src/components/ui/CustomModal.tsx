"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className ?? " p-2 w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 h-full max-h-[95vh] overflow-y-scroll"}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;



  // <CustomModal
  //   open={open}
  //   onOpenChange={setOpen}
  //   title="Edit Your Review"
  //   description="You can change your rating and comment"
  // ></CustomModal>