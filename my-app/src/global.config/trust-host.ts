const envName = "TRUST_HOST";
const envValue = process.env[envName]?.toLowerCase();
if (envValue !== "true" && envValue !== "false") {
  throw Error(
    `environment variable ${envName} is not set to a valid boolean ie. 'false' or true`
  );
}

const trustHost = envValue === "true" ? true : false; // used in  authjs

export { trustHost };
