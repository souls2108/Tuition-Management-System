import { UserInstituteRequest } from "../../models/userInstituteRequest.model.js";


const get = async (userId, instituteId) => {
    const request = await UserInstituteRequest.findOne(
        {institute: instituteId, user: userId}
    );
    return request;
}

const getById = async (requestId) => {
    const request = await UserInstituteRequest.findById(requestId);
    return request;
}

const getUser = async (userId) => {
    const requests = await UserInstituteRequest.find({user: userId});
    return requests;
}

const getInstitute = async (instituteId) => {
    const requests = await UserInstituteRequest.find({institute: instituteId});
    return requests;
}

const create = async (userId, instituteId, roleType,
    {userStatus = "PENDING", instituteStatus = "PENDING"}) => {
        const request = await UserInstituteRequest.create({
            user: userId,
            institute: instituteId,
            roleType: roleType,
            userStatus: userStatus,
            instituteStatus: instituteStatus,
        });
        return request;
}

const updateUserStatus =  async ( requestId, newUserStatus) => {
    const request = await UserInstituteRequest.findByIdAndUpdate(
        requestId,
        {
            $set: {userStatus: newUserStatus},
        },
        {new: true}
    )
    return request;
}

const updateInstituteStatus =  async ( requestId, newInstituteStatus) => {
    const request = await UserInstituteRequest.findByIdAndUpdate(
        requestId,
        {
            $set: {instituteStatus: newInstituteStatus},
        },
        {new: true}
    )
    return request;
}

const deleteRequest = async ( requestId) => {
    const deletedRequest = await UserInstituteRequest.findByIdAndDelete(
        requestId
    )
    return deletedRequest;
}

const InstituteRequestService = {
    get,
    getById,
    getUser,
    getInstitute,
    create,
    updateUserStatus,
    updateInstituteStatus,
    deleteRequest,
}


export { InstituteRequestService }