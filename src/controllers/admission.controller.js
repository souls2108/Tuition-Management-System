import { AdmissionService } from "../db/services/admission.service.js";
import { InstituteService } from "../db/services/institute.service.js";
import { OrderService } from "../db/services/order.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyStudentHandlePermission = (loggedInEmp, student) => {
    if(!loggedInEmp) {
        throw new ApiError(401, "Employee must be logged in");
    }
    //XXX: Move to constants as removal permission
    const permissions = ["OWNER", "ADMIN", "TEACHER"]
    if(!permissions.includes(loggedInEmp.role)) {
        throw new ApiError(403, "Not sufficient permissions to perform action.");
    }
    if(!student) return;
    if(!loggedInEmp.institute.equals(student.institute)) {
        throw new ApiError(409, "Student does not belong to institute");
    }
}

const removeStudentByEmp = asyncHandler(async (req, res) => {
    const emp = req.emp;
    const { admissionId, forceRemoveStudent} = req.body;
    if(!admissionId) {
        throw new ApiError(400, "admissionId is required.");
    }
    
    const student = await AdmissionService.getById(admissionId);
    if(!student) {
        throw new ApiError(404, "Student not found");
    }
    verifyStudentHandlePermission(emp, student);

    const orders = await OrderService.getByInstituteIdAndUserId(req.emp.institute, student.user, true);
    let deleteOrders = {};
    if (orders.length !== 0) {
        if(Boolean( forceRemoveStudent)) {
            deleteOrders = await OrderService.deleteMany(orders.map((order) => order._id));
        } else {
            throw new ApiError(409, "Student has pending orders at Institute");
        }        
    }

    const deletedAdmission = await AdmissionService.deleteById(admissionId);
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                deletedAdmission,
                deleteOrders,
            },
            "Student removed"
        )
    )
})

const getUserAdmissions = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "user must be logged in");
    }

    const admissions = await AdmissionService.getByUserId(req.user._id);
    return res.status(200).json(new ApiResponse(200, {admissions}, "Fetched user admissions"));
})

//TODO: removeStudentBySelf

const getInstituteStudents = asyncHandler(async (req, res) => {
    const {  page, limit } = req.body;
    const instituteId = req.emp.institute;
    if(!instituteId) {
        throw new ApiError(400, "instituteId field is required");
    }

    const institute = await InstituteService.getById( instituteId);
    if(!institute) {
        throw new ApiError(404, "Institute not found");
    } 

    verifyStudentHandlePermission(req.emp);
    const students = await AdmissionService.getByInstitute(instituteId, page, limit);
    
    if(!students.length) {
        return res.status(200).json(new ApiResponse(200, {}, "No student found"));
    }
    return res.status(200).json(new ApiResponse(200, {institute , students}, "Students fetched"));
})


export {
    removeStudentByEmp,
    getInstituteStudents,
    getUserAdmissions,
}
