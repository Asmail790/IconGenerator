const envName = "USER_TOKENS_GRANTED"

const userTokensGranted = Number(process.env[envName]); // Number of token granted for a new user.


if( Number.isNaN(userTokensGranted)){
    throw Error(`environment variable ${envName} is not set to a valid number`)
}

export { userTokensGranted };
