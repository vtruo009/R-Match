import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { SelectFormField } from 'Components/SelectFormField';
import Loader from 'Components/Loader';
import { getCollegesAndDepartments, getCourses } from './api';
import useApi from 'hooks/useApi';

/*
    TODO: This component is not done yet
    Note: The form state of the parent component must have the following attributes:
        - collegeId
        - departmentId
        - courseIds
*/

interface Props {
    showCourses?: boolean;
    collegeIdFromForm?: number;
    departmentIdFromForm?: number;
    courseIdsFromForm?: number[];
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
    courseIdsFromForm,
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
        // Need to wait for 500 ms for event to stabilize
        setTimeout(() => {
            const collegeId = e.target.value;
            if (collegeId) {
                // Getting departments from cache
                setDepartments(collegeDepartmentDict[collegeId]);
            } else {
                setDepartments([
                    { value: undefined, label: 'Select a college first' },
                ]);
            }
        }, 500);
    };

    const triggerDepartmentChange = (
        e: React.ChangeEvent<{ value: number }>
    ) => {
        // Need to wait for 500 ms for event to stabilize
        setTimeout(() => {
            const departmentId = e.target.value;
            if (departmentId) {
                setDepartmentIdSelected(departmentId);
                sendGetCoursesRequest();
            } else {
                setCourses([
                    { value: undefined, label: 'Select a department first' },
                ]);
            }
        }, 500);
    };

    React.useEffect(() => {
        sendCollegeDepartmentRequest();
        // setTimeout(() => {
        //     // Initializes values for the select components
        //     console.log(collegeDepartmentDict);
        //     if (collegeIdFromForm && departmentIdFromForm) {
        //         setDepartments(collegeDepartmentDict[collegeIdFromForm]);
        //     }
        //     if (departmentIdFromForm && courseIdsFromForm) {
        //         setDepartmentIdSelected(departmentIdFromForm);
        //         sendGetCoursesRequest();
        //     }
        // }, 3000);
    }, [sendCollegeDepartmentRequest]);

    return (
        <Grid container item justify='center'>
            {areCollegeDepartmentsLoading ? (
                <Grid item>
                    <Loader size={30} />
                </Grid>
            ) : (
                <Grid container item spacing={4} justify='center'>
                    <Grid item md={6} xs={12}>
                        <Field
                            name='collegeId'
                            label='College'
                            options={colleges}
                            component={SelectFormField}
                            onClose={triggerCollegeChange}
                            defaultLabel='Select a college'
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Field
                            name='departmentId'
                            label='Department'
                            options={departments}
                            component={SelectFormField}
                            onClose={triggerDepartmentChange}
                        />
                    </Grid>
                    {showCourses && (
                        <Grid container item justify='center'>
                            {areCoursesLoading ? (
                                <Grid item>
                                    <Loader size={30} />
                                </Grid>
                            ) : (
                                <Grid item md={12} xs={12}>
                                    <Field
                                        name='courseIds'
                                        label='Courses'
                                        options={courses}
                                        multiple
                                        component={SelectFormField}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Grid>
            )}
        </Grid>
    );
}

export default AcademicInfo;
