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
        /userInstituteRequest           
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
            /:sessionId/session-ops           //TEST
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
                GET
                POST
                PATCH
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