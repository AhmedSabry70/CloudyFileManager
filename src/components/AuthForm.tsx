'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Image from 'next/image'
import Link from 'next/link'



import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authFormSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import OTPModal from './OTPModal'

type FormType = 'sign-in' | 'sign-up'

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const formSchema = authFormSchema(type)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form space-y-8">
        <h1 className="form-title">{type === 'sign-in' ? 'Login' : 'Create new account'}</h1>
        {type === 'sign-up' ? (
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
        ) : null}

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

        <Button type="submit" className="form-submit-button">
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

    {true && (
        <OTPModal email={form.getValues('email')} accountId={'ddfdfdfaf'}/>
    )}
    </>
  )
}

export default AuthForm
