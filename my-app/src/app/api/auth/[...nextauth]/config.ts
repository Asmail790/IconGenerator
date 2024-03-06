import nextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { defaultCreateTokens as createTokens } from "../_logic/create-initial-user-tokens";
import { promiseDB } from "@/global.config/db";
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



async function setUpNextAuth(){
  const config = {
    secret: getSecret(),
    trustHost:true,
    adapter: KyselyAdapter( (await promiseDB).adapter() as any) as any,
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
  
  // const { auth, handlers } = nextAuth(config);
  // const {GET,POST} = handlers

  // return {auth,GET,POST}

  return nextAuth(config)
}

const nextAuthPromiseInstance = setUpNextAuth()

async function getUserEmail() {
  const {auth} = await nextAuthPromiseInstance
  const email = (await auth())?.user?.email ?? undefined;

  if (email === undefined) {
    throw Error("undefined email");
  }

  return email;
}

async function isLoggedIn() {
  const {auth} = await nextAuthPromiseInstance
  const isLoggedIn = await auth() !== null;
  return isLoggedIn
}


export {  nextAuthPromiseInstance, getUserEmail,isLoggedIn };
