import dotenv, { DotenvConfigOutput } from 'dotenv';

let result: DotenvConfigOutput;

if (process.env.NODE_ENV === 'test') {
    result = dotenv.config({
        path: `./env/test.env`,
    });
} else if (process.env.NODE_ENV === 'development') {
    result = dotenv.config({
        path: `./env/development.env`,
    });
} else {
    result = {};
}

if (result.error) {
    throw result.error;
}
