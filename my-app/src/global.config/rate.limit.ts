const envName = "RATE_LIMIT"
const rateLimit = Number(process.env[envName]); // Combined cost of all user spent on image generation in Dollar.


if( Number.isNaN(rateLimit)){
    throw Error(`environment variable ${envName} is not set to a valid number`)
}

export { rateLimit };
