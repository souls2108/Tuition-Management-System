routes/
    index.js
    users/
        user.routes.js
    userOperations/
        index.js
        order.routes.js
        transaction.routes.js
        employee.routes.js
        admission.routes.js
        enrollment.routes.js
    institutes/
        index.js
        institute.routes.js
        userInstituteRequest.routes.js
        instituteOperations/
            index.js
            instituteUserRequest.routes.js 
            employee.routes.js
            admission.routes.js
            enrollmentRequest.routes.js
            course.routes.js
            session/
                index.js
                session.routes.js
                enrollment.routes.js
                exam.routes.js
                attendance.routes.js
                order.routes.js
        userOperations/
            enrollmentRequest.routes.js
            session.routes.js
            enrollment/
                index.js
                enrollment.routes.js


## /api/users
- `/register` : displayName, email, phone, password <br>
- `/login` : [email, phone], password <br>
- `/logout` : __ <br>
-  `/refresh-token`: refresh accessToken using refreshToken
- `/current-user` : user profile <br>
- `/update-account` : <br>
- `/change-password` : <br>
- `/delete-user` : __
## /api/institute
- `/create-institute` : instituteName <br>
- `/i/all` : [ page ] <br>
- `/i/name` : instituteName <br>
- `/i/:instituteId` : __ <br>
## /api/r
- `/request` <br>
    - get
    - post
    - patch
- `/:instituteId/request`
    - get 
    - post
    - patch
- `/:instituteId/remove-student`
    - delete
- `/:instituteId/leave`
    - delete
## /api/e
- `/:instituteId/all`
    - get
- `/:instituteId/remove-emp`
    - delete
## /api/a
## /api/enroll-request