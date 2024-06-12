import clientPromise from "@/lib/MongodbClient";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.info("|===> email", email + " " + password);

    const bcrypt = require("bcrypt");
    const hashPassowrd = await bcrypt.hash(password, 10);

    const client = await clientPromise;
    const db = client.db();

    const existUser = await db.collection("users").findOne({ email: email });
    if (existUser) {
      return NextResponse.json(
        { error: "Email already exist!" },
        { status: 400 }
      );
    } else {
      const createAccount = await db
        .collection("users")
        .insertOne({ email: email, password: hashPassowrd });
      return NextResponse.json(
        { success: "Account created!" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
