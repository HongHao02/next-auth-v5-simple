import LoginForm from "@/components/ui/login/login-form";
import RegisterForm from "@/components/ui/register/register-form";
import { authOptions } from "../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <div className="container h-screen flex items-center justify-center">
      <div className="w-[600px] ">
        <h1 className="font-bold text-3xl">Login</h1>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default RegisterPage;
