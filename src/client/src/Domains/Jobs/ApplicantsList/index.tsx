import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import Card from 'Components/Card';
import AcademicInfo from 'Components/AcademicInfo';
import { TextFormField } from 'Components/TextFormField';
import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import usePagination from 'hooks/usePagination';
import { getJobApplicants } from 'Domains/Jobs/api';
import { IStudentPreview } from 'Domains/Student/api';
import StudentsList from 'Domains/Student/StudentsList';
import { classStandingValues, classStandingTypes } from 'Domains/Student/api';
interface ApplicantsListProps {
    jobId: number;
    jobTitle: string;
}

interface IApplicantSearchForm {
    classStandings?: classStandingTypes[];
    minimumGpa?: string;
    departmentId?: number[];
}

const formInitialValues: IApplicantSearchForm = {
    classStandings: [],
    minimumGpa: '',
    departmentId: [],
};

const formSchema = yup.object({
    classStandings: yup.array(yup.string()).optional(),
    minimumGpa: yup
        .string()
        .matches(
            /^[0]|[0-3]\.(\d?\d?)|[4].[0]$/,
            'GPA must be in the range 0.00 - 4.00'
        )
        .optional()
        .nullable(),
    departmentId: yup.array(yup.number()).optional(),
});

const numOfItems = 10;
function ApplicantsList({ jobId, jobTitle }: ApplicantsListProps) {
    const [formState, setFormState] = React.useState<IApplicantSearchForm>(
        formInitialValues
    );
    const {
        page,
        setPage,
        setNumOfPages,
        PaginationProps,
        Pagination,
    } = usePagination();
    const [applicants, setApplicants] = React.useState<IStudentPreview[]>([]);
    const request = React.useCallback(
        () =>
            getJobApplicants(
                jobId,
                page,
                numOfItems,
                formState.classStandings,
                formState.minimumGpa,
                formState.departmentId
            ),
        [jobId, page, formState]
    );
    const handleSearchAgain = () => {
        if (page > 0) setPage(1);
        sendRequest();
    };
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            const { jobApplicants, jobApplicantsCount } = response.data;
            if (jobApplicants.length > 0) {
                const studentPreviews = response.data.jobApplicants.map(
                    (jobApplicants) => jobApplicants.student
                );
                setNumOfPages(Math.ceil(jobApplicantsCount / numOfItems));
                setApplicants(studentPreviews);
            } else {
                snack('No applicants were found', 'warning');
            }
        },
    });

    React.useEffect(() => sendRequest(), [sendRequest]);

    return (
        <div>
            <Card>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setFormState(formValues);
                        handleSearchAgain();
                    }}
                >
                    {() => (
                        <Form style={{ padding: 10 }}>
                            <Grid container spacing={4} alignItems='center'>
                                <Grid item xs={12}>
                                    <Typography color='primary' variant='h5'>
                                        {jobTitle}
                                    </Typography>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='classStandings'
                                        label='Class standings'
                                        multiple
                                        options={classStandingValues}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Field
                                        name='minimumGpa'
                                        label='Minimum GPA'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Field
                                    component={AcademicInfo}
                                    multipleDepartments
                                />
                                <Grid item md={4} xs={12}>
                                    <SubmitButton
                                        isLoading={isLoading}
                                        label='Search'
                                        startIcon={<SearchIcon />}
                                    />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Card>
            <div style={{ paddingTop: 30 }}>
                {applicants.length > 0 && (
                    <StudentsList studentPreviews={applicants}></StudentsList>
                )}
            </div>
            <Pagination {...PaginationProps} onPageChange={sendRequest} />
        </div>
    );
}

export default ApplicantsList;
