# R'Match server application

### Steps to run application:

1. Make sure Docker is running is your local machine
2. Run npm install if you haven't already
3. Run docker-compose up

### API Design

Sample API (follow this as a template when designing your API endpoints)

-   Interacts with:

    -   Sample database table

-   Routes:

    -   api/sample/read
        -   Returns all sample objects from the database
        -   Body: None
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    samples: {
                        message: string,
                        num: number,
                        id: number
                    } []
                }
                ```
            -   errors:
                -   Internal server error -> Status code: 500
    -   api/sample/create

        -   Saves a sample object in the database
        -   Body:
            ```
            {
                sample: {
                    message: string,
                    num: number,
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500

    -   api/sample/update

        -   Updates the fields of existing sample object from the database
        -   Body:
            ```
            {
                sample: {
                    id: number,
                    message: string,
                    num: number
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500

    -   api/sample/delete
        -   Deletes an existing sample object from the database
        -   Body: None
        -   Parameters: /:id
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Internal server error -> Status code: 500

Job API

-   Interacts with:

    -   Job database table

-   Routes:

    -   api/job/read

        -   Returns all job objects from database
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
                        endDate: Date (Optional),
                        type: string[],
                        title: string,
                        status: 'Hiring' | 'Closed',
                        minSalary: number,
                        maxSalary: number,
                        departmentID: string,
                    } []
                }
                ```
            -   error:
                - Internal server error -> Status code: 500
                - Unauthorized user -> Status code: 401

    -   api/job/create

        -   Saves a job object in the database
        -   Body:
            ```
            {
                jobs: {
                    targetYears: string[],
                    hoursPerWeek: number,
                    description: string,
                    expirationDate: Date, (Optional)
                    startDate: Date,
                    endDate: Date, (Optional)
                    type: string[],
                    title: string,
                    status: 'Hiring' | 'Closed',
                    minSalary: number,
                    maxSalary: number, (Optional)
                    departmentId: string
                }
            }
            ```
        -   Authorization restrictions:
            -   User must be logged in
            -   User must be faculty member
        -   Parameters: None
        -   Response:
            -   success:
                    Status code: 201
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Unauthorized user -> Status code: 401
                -   Internal server error -> Status code: 500

    -   api/job/update

        -   Updates the fields of existing job object from the database
        -   Body:
            ```
            {
                sample: {
                    id: number,
                    targetYears: string[],
                    hoursPerWeek: number,
                    description: string,
                    expirationDate: Date,
                    startDate: Date,
                    endDate: Date,
                    type: string[],
                    title: string,
                    status: string,
                    minSalary: number,
                    maxSalary: number,
                    departmentId: string
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500

    -   api/job/delete
        -   Deletes an existing job object from the database
        -   Body: None
        -   Parameters: /:id
        -   Response:
            -   success:
                Status code: 200
            -   errors:
                -   Internal server error -> Status code: 500

User API

-   Interacts with:

    -   User, Student, and FacultyMember tables

-   Routes:

    -   api/user/sign-up

        -   HTTP Method: POST
        -   Creates and saves an user record in the user's table and a specific table (student and facultyMember), depending on the user's role

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
                -   Internal server error: -> Status code: 500
                -   Bad request: -> Status code: 400
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
        -   Sign ins an user by returning a cookie that contains a json web token
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

                -   OK: -> Status code: 200

                    ```
                        {
                            isAuthenticated: boolean,
                            user: {
                                id: number,
                                role: student | facultyMember,
                                firstName: string,
                                lastName: string
                            }
                        }
                        cookie: {
                            'access_token': jwt
                        }
                    ```

            -   error:
                -   Unauthorized: -> Status code: 401

    -   api/user/sign-out
        -   HTTP Method: GET
        -   Sign out an user by clearing the cookie previously provided to the user
        -   Cookies:
            ```
            {
                'access_token': jwt,
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                -   OK: -> Status code: 200
                    ```
                        {
                            success: boolean,
                            user: {
                                id: number,
                                role: student | facultyMember,
                                firstName: string,
                                lastName: string
                            }
                        }
                    ```
            -   error:
                -   Unauthorized: -> Status code: 401

    -   api/user/authenticated
        -   HTTP Method: GET
        -   Verifies whether or not an user is authenticated
        -   Cookies:
            ```
            {
                'access_token': jwt,
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                -   OK: -> Status code: 200
                    ```
                        {
                            isAuthenticated: boolean,
                            user: {
                                id: number,
                                role: student | facultyMember,
                                firstName: string,
                                lastName: string
                            }
                        }
                    ```
            -   error:
                -   Unauthorized: -> Status code: 401

Faculty Member API

-   Interacts with:

    -   User and FacultyMember tables

-   Routes:

    -   api/facultyMember/update-profile

        -   Updates the fields of an existing facultyMember and associated user object from the database.
        -   Body:
            ```
            {
                facultyMember: {
                    id: number,
                    user:{
                        id: number,
                        firstName: string,
                        middleName: string, // optional
                        lastName: string,
                        biography: string, // optional
                    },
                    department: {
                        id: number,
                        name: string,
                        college:{
                            name: string
                        }
                    }, // optional
                    websiteLink: string, // optional
                    office: string, // optional
                    title: string // optional
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500
                
    -   api/facultyMember/get-profile

        -   Returns an existing faculty member object and associated user, department, and course objects from the database.
        -   Body:
            ```
            {
                id: number
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    facultyMember: {
                        id: number,
                        user:{
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
                            college:{
                                name: string
                            }
                        },
                        websiteLink: string,
                        office: string,
                        title: string
                    }
                }
                ```
            -   error:
                Internal server error -> Status code: 500
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500

Student API

-   Interacts with:

    -   User and Student tables

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
                        middleName: string, // optional
                        lastName: string,
                        biography: string, // optional
                    },
                    department: {
                        id: number,
                        name: string,
                        college:{
                            name: string
                        }
                    }, // optional
                    sid: number, // optional
                    classStanding: 'freshman' | 'sophomore' | 'junior' | 'senior', // optional
                    courses:[
                        {
                            title: string
                        }
                    ] // optional
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500
                
    -   api/student/get-profile

        -   Returns an existing student object and associated user, department, and course objects from the database.
        -   Body:
            ```
            {
                id: number
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    student: {
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
                        courses: {
                                id: number,
                                title: string
                        }[]
                    }
                }
                ```
            -   error:
                Internal server error -> Status code: 500
            -   errors:
                -   Missing fields in body -> Status code: 400
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
                        name: string
					}
                }
            }
            ```
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500
                

College API

-   Interacts with:

    -   College tables

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
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500