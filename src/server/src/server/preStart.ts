import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

import { connectToDb } from '@db/connection';

// Setup command line options
const options = commandLineArgs([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'development',
        type: String,
    },
]);

// Set the env file
const result2 = dotenv.config({
    path: `./env/${options.env as string}.env`,
});

if (result2.error) {
    throw result2.error;
}

// Initializes database
(async () => {
    await connectToDb();
})();
