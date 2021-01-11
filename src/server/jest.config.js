module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    collectCoverage: true,
    moduleNameMapper: {
        '@modules/(.*)': '<rootDir>/src/modules/$1',
        '@entities/(.*)': '<rootDir>/src/entities/$1',
        '@shared/(.*)': '<rootDir>/src/shared/$1',
        '@lib/(.*)': '<rootDir>/src/lib/$1',
        '@server/(.*)': '<rootDir>/src/server/$1',
        '@db/(.*)': '<rootDir>/src/db/$1',
        '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    },
};
