# CS178A-B-Project-Undegraduate TA/ Faculty Matching Tool

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [How To Run](#how-to-run)
- [Diagrams](#diagrams)
- [Dependencies](#dependencies)

## Overview

The CSE department has an initiative to hire more undergraduate students to serve as "readers" or "undergraduate Learning Assistants". Therefore, our senior design project will be to build a platform that facilitates the matching process of students and faculty/courses. The project would involve building a web-application that comes with the following features:

    - Allow faculty to request "ULA" positions for their course (post a position)
    - Allow students to apply for the position and enter relevant information
    - Allow faculty to select from a pool of interested students
    - Match faculty to undergraduate/graduate students based on the tasks appointed by the professor (i.e.: Grading papers, separating chemicals for a lab, dissecting frog brains for biological research, etc.)

## Team

- <a href="https://github.com/msalloum" target="_blank"><img src="https://avatars3.githubusercontent.com/u/1790819?s=400&v=4" align="left" height="30px">Mariam Salloum </a>

- <a href="https://github.com/johan1505" target="_blank"> Johan Guzman</a>
- <a href="https://github.com/Mari-Hayashi" target="_blank">Mari Hayashi</a>
- <a href="https://github.com/sydneypun" target="_blank">Sydney Pun </a>
- <a href="https://github.com/vtruo009" target="_blank">Vam Truong </a>

## Usage

Demo: <Link to youtube video>

<Screenshot of application>

To run the entire application in dev mode:

- cd into src
- run docker-compose up

The following services will run:

- Backend - localhost port 5000
- Fronted application - localhost port 3000
- PostgreSQL database - locahost port 5432

## Diagrams

Backend Structure
-   ER Diagram
![Alt text](pictures/DatabaseERDiagram.png?raw=true)

-   UML Class Diagram
![Alt text](pictures/ClassUML.png?raw=true)

Overall System Diagram
![Alt text](pictures/HighLevelDiagram.png?raw=true)


## Dependencies

- Backend:
    - Dependencies:
        -   bcrypt
        -   cors
        -   passport
        -   passport-jwt
        -   passport-local
        -   command-line-args
        -   cookie-parser
        -   cors
        -   dotenv
        -   express
        -   express-async-errors
        -   helmet
        -   http-status-codes
        -   jet-logger
        -   jsonwebtoken
        -   module-alias
        -   morgan
        -   pg
        -   reflect-metadata
        -   typeorm

    - Dev Dependencies:
        -   node
        -   jasmine
        -   supertest
        -   eslint-plugin
        -   parser
        -   eslint
        -   nodemon
        -   ts-node
        -   tsconfig-paths
        -   typescript

- Frontend:
    -   @material-ui/core
    -   @material-ui/icons
    -   @material-ui/lab
    -   @testing-library/jest-dom
    -   @testing-library/react
    -   @testing-library/user-event
    -   jest
    -   node
    -   react
    -   react-dom
    -   react-router-dom
    -   yup
    -   axios
    -   date-fns
    -   formik
    -   formik-material-ui
    -   notistack
    -   react-scripts
    -   typescript