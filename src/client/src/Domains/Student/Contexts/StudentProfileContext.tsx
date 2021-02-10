import React from 'react';

interface IStudentProfileContext {
    hasPermission: boolean;
    userId?: number;
}

export const defaultStudentProfileData: IStudentProfileContext = {
    userId: undefined,
    hasPermission: false,
};

export default React.createContext<IStudentProfileContext>(
    defaultStudentProfileData
);
