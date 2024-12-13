import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../utils/db";
import { compare } from "bcryptjs";

// Define the auth options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const { db } = await connectToDatabase();
        const user = await db.collection("users").findOne({ email });

        if (!user) {
          throw new Error("No user found with the given email.");
        }

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials.");
        }

        return { id: user._id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

// Export authOptions for use with getServerSession
export default NextAuth(authOptions);