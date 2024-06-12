"use client";
import React, { useEffect } from "react";
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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { reloadSesstion } from "@/lib/func";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "This field has to be filled!",
    })
    .email("This is not a valid email!")
    .max(100, { message: "Email can not be longer than 50 characters!" }),
});

const UpdateEmailForm = ({ email }: { email: string }) => {
  const { data: sesstion, update } = useSession();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: sesstion?.user?.email as string,
    },
  });
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const response = await fetch("/api/updateEmail", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
      return;
    } else {
      toast.success(data.success);
      //update sesstion

      update({
        ...sesstion,
        user: {
          ...sesstion?.user,
          email: values.email,
        },
      });
      reloadSesstion();

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
        <h1 className="font-bold text-3xl">Modify your email</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" className="w-36">
            Update email
          </Button>
          <Button type="reset" className="w-36" variant="destructive">
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateEmailForm;
