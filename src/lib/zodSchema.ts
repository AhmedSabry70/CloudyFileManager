import { z } from 'zod';

// Base schema for both sign-in and sign-up
export const baseSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }).min(1, { message: 'Email is required.' }),
});

// Extended schema for sign-up
export const signUpSchema = baseSchema.extend({
  fullName: z.string()
    .min(1, { message: 'Name cannot be empty.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name must contain only alphabetic characters and spaces.' }),
})


// Function to get the appropriate schema
export const authFormSchema = (type: 'sign-in' | 'sign-up') => {
  return type === 'sign-up' ?  signUpSchema:  baseSchema;
};

export type SignIn = z.infer<typeof baseSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
