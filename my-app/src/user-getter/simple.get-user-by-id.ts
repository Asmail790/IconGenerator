import TGetUserByID from "./get-user-id.interface";





function createSimpleUserGetter(user:string):TGetUserByID{
    return  () => user
} 

const getUser = createSimpleUserGetter("asmail")
export default getUser