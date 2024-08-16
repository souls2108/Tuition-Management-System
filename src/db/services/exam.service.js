import { Exam } from "../../models/exam.model.js"

const getById = async (examId) => {
    const exam = await Exam.findById(examId);
    return exam;
}

const create = async (sessionId, examName, topics, time, fullMarks) => {
    const exam = await Exam.create({session:sessionId, examName, topics, 
        time: time || Date.now(), fullMarks});
    
    return exam;
}

const update = async (examId, examName, topics, time, fullMarks) => {
    const exam = await Exam.findByIdAndUpdate(
        examId,
        {
            $set: {
                examName,
                topics,
                time,
                fullMarks,
            }
        },
        {new: true}
    );
    return exam;
}

const ExamService = {
    getById,
    create,
    update,
}

export { ExamService }