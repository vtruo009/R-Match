import API from 'api';

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    role: 'student' | 'facultyMember';
}

export async function isAuthenticatedRequest() {
    return API.get<{ user: IUser; isAuthenticated: boolean }>(
        'user/authenticated'
    );
}
