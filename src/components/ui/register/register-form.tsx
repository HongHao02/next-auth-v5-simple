"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "This field has to be filled!",
      })
      .email("This is not a valid email!")
      .max(100, { message: "Email can not be longer than 50 characters!" }),
    password: z
      .string()
      .min(8, { message: "Password has to be at least 8 characters long!" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password has to be at least 8 characters long!",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The password not match!",
        path: ["confirmPassword"],
      });
    }
  });

const RegisterForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(data.success);
      form.reset();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        onReset={() => form.reset()}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email.name@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your email used to sign in to our app
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your password used to sign in to our app
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Pasword</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password again"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your confirm password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link href="/login">
          <p className="font-semibold mt-2 text-[14px]">Do you have ann account?</p>
        </Link>
        <div className="flex gap-2">
          <Button type="submit" className="w-20">
            Submit
          </Button>
          <Button type="reset" className="w-20" variant="destructive">
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
