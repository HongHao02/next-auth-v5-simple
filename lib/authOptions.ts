import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import clientPromise from "../src/lib/MongodbClient";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const client = await clientPromise;
        const db = client.db() as any;

        const user = await db
          .collection("users")
          .findOne({ email: credentials?.email });
        const bcrypt = require("bcrypt");

        const correctPassword = await bcrypt.compare(
          credentials?.password,
          user?.password
        );

        if (correctPassword) {
          return {
            id: user?._id,
            email: user?.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({user, token, trigger, session})=>{
      if(trigger==='update'){
        return {...token, ...session.user}
      }
      return {...token, ...user}
    }
  }
};
