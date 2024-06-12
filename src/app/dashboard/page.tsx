import UpdateEmailForm from "@/components/ui/dashboard/update-email-form";
import { authOptions } from "../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const sesstion = await getServerSession(authOptions);
  if (!sesstion) {
    redirect("/login");
  }
  const user = sesstion.user;

  return (
    <div className="p-2 flex justify-center flex-col w-full">
      Welcom to dashboard {user?.email}
      <div className=" flex justify-center mt-2 w-full">
        <UpdateEmailForm email={user?.email as string}></UpdateEmailForm>
      </div>
    </div>
  );
};

export default DashboardPage;
