"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/users.actions";
import { useRouter } from "next/navigation";

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Execute an API call here
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) router.push("/");
    } catch (err) {
      console.log("Unable to Submit OTP", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
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
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
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
                disabled={isLoading}
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
                  disabled={isLoading}
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
