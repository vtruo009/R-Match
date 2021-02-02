# R'Match server application

### Steps to run application:

1. Make sure Docker is running is your local machine
2. Run npm install if you haven't already
3. Run docker-compose up

### API Design

Job API

-   Interacts with:

    -   Job database table

-   Routes:

    -   api/job/read

        -   Returns all job records from database.
        -   Body: None
        -   Parameters: None
        -   Authorization restrictions:
            -   User must be logged in
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    jobs: {
                        id: number,
                        targetYears: string[],
                        hoursPerWeek: number,
                        description: string,
                        startDate: Date,
                        endDate?: Date,
                        expirationDate: Date,
                        postedOn: Date,
                        type: string[],
                        title: string,
                        status: 'Hiring' | 'Closed',
                        minSalary: number,
                        maxSalary?: number,
                        departmentId: number,
                        facultyMember: {
                            id: number,
                            title: string,
                            user: {
                                firstName: string,
                                lastName: string
                            }
                        }
                    } []
                }
                ```
            -   error:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/job/create

        -   Saves a job record in the database.
        -   Body:
            ```
            {
                jobs: {
                    targetYears: string[],
                    hoursPerWeek: number,
                    description: string,
                    expirationDate?: Date,
                    startDate: Date,
                    endDate?: Date,
                    type: string[],
                    title: string,
                    minSalary: number,
                    maxSalary?: number,
                    departmentId: number
                }
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/job/update

        -   Updates the fields of existing job record from the database.
        -   Body:
            ```
            {
                job: {
                    id: number,
                    targetYears: string[],
                    hoursPerWeek: number,
                    description: string,
                    expirationDate: Date,
                    startDate: Date,
                    endDate?: Date,
                    expirationDate?: Date,
                    type: string[],
                    title: string,
                    status: 'Hiring' | 'Closed,
                    minSalary: number,
                    maxSalary?: number,
                    departmentId: number
                }
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/job/delete/:id

        -   Deletes an existing job object from the database.
        -   Body: None
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
        -   Parameters: id of job
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Unauthorized user -> Status code: 401
                -   Internal server error -> Status code: 500

    -   api/job/close

        -   Closes an existing job object from the database.
        -   Body:
            ```
            {
                jobId: number
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Unauthorized user -> Status code: 401
                -   Internal server error -> Status code: 500

    -   api/job/activate/:id
        -   Activates an existing job object from the database.
        -   Body:
            ```
            {
                jobId: number
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Unauthorized user -> Status code: 401
                -   Internal server error -> Status code: 500

User API

-   Interacts with:

    -   User, Student, and FacultyMember tables

-   Routes:

    -   api/user/sign-up

        -   HTTP Method: POST
        -   Creates and saves an user record in the user's table and a specific table (student and facultyMember), depending on the user's role.
        -   Body:

            ```
                {
                    user: {
                        firstName: string,
                        lastName: string,
                        email: string,
                        password: string,
                        confirmedPassword: string,
                        role: 'student' | 'facultyMember'
                    }
                }
            ```

        -   Parameters: None
        -   Response:
            -   success:
                -   Created: -> Status code: 201
            -   error:
                -   Invalid request -> Status code: 400
                -   Internal server error -> Status code: 500
                -   Unprocessable Entity -> Status code: 422
                    -   Missing required parameters:
                        ```
                        {
                            error: 'One or more of the required parameters was missing.'
                        }
                        ```
                    -   Password and confirmedPassword do not match
                        ```
                        {
                            error: 'Passwords do not match'
                        }
                        ```
                    -   Invalid role
                        ```
                        {
                            error: 'Invalid role'
                        }
                        ```
                    -   Email sent already belongs to an user
                        ```
                        {
                            error: 'Email is already taken'
                        }
                        ```

    -   api/user/sign-in

        -   HTTP Method: POST
        -   Sign ins an user by returning a cookie that contains a json web token.
        -   Body:
            ```
            {
                email: string,
                password": string
            }
            ```
        -   Parameters: None
        -   Response:

            -   success:

                -   OK -> Status code: 200
                    ```
                    {
                        isAuthenticated: boolean,
                        user: {
                            userId: number,
                            specificUserId: number,
                            role: 'student' | 'facultyMember',
                            firstName: string,
                            lastName: string
                        }
                    }
                    cookie: {
                        'access_token': jwt
                    }
                    ```

            -   error:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/user/sign-out

        -   HTTP Method: GET
        -   Sign out an user by clearing the cookie previously provided to the user.
        -   Cookies:
            ```
            {
                'access_token': jwt,
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                -   OK -> Status code: 200
                    ```
                    {
                        success: boolean,
                        user: {
                            userId: number,
                            specificUserId: number,
                            role: 'student' | 'facultyMember',
                            firstName: string,
                            lastName: string
                        }
                    }
                    ```
            -   error:
                -   Unauthorized: -> Status code: 401

    -   api/user/authenticated

        -   HTTP Method: GET
        -   Verifies whether or not an user is authenticated.
        -   Cookies:
            ```
            {
                'access_token': jwt,
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                -   OK -> Status code: 200
                    ```
                        {
                            isAuthenticated: boolean,
                            user: {
                                userId: number,
                                specificUserId: number,
                                role: 'student' | 'facultyMember',
                                firstName: string,
                                lastName: string
                            }
                        }
                    ```
            -   error:
                -   Unauthorized: -> Status code: 401

    -   api/user/get-by-email/:email
        -   HTTP Method: GET
        -   Get a user object given an email of the user.
        -   Cookies:
            ```
            {
                'access_token': jwt,
            }
            ```
        -   Parameters: email address of the user.
        -   Response:
            -   success:
                -   OK -> Status code: 200
                    ```
                        {
                            isAuthenticated: boolean,
                            user: {
                                userId: number,
                                specificUserId: number,
                                role: 'student' | 'facultyMember',
                                firstName: string,
                                lastName: string
                            }
                        }
                    ```
            -   error:
                -   Unauthorized -> Status code: 401
                -   Email does not exist -> Status code: 400
                -   Email of the logged-in user is requested -> Status code: 400

Faculty Member API

-   Interacts with:

    -   User and FacultyMember tables

-   Routes:

    -   api/facultyMember/update-profile

        -   Updates the fields of an existing faculty member and associated user record from the database.
        -   Body:
            ```
            {
                facultyMember: {
                    id: number,
                    user: {
                        id: number,
                        firstName: string,
                        middleName?: string,
                        lastName: string,
                        biography?: string,
                        email: string,
                    },
                    departmentId?: number,
                    websiteLink?: string,
                    office?: string,
                    title?: string
                }
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
            -   User must be owner of the profile
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/facultyMember/get-profile/:facultyMemberId

        -   Returns an existing faculty member and associated user, department, and course records from the database.
        -   Body: None
        -   Authorization restrictions:
            -   User must be logged in
        -   Parameters: id of faculty member
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    facultyMember: {
                        id: number,
                        user:{
                            id: number,
                            email: string,
                            biography?: string,
                            firstName: string,
                            lastName: string,
                            middleName?: string,
                        },
                        department?: {
                            id: number,
                            name: string,
                            college: {
                                name: string
                            }
                        },
                        websiteLink?: string,
                        office?: string,
                        title?: string
                    }
                }
                ```
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/facultyMember/get-posted-jobs

        -   Returns a list of job posted by the logged-in faculty member from the database.
        -   Body: None
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    jobs: [
                        {
                            id: number,
                            targetYears: string[],
                            hoursPerWeek: number,
                            description: string,
                            expirationDate: Date,
                            startDate: Date,
                            endDate: Date,
                            postedOn: Date,
                            type: string[],
                            title: string,
                            status: 'Hiring' | 'Closed',
                            minSalary: number,
                            maxSalary: number,
                            departmentId: number,
                            facultyMemberId: number,
                            department: {
                                id: number,
                                name: string,
                                collegeId: number,
                                college: {
                                    id: number,
                                    name: string
                                }
                            }
                        }
                    ]
                }
                ```
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/facultyMember/get-applicants/:jobId

        -   Returns a list of students who applied for a job with the given job Id from the database.
        -   Body: None
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a faculty member
            -   User must be an owner of the job
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    students: [
                        {
                            id: number,
                            sid: number,
                            classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior',
                            user: {
                                id: number,
                                email: : string,
                                biography: string,
                                firstName: string,
                                lastName: string,
                                middleName: string,
                                role: 'student'
                            },
                            department: {
                                id: number,
                                name: string,
                                college: {
                                    id: number,
                                    name: string
                                }
                            },
                            courses: [
                                {
                                    id: number,
                                    title: string
                                }
                            ]
                        }
                    ]
                }
                ```
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

Student API

-   Interacts with:

    -   User, Student, Department, and Courses tables

-   Routes:

    -   api/student/update-profile

        -   Updates the fields of an existing student and associated user object from the database.
        -   Body:
            ```
            {
                student: {
                    id: number,
                    user:{
                        id: number,
                        firstName: string,
                        middleName?: string,
                        lastName: string,
                        biography?: string,
                    },
                    departmentId?: number,
                    sid?: number,
                    classStanding?: 'freshman' | 'sophomore' | 'junior' | 'senior',
                    courses?: {
                        id: number
                    }[]
                }
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a student
            -   User must be owner of the profile
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/student/get-profile/:studentId

        -   Returns an existing student record and associated user, department, and course records from the database.
        -   Body: None
        -   Authorization restrictions:
            -   User must be logged in
        -   Parameters: id of student
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    student: {
                        id: number,
                        sid?: number,
                        classStanding?: 'freshman' | 'sophomore' | 'junior' | 'senior',
                        user: {
                            id: number,
                            email: : string,
                            biography?: string,
                            firstName: string,
                            lastName: string,
                            middleName?: string,
                            role: 'student'
                        },
                        department?: {
                            id: number,
                            name: string,
                            college: {
                                id: number,
                                name: string
                            }
                        },
                        courses: {
                            id: number,
                            title: string
                        }[]
                    }
                }
                ```
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   /api/student/apply-to-job

        -   Saves a student's job application information in the database.
        -   Body:
            ```
            {
                jobId: number
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a student
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/student/get-applied-jobs

        -   Returns a list of job application records associated with the logged-in student.
        -   Body: None
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be a student
        -   Parameters: None
        -   Response:

            -   success:
                Status code: 200

                ```
                {
                    jobs: {
                        id: number,
                        date: Date,
                        job: {
                            id: number,
                            targetYears: string[],
                            hoursPerWeek: number,
                            description: string,
                            expirationDate: Date,
                            startDate: Date,
                            endDate: Date,
                            postedOn: Date,
                            type: string[],
                            title: string,
                            status: 'Hiring' | 'Closed',
                            minSalary: number,
                            maxSalary: number,
                            department:{
                                id: number,
                                name: string,
                                collegeId: number
                            },
                            facultyMember: {
                                id: number,
                                websiteLink: string,
                                office: string,
                                title: string,
                                user: {
                                    id: number,
                                    email: string,
                                    biography: string,
                                    firstName: string,
                                    lastName: string,
                                    middleName: string
                                }
                            }
                        }
                    }[]
                }
                ```

            -   errors:
                -   Unauthorized user -> Status code: 401
                -   Internal server error -> Status code: 500

    -   api/student/search

        -   Filters student records based on queries and returns them.
        -   Body: None
        -   Parameters:
            ```
            {
                firstName?: string;
                lastName?: string;
                email?: string;
                sid?: string;
                departmentIds?: string[];
                classStandings?: 'freshman' | 'sophomore' | 'junior' | 'senior'[];
                page: string;
                numOfItems: string;
            };
            ```
        -   Authorization restrictions:
            -   User must be logged in
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    studentPreviews: {
                        id: number,
                        classStanding?: 'freshman' | 'sophomore' | 'junior' | 'senior',
                        user: {
                            firstName: string,
                            lastName: string,
                        },
                        department?: {
                            id: number,
                            name: string,
                        },
                    } [],
                    studentsCount: number
                }
                ```
            -   error:
                -   Invalid request -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

Department API

-   Interacts with:

    -   Department and College tables

-   Routes:

    -   api/department/create

        -   Creates and saves a department record in the department's table.
        -   Body:
            ```
            {
                department: {
                    name: string,
                    college: {
                        id: number,
            		}
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/department/read

        -   Gets all department records from the database.
        -   Body: None
        -   Parameters: None
        -   Response:

            -   success:
                Status code: 201

                    {
                        departments: {
                            id: number,
                            name: string,
                            college: {
                                id: number,
                                name: string,
                            }
                         }[]
                    }

            -   errors:
                -   Internal server error -> Status code: 500

    -   api/department/delete/:id

        -   Deletes an existing department record from the database.
        -   Body: None
        -   Parameters: id of department
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Internal server error -> Status code: 500

College API

-   Interacts with:

    -   College and Department tables

-   Routes:

    -   api/college/create

        -   Creates and saves a college record in the college's table.
        -   Body:
            ```
            {
                college: {
                    name: string
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Invalid request -> Status code: 400
                -   Unprocessable Entity -> Status code: 422
                -   Internal server error -> Status code: 500

    -   api/college/read

        -   Gets all college records from the database.
        -   Body: None
        -   Parameters: None
        -   Response:

            -   success:
                Status code: 201

                    {
                        colleges: {
                            id: number,
                            name: string,
                            departments: {
                                id: number,
                                name: string,
                            }[]
                        }[]
                    }

            -   errors:
                -   Internal server error -> Status code: 500

    -   api/college/delete/:id

        -   Deletes an existing college record from the database.
        -   Body: None
        -   Parameters: id of college
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Internal server error -> Status code: 500

Messaging API

-   Interacts with:

    -   Message and User tables

-   Routes:

    -   api/message/sendMessage

        -   Creates and saves a message record in the message's table.
        -   Authorization restrictions:
            -   User must be logged in
        -   Body:
            ```
            {
                content: string;
                receiverId: number;
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Internal server error -> Status code: 500

    -   api/message/getMessages/:messengerId

        -   Gets all messages between the logged-in user and the user with the parameter id, sorted from the oldest to the newest.
        -   Authorization restrictions:
            -   User must be logged in
        -   Body: None
        -   Parameters: id of the messenger.
        -   Response:

            -   success:
                Status code: 200

                    {
                        messages: {
                            id: number,
                            content: string,
                            date: string,
                            senderId: number,
                            receiverId: number,
                            sender: {
                                id: number,
                                email: string,
                                biography?: string,
                                firstName: string,
                                lastName: string,
                                middleName?: string
                            },
                            receiver: {
                                id: number,
                                email: string,
                                biography?: string,
                                firstName: string,
                                lastName: string,
                                middleName?: string
                            }
                        }[]
                    }

            -   errors:
                -   Internal server error -> Status code: 500

    -   api/message/getConversationList

        -   Get an array of Users who have communicated with the user with the given id and the latest message between each user and the user with the given id.
        -   Authorization restrictions:
            -   User must be logged in
        -   Body: None
        -   Parameters: None.
        -   Response:

            -   success:
                Status code: 200

                    conversationList: {
                        user: {
                            id: number,
                            email: string,
                            biography?: string,
                            firstName: string,
                            lastName: string,
                            middleName?: string
                        },
                        latestMessage: {
                            id: number,
                            content: string,
                            date: string,
                            senderId: number,
                            receiverId: number,
                            sender: {
                                id: number,
                                email: string,
                                biography?: string,
                                firstName: string,
                                lastName: string,
                                middleName?: string
                            },
                            receiver: {
                                id: number,
                                email: string,
                                biography?: string,
                                firstName: string,
                                lastName: string,
                                middleName?: string
                            }
                        }
                    }[]

            -   errors:
                -   Internal server error -> Status code: 500
