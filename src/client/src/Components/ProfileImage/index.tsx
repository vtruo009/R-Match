import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import useSnack from 'hooks/useSnack';
import useApi from 'hooks/useApi';
import Loader from 'Components/Loader';
import { saveProfileImage, getProfileImage } from './api';

interface ProfileImageProps {
    userId: number;
    hasPermission: boolean;
}

function ProfileImage({ userId, hasPermission }: ProfileImageProps) {
    const [previewSource, setPreviewSource] = React.useState<string>('');
    const uploadedImage = React.useRef<HTMLImageElement>(null);
    const imageUploader = React.useRef<HTMLInputElement>(null);
    const [snack] = useSnack();
    const getImageRequest = React.useCallback(() => getProfileImage(userId), [
        userId,
    ]);
    const saveImageRequest = React.useCallback(
        () => saveProfileImage(previewSource),
        [previewSource]
    );
    const [sendGetImageRequest, isGettingImageLoading] = useApi(
        getImageRequest,
        {
            onSuccess: (results) => {
                const { imageAsBase64 } = results.data;
                if (imageAsBase64) {
                    const [, image] = imageAsBase64.split('image');
                    const [mime, data] = image.split('base64');
                    setPreviewSource(`data:image${mime};base64,${data}`);
                }
            },
        }
    );

    const [sendSaveImageRequest, isSavingImageLoading] = useApi(
        saveImageRequest,
        {
            onSuccess: () => snack('Image successfully uploaded', 'success'),
        }
    );

    React.useEffect(() => {
        sendGetImageRequest();
    }, [sendGetImageRequest]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) previewFile(files[0]);
    };

    const previewFile = (file: File) => {
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    setPreviewSource(reader.result as string);
                    sendSaveImageRequest();
                }
            };
        }
    };
    return (
        <div>
            <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                ref={imageUploader}
                style={{
                    display: 'none',
                }}
            />
            <Badge
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={
                    hasPermission ? (
                        <IconButton
                            color='primary'
                            disabled={isSavingImageLoading}
                            onClick={() => imageUploader?.current?.click()}
                        >
                            <PhotoCameraIcon />
                        </IconButton>
                    ) : (
                        <> </>
                    )
                }
            >
                {isGettingImageLoading ? (
                    <Loader size={60} />
                ) : (
                    <Avatar
                        ref={uploadedImage}
                        alt='Profile Picture'
                        style={{ width: 200, height: 200 }}
                        src={previewSource ? previewSource : ''}
                    />
                )}
            </Badge>
        </div>
    );
}

export default ProfileImage;
