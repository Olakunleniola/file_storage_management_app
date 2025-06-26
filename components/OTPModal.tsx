import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { ButtonHTMLAttributes, MouseEvent, useState } from "react";
import Image from "next/image";
import { FormSubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Execute an API call here
    } catch (err) {
      console.log("Unable to Submit OTP", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    // perform an API call
  };
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialog">
          <AlertDialogHeader className="relative flex justify-center">
            <AlertDialogTitle className="h2 ">Enter your OTP</AlertDialogTitle>
            <Image
              src="./assets/icons/close-dark.svg"
              alt="close button"
              width={24}
              height={24}
              className="otp-close-button"
              onClick={() => setIsOpen(false)}
            />
            <AlertDialogDescription>
              We&apos;ve sent a code to{" "}
              <span className="pl-1 text-brand">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP maxLength={6}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          <AlertDialogFooter>
            <div className="flex flex-col w-full gap-4">
              <AlertDialogAction
                className="shad-submit-btn h-12"
                type="button"
                onClick={handleSubmit}
              >
                Submit
                {isLoading && (
                  <Image
                    src="./assets/icons/loader.svg"
                    alt="loading icon"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </AlertDialogAction>
              <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn&apos;t get a code?
                <Button
                  type="button"
                  variant="link"
                  className="pl-1 text-brand"
                  onClick={handleResendOTP}
                >
                  Click to resend
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OTPModal;
