import React from 'react';
import { Field, FieldProps } from 'formik';
import Grid from '@material-ui/core/Grid';

import { SelectFormField } from 'Components/SelectFormField';
import Loader from 'Components/Loader';
import { getCollegesAndDepartments, getCourses } from './api';
import useApi from 'hooks/useApi';

interface AcademicInfoProps extends FieldProps {
    showCourses?: boolean;
}

interface IBaseSelectValues {
    value?: number;
    label: string;
}

interface ICollegeDepartmentDict {
    [id: number]: IBaseSelectValues[];
}

const departmentsDefaultValues = [
    { value: undefined, label: 'Select a college first' },
];

const coursesDefaultValues = [
    { value: undefined, label: 'Select a department first' },
];

function AcademicInfo({
    showCourses,
    form: {
        setFieldValue,
        values: { collegeId, departmentId },
    },
}: AcademicInfoProps) {
    const [
        collegeDepartmentDict,
        setCollegeDepartmentDict,
    ] = React.useState<ICollegeDepartmentDict>({});
    const [colleges, setColleges] = React.useState<IBaseSelectValues[]>([]);
    const [departments, setDepartments] = React.useState<IBaseSelectValues[]>(
        departmentsDefaultValues
    );
    const [courses, setCourses] = React.useState<IBaseSelectValues[]>(
        coursesDefaultValues
    );

    const collegeDepartmentApiRequest = React.useCallback(
        () => getCollegesAndDepartments(),
        []
    );

    const [sendCollegeDepartmentRequest, areCollegeDepartmentsLoading] = useApi(
        collegeDepartmentApiRequest,
        {
            onSuccess: (response) => {
                const colleges = response.data.colleges.map((college) => {
                    // Saving departments in cache
                    const departments = college.departments.map(
                        (department) => ({
                            value: department.id,
                            label: department.name,
                        })
                    );
                    setCollegeDepartmentDict((prev) => ({
                        ...prev,
                        [college.id]: departments,
                    }));
                    return { value: college.id, label: college.name };
                });
                setColleges(colleges);
            },
        }
    );

    const getCoursesApiRequest = React.useCallback(
        () => getCourses(departmentId),
        [departmentId]
    );

    const [sendGetCoursesRequest, areCoursesLoading] = useApi(
        getCoursesApiRequest,
        {
            onSuccess: (response) => {
                const courses = response.data.courses.map((course) => ({
                    value: course.id,
                    label: `${course.shortTitle} - ${course.fullTitle}`,
                }));
                setCourses(courses);
            },
        }
    );

    React.useEffect(() => {
        sendCollegeDepartmentRequest();
    }, [sendCollegeDepartmentRequest]);

    React.useEffect(() => {
        if (!collegeId) {
            setFieldValue('departmentId', undefined, true);
            setDepartments(departmentsDefaultValues);
        } else if (collegeDepartmentDict[collegeId]) {
            setDepartments(collegeDepartmentDict[collegeId]);
        }
    }, [collegeId, collegeDepartmentDict, setFieldValue]);

    React.useEffect(() => {
        if (departmentId && showCourses) {
            sendGetCoursesRequest();
        } else {
            setCourses(coursesDefaultValues);
        }
    }, [departmentId, sendGetCoursesRequest, showCourses]);

    return (
        <Grid container item justify='center'>
            {areCollegeDepartmentsLoading ? (
                <Loader size={30} />
            ) : (
                <Grid container item spacing={4} justify='center'>
                    <Grid item md={6} xs={12}>
                        <Field
                            name='collegeId'
                            label='College'
                            options={colleges}
                            component={SelectFormField}
                            defaultLabel='Select a college'
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Field
                            name='departmentId'
                            label='Department'
                            options={departments}
                            component={SelectFormField}
                        />
                    </Grid>
                    {showCourses && (
                        <Grid container item justify='center' md={12} xs={12}>
                            {areCoursesLoading ? (
                                <Loader size={30} />
                            ) : (
                                <Field
                                    name='courseIds'
                                    label='Courses'
                                    options={courses}
                                    multiple
                                    component={SelectFormField}
                                />
                            )}
                        </Grid>
                    )}
                </Grid>
            )}
        </Grid>
    );
}

export default AcademicInfo;
