import { Result } from "../../models/result.model"


const resultByEnrollId = async(enrollId) => {
    const results = await Result.aggregate(
        [
            {
                $match: {
                    enrollment: enrollId,
                }
            },
            {
                $lookup: {
                    from: "exams",
                    localField: "exam",
                    foreignField: "_id",
                    as: "exam"
                }
            }
        ]
    );

    return results;
}


const ResultService = {
    resultByEnrollId
} 
export {ResultService};