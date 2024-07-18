import { EmployeeServices } from "../db/services/employee.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyEmployeeRemovePermission = (loggedInEmp, removeEmp) => {
    //XXX: Move to constants as removal permission
    const permissions = {
        "OWNER": [ "ADMIN", "TEACHER", "STUDENT"],
        "ADMIN": [ "TEACHER", "STUDENT"],
    }
    if(loggedInEmp._id === removeEmp._id) return true;
    //XXX: test shorthand condition
    if (permissions.hasOwnProperty(loggedInEmp.role) 
        && permissions[loggedInEmp.role].includes(removeEmp.role)) {
        return true;
    }
    return false;
}

const removeEmployee = asyncHandler( async (req, res) => {
    const { removeEmpId } = req.body;
    const emp = req.emp;

    const removeEmp = await EmployeeServices.getById(removeEmpId);
    if(!removeEmp) {
        throw new ApiError(404, "Employee not found.");
    }
    if(removeEmp.institute !== emp.institute) {
        throw new ApiError(409, "Employee does not belong to institute.");
    }
    if(!verifyEmployeeRemovePermission(emp, removeEmp)) {
        throw new ApiError(403, "Not sufficient permissions to perform action.");
    }
    if(removeEmp.role === "OWNER") {
        throw new ApiError(400, "OWNER can only transfer ownership or delete Institute");
    }

    const deletedEmp =  await EmployeeServices.removeEmp(removeEmp._id);
    return res.status(200).json( new ApiResponse(200, {
        user: deletedEmp.user, institute: deletedEmp.institute},
    "Employee removed"))
})

export {
    removeEmployee,
}

// /**
//  * method assumes user and institute exist
//  */
// const createEmp = async (userId, instituteId, role) => {
//     if(!userId || !instituteId || !role) {
//         throw new ApiError(
//             400, 
//             "UserId, InstituteId and role are required for employee entry."
//         );
//     }

//     const existedEmp = await Employee.findOne({user: userId, institute: instituteId});
//     if (existedEmp) {
//         throw new ApiError(400, "User existing employee at institute.");
//     }

//     const emp = await Employee.create(
//         {
//             user: userId,
//             instituteId: instituteId,
//             role: role,
//         }
//     );

//     return emp;
// };

// const updateEmp = async (userId, instituteId, newRole) => {
//     if(!userId || !instituteId || !newRole) {
//         throw new ApiError(
//             400, 
//             "UserId, InstituteId and role are required for employee entry."
//         );
//     }

//     if (newRole === "OWNER") {
//         await Employee.findOneAndUpdate(
//             {
//                 institute: instituteId,
//                 role: "OWNER",
//             },
//             {
//                 $set: {role: "ADMIN"}
//             }
//         )
//     }

//     const emp = await Employee.findOneAndUpdate(
//         {
//             user: userId,
//             institute: instituteId,
//         },
//         {
//             $set: {role: newRole}
//         },
//         {new: true}
//     );

//     return emp;
// }

// const deleteEmp = async (userId, instituteId) => {
//     if(!userId || !instituteId) {
//         throw new ApiError(
//             400, 
//             "UserId, InstituteId are required for employee deletion."
//         );
//     }

//     const emp = await Employee.findOne({user: userId, institute: instituteId});
//     if(!emp) {
//         throw new ApiError(404, "Employee does not exist");
//     }
//     if(emp.role === "OWNER") {
//         throw new ApiError(401, "OWNER need to transfer OWNERSHIP or delete Institute.");
//     }

//     const deletedEmp = await Employee.findByIdAndDelete(emp._id);

//     if(!deletedEmp) {
//         throw new ApiError(500, "Failed to delete employee");
//     }
// }

// const getEmployee = async (userId, instituteId) => {
//     if(!userId || !instituteId) {
//         throw new ApiError(500, "UserId & instituteId required to query EmployeeDB");
//     }

//     try {
//         const emp = await Employee.findOne({user: userId, institute: instituteId});
//         return emp;
//     } catch (error) {
//         throw new ApiError(500, error?.message
//             || "Error while calling EmployeeDB")
//     }
// }

// const getEmployeeById = async(empId) => {
//     if(!empId) {
//         throw new ApiError(500, "EmployeeId is required to query EmployeeDB");
//     }

//     try {
//         const emp = await Employee.findById({_id: empId});
//         return emp;        
//     } catch (error) {
//         throw new ApiError(500, error?.message
//             || "Error while calling EmployeeDB")        
//     }
// }

// const getUserEmployments = async(userId) => {
//     if(!userId) {
//         throw new ApiError(500, "userId is required to query EmployeeDB");
//     }

//     try {
//         const emps = await Employee.find({user: userId});
//         return emps;        
//     } catch (error) {
//         throw new ApiError(500, error?.message
//             || "Error while calling EmployeeDB")        
//     } 
// }

// const getInstituteEmployments = async(instituteId) => {
//     if(!instituteId) {
//         throw new ApiError(500, "instituteId is required to query EmployeeDB");
//     }

//     try {
//         const emps = await Employee.find({institute: instituteId});
//         return emps;        
//     } catch (error) {
//         throw new ApiError(500, error?.message
//             || "Error while calling EmployeeDB")        
//     } 
// }

// export {
//     createEmp,
//     updateEmp,
//     getEmployee,
//     getEmployeeById,
//     getUserEmployments,
//     getInstituteEmployments,
//     deleteEmp,
// }