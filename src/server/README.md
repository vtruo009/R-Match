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

    -   api/job/create

        -   Saves a job object in the database
        -   Body:
            ```
            {
                job: {
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
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 201
            -   errors:
                -   Missing fields in body -> Status code: 400
                -   Internal server error -> Status code: 500
         
Job API

-   Interacts with:

    -   Job database table

-   Routes:

    -   
    -   api/job/update

        -   Updates the fields of existing job object from the database
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
                    endDate: Date,
                    type: string[],
                    title: string,
                    status: 'Hiring' | 'Closed',
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
                
    -   api/job/read
        -   Returns all job objects from database
        -   Body: None
        -   Parameters: None
        -   Response:
            -   success:
                Status code: 200
                ```
                {
                    job: {
                        id: number,
                        targetYears: string[],
                        hoursPerWeek: number,
                        description: string,
                        startDate: Date,
                        endDate: Date (Optional),
                        type: string[],
                        title: string,
                        status: string,
                        minSalary: number,
                        maxSalary: number,
                        departmentID: string,
                    } []
                }
                ```
                error:
                -   Internal server error -> Status code: 500
>>>>>>> added API design and implemented GetJobs API endpoint
