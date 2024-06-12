"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import LoginForm from "./login/login-form";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Image
              width={50}
              height={50}
              alt="avt"
              src={session.user?.image as string}
              className="rounded-full"
            ></Image>
            <div>
              <h1 className="text-green-700">{session.user?.name}</h1>
              <p>{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 bg-red-100 rounded-md"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="p-5 bg-slate-700 rounded-md shadow-md">
          <div className="flex flex-col gap-y-2 w-[340px] ">
            <h1 className="font-bold text-2xl">You are not login</h1>
            <button
              onClick={() => signIn("google")}
              className="p-2  rounded-md bg-white text-black"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => signIn("github")}
              className="p-2  rounded-md bg-white text-black"
            >
              Sign in with Github
            </button>
            <div className="flex justify-center items-center font-bold h-[39.96px]">OR</div>
            <LoginForm></LoginForm>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
