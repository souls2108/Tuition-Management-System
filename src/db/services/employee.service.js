import { Employee } from "../../models/employee.model.js";


const get = async (userId, instituteId) => {
    const emp = await Employee.findOne(
        {institute: instituteId, user: userId}
    );
    return emp;
}

const getById = async (empId) => {
    const emp = await Employee.findById(empId);
    return emp;
}

const getUser = async (userId) => {
    const emps = await Employee.find({user: userId});
    return emps;
}

const getInstitute = async (instituteId) => {
    const emps = await Employee.find({institute: instituteId});
    return emps;    
}

const create = async (userId, instituteId, role) => {
    const emp = await Employee.create(
        {
            user: userId,
            institute: instituteId,
            role: role,
        }
    );

    return emp;
};

const update = async (empId, newRole) => {
    const emp = await Employee.findByIdAndUpdate(empId,
        {
            $set: {role: newRole},
        },
        {new: true}
    );
    return emp;
}

const getInstituteOwner = async (instituteId) => {
    const emp = await Employee.findOne({institute: instituteId, role: "OWNER"});
    return emp;
}

const removeEmp = async (empId) => {
    const emp = await Employee.findByIdAndDelete(empId);
    return emp;
}

const EmployeeServices = {
    get,
    getById,
    getInstituteOwner,
    getUser,
    getInstitute,
    create,
    update,
    removeEmp,
}


export { EmployeeServices }