import API from 'api';

export interface JWTUser {
    id: number;
    firstName: string;
    lastName: string;
    role: 'student' | 'facultyMember';
}

export async function isAuthenticatedRequest() {
    return API.get<{ user: JWTUser; isAuthenticated: boolean }>(
        'user/authenticated'
    );
}
