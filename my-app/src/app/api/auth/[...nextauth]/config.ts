import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { defaultCreateTokens as createTokens } from "../_logic/create-initial-user-tokens";
import { db } from "@/global.config/db";
import { KyselyAdapter } from "@auth/kysely-adapter"


function getGoogleEnvs() {
  if (process.env.GOOGLE_CLIENT_ID === undefined) {
    throw new Error("GOOGLE_CLIENT_ID is not provided");
  }

  if (process.env.GOOGLE_CLIENT_SECRET === undefined) {
    throw new Error("GOOGLE_CLIENT_SECRET is not provided");
  }

  const envs = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
  return envs;
}

function getSecret() {
  if (process.env.AUTH_SECRET === undefined) {
    throw new Error("AUTH_SECRET is not provided");
  }
  return process.env.AUTH_SECRET;
}

const config = {
  secret: getSecret(),
  trustHost:true,
  adapter: KyselyAdapter(db.adapter() as any) as any,
  providers: [GoogleProvider(getGoogleEnvs())],

  events: {
    async createUser(message) {
      const userId = message.user.id;
      if (userId === undefined) {
        throw Error("userId is undefined");
      }
      createTokens(userId);
    },
  },
} satisfies NextAuthConfig;

const { auth, handlers } = NextAuth(config);

async function getUserEmail() {
  const email = (await auth())?.user?.email ?? undefined;

  if (email === undefined) {
    throw Error("undefined email");
  }

  return email;
}

async function isLoggedIn() {
  const isLoggedIn = await auth() !== null;
  return isLoggedIn
}

const { GET, POST } = handlers;
export { auth, GET, POST, getUserEmail,isLoggedIn };
