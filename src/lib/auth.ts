import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "johndoe" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password wajib diisi");
        }

        await connectToDatabase();

        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw new Error("Username tidak ditemukan");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Password salah");
        }

        return {
          id: user._id.toString(),
          username: user.username,
          namaLengkap: user.namaLengkap,
          role: user.role,
          divisi: user.divisi
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        let r = user.role;
        if (r === "admin_keuangan" || r === "wk2_keuangan" || r === "Keuangan") r = "keuangan";
        if (r === "user" || r === "Tendik") r = "tendik";

        token.id = user.id;
        token.username = user.username;
        token.namaLengkap = user.namaLengkap;
        token.role = r;
        token.divisi = user.divisi;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        let r = token.role as string;
        if (r === "admin_keuangan" || r === "wk2_keuangan" || r === "Keuangan") r = "keuangan";
        if (r === "user" || r === "Tendik") r = "tendik";
        
        session.user = {
          id: token.id as string,
          username: token.username as string,
          namaLengkap: token.namaLengkap as string,
          role: r,
          divisi: token.divisi as string,
        };
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
