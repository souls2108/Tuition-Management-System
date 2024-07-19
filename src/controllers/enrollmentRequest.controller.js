import { asyncHandler } from "../utils/asyncHandler";


const getStudentEnrollRequests = asyncHandler( async (req, res) => {

});

const createStudentEnrollRequest = asyncHandler( async (req, res) => {

});

const updateStudentEnrollRequest = asyncHandler( async (req, res) => {

});


//institute only routes
const getInstituteEnrollRequests = asyncHandler( async (req, res) => {

});

const createInstituteEnrollRequest = asyncHandler( async (req, res) => {

});

const updateInstituteEnrollRequest = asyncHandler( async (req, res) => {

});


export {
    getStudentEnrollRequests,
    createStudentEnrollRequest,
    updateStudentEnrollRequest,
    getInstituteEnrollRequests,
    createInstituteEnrollRequest,
    updateInstituteEnrollRequest,
}