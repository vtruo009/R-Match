import dotenv, { DotenvConfigOutput } from 'dotenv';

let result: DotenvConfigOutput;

if (process.env.NODE_ENV === 'test') {
    result = dotenv.config({
        path: `./env/test.env`,
    });
} else {
    result = dotenv.config({
        path: `./env/development.env`,
    });
}

if (result.error) {
    throw result.error;
}
