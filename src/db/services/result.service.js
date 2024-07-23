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

const createForSession = async (results) => {
    const createdResults = await Result.insertMany(results);
    return createdResults;
}

const getResultStats = async (examId) => {
    const resultStats = await Result.aggregate(
        [
            {
                $match: {
                    exam: examId,
                }
            },
            {
                $group: {
                  _id: null,
                  averageScore: { $avg: "$score" },
                  highestScore: { $max: "$score" },
                  lowestScore: { $min: "$score" },
                  totalStudents: { $count: {} },
                  scoreDistribution: { $push: "$score" }
                }
              },
              {
                $project: {
                    _id: 0,
                    averageScore: 1,
                    highestScore: 1,
                    lowestScore: 1,
                    totalStudents: 1,
                    scoreDistribution: 1                }
              }
        ]
    );

    return resultStats[0];
}

const ResultService = {
    resultByEnrollId,
    getResultStats,
    createForSession,
} 
export {ResultService};