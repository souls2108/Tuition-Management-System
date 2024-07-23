import { Attendance } from "../../models/attendance.model.js"

const getByEnrollId = async (enrollId) => {
    const attendance = await Attendance.find({enrollment: enrollId});
    return attendance;
}

const addForSession = async (attendance) => {
    const result = await Attendance.insertMany(attendance);
    return result;
}

const getDatesByEnrollIds = async (enrollIds) => {
    const dates = await Attendance.aggregate(
        [
            {
                $match: {
                    enrollment: {$in: enrollIds}
                }
            },
            {
                $group: {
                    _id: null,
                    classDates: { $addToSet: "$start" }
                }
            },
            {
                $porject: {
                    _id: 0,
                    classDates: {$sort : 1}
                }
            }
        ]
    );
    return dates;
}

const AttendanceService = {
    getByEnrollId,
    addForSession,
    getDatesByEnrollIds,
}

export { AttendanceService }