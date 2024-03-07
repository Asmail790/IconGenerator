const envName = "TOTAL_COST_LIMIT"
const totalCostLimit = Number(process.env[envName]); // Combined cost of all user spent on image generation in Dollar.


if( Number.isNaN(totalCostLimit)){
    throw Error(`environment variable ${envName} is not set to a valid number`)
}

export { totalCostLimit };
