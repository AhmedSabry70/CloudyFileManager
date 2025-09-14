import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions'

const OTPModal = ({
  email,
  accountId,
  isOpen,
  setIsOpen,
}: {
  email: string
  accountId: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const [secret, setSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      const session = await verifySecret({ accountId, secret })
      if (session) router.push('/')
    } catch (err) {
      console.log('Failed to verify OTP', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOPT = async () => {
    try {
      await sendEmailOTP({ email })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              onClick={() => setIsOpen(false)}
              width={20}
              height={20}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-light-100 text-center">
            We've sent a code to <span className="text-brand ps-1">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={secret} onChange={setSecret}>
          <InputOTPGroup className="shad-otp">
            {[...Array(6).keys()].map((num, idx) => (
              <InputOTPSlot
                key={idx}
                index={idx}
                className="shad-otp-slot [--ring:--color-brand-100] 
"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter className="">
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              type="button"
              className="shad-submit-btn h-12"
            >
              Submit
              {isLoading && (
                <Image
                  src={'/assets/icons/loader.svg'}
                  alt="loader"
                  width={24}
                  height={24}
                  className="ms-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 text-light-100 mt-2 text-center">
              Didn't get a code?
              <Button
                type="button"
                variant={'link'}
                onClick={handleResendOPT}
                className="text-brand ps-1"
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal
