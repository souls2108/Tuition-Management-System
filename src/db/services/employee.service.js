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

const getByUser = async (userId) => {
    const emps = await Employee.find({user: userId});
    return emps;
}

const getByInstitute = async (instituteId, page, limit) => {
    const options = {page, limit}
    const aggregate = Employee.aggregate(
        [
            {
                $match: {
                    institute: instituteId
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    empId: '$_id',
                    displayName: '$user.displayName',
                    email: '$user.email',
                    role: 1,
                }
            }
        ]
    )

    const employees = await Employee.aggregatePaginate(
        aggregate,
        options
    )
    return employees.docs;    
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
    getByUser,
    getByInstitute,
    create,
    update,
    removeEmp,
}


export { EmployeeServices }