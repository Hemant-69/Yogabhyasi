import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login", // Fallback, will be handled dynamically in middleware for custom routes
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const passwordsMatch = await bcrypt.compare(password, admin.password);
        if (!passwordsMatch) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.username, // NextAuth expects "name" for standard profile
          username: admin.username,
          role: admin.role,
        };
      },
    }),
  ],
});
