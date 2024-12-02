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
    /user-details           
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
    /institutes             
        /i                  
            /create-institute
            /all
            /name
            /:instituteId
        /userInstituteRequest           
            GET
            POST
            PATCH    
        /:instituteId/institute-ops           
            /request           
                GET
                POST
                PATCH
            /employee           
                GET
                DELETE            
            /admission           
                GET
                DELETE
            /enroll-request           
                GET
                POST
                PATCH
            /course           
                GET
                POST
                PATCH
                DELETE
            /session           
                /
                    GET
                    POST
                    PATCH
                    DELETE
                /course
                    GET
            /orders           
                GET
                POST
                PATCH
                DELETE
            /transactions           
                GET
            /:sessionId/session-ops           
                /enrollments
                    GET
                    PATCH
                /exam           
                    POST
                    PATCH
                /result           
                    GET
                    POST
                    PATCH
                /attendance           
                    GET
                    POST

        :instituteId/student-ops           
            /enrollment-request           
                GET
                POST
                PATCH
            /course           
                /all
            /:enrollId           
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