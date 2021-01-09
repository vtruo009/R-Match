import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { SelectFormField } from 'Components/SelectFormField';
import Loader from 'Components/Loader';
import { getCollegesAndDepartments, getCourses } from './api';
import useApi from 'hooks/useApi';
interface Props {
    showCourses?: boolean;
    collegeIdFromForm?: number;
    departmentIdFromForm?: number;
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean
    ) => void;
}

interface IBaseSelectValues {
    value?: number;
    label: string;
}

interface ICollegeDepartmentDict {
    [id: number]: IBaseSelectValues[];
}

function AcademicInfo({
    showCourses,
    collegeIdFromForm,
    departmentIdFromForm,
    setFieldValue,
}: Props) {
    const [
        collegeDepartmentDict,
        setCollegeDepartmentDict,
    ] = React.useState<ICollegeDepartmentDict>({});
    const [departmentIdSelected, setDepartmentIdSelected] = React.useState(0);
    const [colleges, setColleges] = React.useState<IBaseSelectValues[]>([]);
    const [departments, setDepartments] = React.useState<IBaseSelectValues[]>([
        { value: undefined, label: 'Select a college first' },
    ]);
    const [courses, setCourses] = React.useState<IBaseSelectValues[]>([
        { value: undefined, label: 'Select a department first' },
    ]);

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
                    // Initializes departments values
                    if (collegeIdFromForm === college.id) {
                        setDepartments(departments);
                    }
                    setCollegeDepartmentDict((prev) => ({
                        ...prev,
                        [college.id]: departments,
                    }));
                    return { value: college.id, label: college.name };
                });
                setColleges(colleges);
                // Initializes courses values
                if (departmentIdFromForm) {
                    setDepartmentIdSelected(departmentIdFromForm);
                    sendGetCoursesRequest();
                }
            },
        }
    );

    const getCoursesApiRequest = React.useCallback(
        () => getCourses(departmentIdSelected),
        [departmentIdSelected]
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

    const triggerCollegeChange = (e: React.ChangeEvent<{ value: number }>) => {
        const collegeId = e.target.value;
        if (collegeId) {
            setFieldValue('collegeId', collegeId, true);
            // Getting departments from cache
            setDepartments(collegeDepartmentDict[collegeId]);
        } else {
            setFieldValue('collegeId', undefined, true);
            setFieldValue('departmentId', undefined, true);
            setDepartments([
                { value: undefined, label: 'Select a college first' },
            ]);
        }
    };

    const triggerDepartmentChange = (
        e: React.ChangeEvent<{ value: number }>
    ) => {
        const departmentId = e.target.value;
        if (departmentId) {
            setFieldValue('departmentId', departmentId, true);
            setDepartmentIdSelected(departmentId);
            sendGetCoursesRequest();
        } else {
            setFieldValue('departmentId', undefined, true);
            setCourses([
                { value: undefined, label: 'Select a department first' },
            ]);
        }
    };

    React.useEffect(() => {
        sendCollegeDepartmentRequest();
    }, [sendCollegeDepartmentRequest]);

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
                            onChange={triggerCollegeChange}
                            defaultLabel='Select a college'
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Field
                            name='departmentId'
                            label='Department'
                            options={departments}
                            component={SelectFormField}
                            onChange={triggerDepartmentChange}
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
