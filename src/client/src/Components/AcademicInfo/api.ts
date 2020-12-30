import API from 'api';

export interface _ICollege {
    id: number;
    name: string;
}

export interface _IDepartment {
    id: number;
    name: string;
}

export interface IDepartment extends _IDepartment {
    college: _ICollege;
}

export interface ICollege extends _ICollege {
    departments: _IDepartment[];
}

interface ICourse {
    id: number;
    shortTitle: string;
    fullTitle: string;
}

export function getCollegesAndDepartments() {
    return API.get<{ colleges: ICollege[] }>('college/read');
}

export function getCourses(departmentId: number) {
    return API.get<{ courses: ICourse[] }>(`course/read/${departmentId}`);
}
