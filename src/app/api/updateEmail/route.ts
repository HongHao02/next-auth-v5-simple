import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/MongodbClient";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const sesstion = await getServerSession(authOptions);
    if (!sesstion) {
      return NextResponse.json({ error: "Not authorized" }, { status: 400 });
    }
    console.log("Sesstion email ", sesstion.user?.email);

    const client = await clientPromise;
    const db = client.db();

    const doesUserExist = await db.collection("users").findOne({ email: sesstion.user?.email });
    console.log("UserExist ", doesUserExist);
    
    if (!doesUserExist) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const doesEmailExist = await db
      .collection("users")
      .findOne({ email: email });
    if (doesEmailExist) {
      return NextResponse.json(
        { error: "Email is already exist!" },
        { status: 400 }
      );
    }
    const updateEmail = await db.collection("users").updateOne(
      { email: sesstion.user?.email },
      {
        $set: {
          email,
        },
      }
    );
    return NextResponse.json(
      { success: "Change email successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
