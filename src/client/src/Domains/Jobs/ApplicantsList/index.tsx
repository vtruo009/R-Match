import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import Card from 'Components/Card';
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
}

interface IApplicantSearchForm {
    classStandings?: classStandingTypes[];
    minimumGpa?: string;
}

const formInitialValues: IApplicantSearchForm = {
    classStandings: [],
    minimumGpa: '',
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
});

const numOfItems = 5;
function ApplicantsList({ jobId }: ApplicantsListProps) {
    const [formState, setFormState] = React.useState<IApplicantSearchForm>(
        formInitialValues
    );
    const [
        page,
        setPage,
        ,
        setNumOfPages,
        PaginationProps,
        Pagination,
    ] = usePagination();
    const [applicants, setApplicants] = React.useState<IStudentPreview[]>([]);
    const request = React.useCallback(
        () =>
            getJobApplicants(
                jobId,
                page,
                numOfItems,
                formState.classStandings,
                formState.minimumGpa
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
            <Card style={{ borderRadius: 25, padding: 40 }}>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setFormState(formValues);
                        handleSearchAgain();
                    }}
                >
                    {() => (
                        <Form>
                            <Grid
                                container
                                spacing={4}
                                alignItems='center'
                                justify='center'
                            >
                                <Grid item md={3} xs={12}>
                                    <Field
                                        name='classStandings'
                                        label='Class standing'
                                        multiple
                                        options={classStandingValues}
                                        component={SelectFormField}
                                    />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Field
                                        name='minimumGpa'
                                        label='Minimum GPA'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <SubmitButton
                                        isLoading={isLoading}
                                        label='Filter'
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
