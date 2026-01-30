"use client";
import React from "react";
import CustomModal from "./CustomModal";
import { useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface LoginMsgModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginMsgModal: React.FC<LoginMsgModalProps> = ({ open, setOpen }) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${currentPath}`);
    setOpen(false);
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={setOpen}
      title="Login Required"
    >
      <div className="py-4 px-2 text-center text-gray-600 space-y-4 ">
        <div className="flex items-center justify-center text-brandPrimary text-4xl">
          <HiOutlineExclamationCircle />
        </div>
        <p className="text-base font-medium">
          You need to be logged in to use this feature.
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-6 px-4 ">
        <button
          className="btn-bordered rounded-sm max-h-10 "
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>

        <button
          onClick={handleLoginRedirect}
          className="btn-base max-h-10"
        >
          Login
        </button>
      </div>
    </CustomModal>
  );
};

export default LoginMsgModal;
