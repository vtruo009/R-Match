import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

import EditButton from 'Components/EditButton';

function ProfileImage() {
    const [previewSource, setPreviewSource] = React.useState<string>();
    const uploadedImage = React.useRef<HTMLImageElement>(null);
    const imageUploader = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {}, [imageUploader]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target?.files;
        let file: File;
        if (files) {
            file = files[0];
            previewFile(file);
        }
    };

    const previewFile = (file: File) => {
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    setPreviewSource(reader.result as string);
                }
            };
        }
    };

    React.useEffect(() => console.log(previewSource), [previewSource]);

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
                overlap='circle'
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={
                    <EditButton
                        onClick={() => imageUploader?.current?.click()}
                    />
                }
            >
                <Avatar
                    ref={uploadedImage}
                    alt='profile'
                    style={{ width: 200, height: 200 }}
                    src={previewSource ? previewSource : ''}
                />
            </Badge>
        </div>
    );
}

export default ProfileImage;
