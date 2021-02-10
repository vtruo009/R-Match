import API from 'api';

export async function saveProfileImage(imageAsBase64: string) {
    return API.post('/user/save-profile-image', {
        imageAsBase64,
    });
}

export async function getProfileImage(userId: number) {
    return API.get<{ imageAsBase64?: string }>(
        `/user/get-profile-image/${userId}`
    );
}
