'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authFormSchema, SignIn, SignUp } from '@/lib/zodSchema';
import OTPModal from './OTPModal';
import { createAccount, signInUser } from '@/lib/actions/user.actions';


type FormType = 'sign-in' | 'sign-up';

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [accountId, setAccountId] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const defaultValues = type === 'sign-up'
    ? { fullName: '', email: '' }
    : { email: '' };

  const formSchema = authFormSchema(type);

  const form = useForm<SignIn|SignUp>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrMsg('');

    try {
      if (type === 'sign-in') {
         const {accountId,error} = await signInUser(values as SignIn);
if(error) console.log(error);
         
       setAccountId(accountId);
        setShowOTPModal(true);
      } else {
        const user = await createAccount(values as SignUp);
        setAccountId(user.accountId);
        setShowOTPModal(true);
      }
    } catch (err) {
      console.error(err);
      setErrMsg('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form space-y-8">
          <h1 className="form-title">{type === 'sign-in' ? 'Login' : 'Create new account'}</h1>

          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" className="shad-input" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" className="shad-input" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button type="submit" className="form-submit-button" disabled={isLoading}>
            {type === 'sign-in' ? 'Login' : 'Create Account'}
            {isLoading && (
              <Image
                src={'/assets/icons/loader.svg'}
                alt="loader"
                width={24}
                height={24}
                className="ms-2 animate-spin"
              />
            )}
          </Button>

          {errMsg && <p className="error-message">*{errMsg}</p>}

          <p className="body-2 text-light-100 flex justify-center">
            {type === 'sign-in' ? (
              <span>
                Don't have an account?{' '}
                <Link href={'/sign-up'} className="text-brand ms-1 font-medium">
                  Create Account
                </Link>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <Link href={'/sign-in'} className="text-brand ms-1 font-medium">
                  Login
                </Link>
              </span>
            )}
          </p>
        </form>
      </Form>

      {showOTPModal &&   accountId &&(
        <OTPModal email={form.getValues('email')} accountId={accountId} isOpen={showOTPModal} setIsOpen={setShowOTPModal}/>
      )}
    </>
  );
};

export default AuthForm;

