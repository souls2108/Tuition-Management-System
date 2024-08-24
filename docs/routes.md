routes/
    index.js #
    users/
        user.routes.js
    user-details/
        index.js
        order.routes.js
        transactions.routes.js
        admission.routes.js
        enrollments.routes.js
        employee.routes.js
    institutes/
        index.js 
        institute.routes.js
        userInstituteRequest.routes.js
        institute-ops/
            index.js 
            instituteUserRequest.routes.js
            employee.routes.js
            admission.routes.js
            enrollmentRequest.routes.js
            course.routes.js
            order.routes.js
            transactions.routes.js
            session/
                index.js
                session.routes.js
                enrollment.routes.js
                exam.routes.js
                result.routes.js
                attendance.routes.js

        student-ops/
            index.js
            enrollmentRequest.routes.js
            session.routes.js
            course.routes.js
            enrollment.routes.js

todo->
    Check for pending orders at institue SERVICE


routes:
    /users
        /register
        /login
        /logout 
        /refresh-token
        /current-user
        /update-account
        /change-password
        /delete-user
    /user-details           //TEST
        /orders/
            GET
        /transactions/
            POST
        /admission/
            GET
        /enrollments/
            GET
        /employee/
            GET
    /institutes             //TEST
        /i                  
            /create-institute
            /all
            /name
            /:instituteId
        /userInstituteRequest           //TEST
            GET
            POST
            PATCH    
        /:instituteId/institute-ops           //TEST
            /request           //TEST
                GET
                POST
                PATCH
            /employee           //TEST
                GET
                DELETE            
            /admission           //TEST
                GET
                DELETE
            /enroll-request           //TEST
                GET
                POST
                PATCH
            /course           //TEST
                GET
                POST
                PATCH
                DELETE
            /session           //TEST
                /
                    GET
                    POST
                    PATCH
                    DELETE
                /course
                    GET
            /orders           //TEST
                GET
                POST
                PATCH
                DELETE
            /transactions           //TEST
                GET
            /:sessionId           //TEST
                /enrollments
                    GET
                    PATCH
                /exam           //TEST
                    POST
                    PATCH
                /result           //TEST
                    GET
                    POST
                    PATCH
                /attendance           //TEST
                    GET
                    POST

        :instituteId/student-ops           //TEST
            /enrollment-request           //TEST
                /
                    GET
                    POST
                    PATCH
            /session           //TEST
                /course
                /active
            /course           //TEST
                /all
            /:enrollId           //TEST
                /details
                /exam-stats


## /api/users
- `/register` : displayName, email, phone, password <br>
- `/login` : [email, phone], password <br>
- `/logout` : __ <br>
- `/refresh-token`: refresh accessToken using refreshToken
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