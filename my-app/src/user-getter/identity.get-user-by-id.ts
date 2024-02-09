import TGetUserByID from "./get-user-id.interface";



const getUser:TGetUserByID = (userId) => {
    if (userId === undefined){
        throw Error("userID can not be undefined")
    }
    return userId
}

export default getUser