import { Institute } from "../../models/institute.model.js";


const getById = async (instituteId) => {
    const institute = await Institute.findById(instituteId);
    return institute;
}

const InstituteService = {
    getById,
}
export {
    InstituteService
}