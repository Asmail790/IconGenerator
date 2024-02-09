import NextAuth, { NextAuthConfig} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "schema"


function getGoogleEnvs(){
  if (process.env.GOOGLE_CLIENT_ID===undefined){
    throw new Error("GOOGLE_CLIENT_ID is not provided")
  }

  if (process.env.GOOGLE_CLIENT_SECRET===undefined){
    throw new Error("GOOGLE_CLIENT_SECRET is not provided")
  }

  const envs = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }
  return envs
}

function getSecret(){
  if (process.env.AUTH_SECRET ===undefined){
    throw new Error("AUTH_SECRET is not provided")
  }
  return process.env.AUTH_SECRET 

}

const config = {
  secret:getSecret(),
  adapter: DrizzleAdapter(db) ,
  providers: [
    GoogleProvider(getGoogleEnvs()),
  ],
} satisfies NextAuthConfig

const {auth,handlers } =NextAuth(config)


async function getUserID(){
  const id = await auth().then(a => a?.user?.id)
  console.log(id)

  if (id === undefined){
    throw Error("User id undefined")
  }

  return id 
} 


const {GET, POST} = handlers
export {auth, GET, POST,getUserID}