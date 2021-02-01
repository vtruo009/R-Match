import API from 'api';

export interface IAuthUser {
    userId: number;
    specificUserId: number;
    firstName: string;
    lastName: string;
    role: 'student' | 'facultyMember';
}

export async function isAuthenticatedRequest() {
    return API.get<{ user: IAuthUser; isAuthenticated: boolean }>(
        '/user/authenticated'
    );
}
