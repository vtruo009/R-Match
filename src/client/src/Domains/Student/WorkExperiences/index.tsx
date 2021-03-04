import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import useApi from 'hooks/useApi';
import Card from 'Components/Card';
import Loader from 'Components/Loader';
import WorkExperience from '../WorkExperience';
import WorkExperienceCreateForm from '../WorkExperienceCreateForm';
import { IWorkExperienceUpdateFormValues } from '../WorkExperienceUpdateForm';
import JobIcon from 'Domains/Jobs/JobIcon';
import { IWorkExperience, getWorkExperiences } from '../api';

interface WorkExperiencesProps {
    hasPermission: boolean;
    studentId: number;
}

function WorkExperiences({ hasPermission, studentId }: WorkExperiencesProps) {
    const [workExperiences, setWorkExperiences] = React.useState<
        IWorkExperience[]
    >([]);

    const getWorkExperiencesRequest = React.useCallback(
        () => getWorkExperiences(studentId),
        [studentId]
    );
    const [
        sendGetWorkExperiencesRequest,
        isGettingWorkExperiencesLoading,
    ] = useApi(getWorkExperiencesRequest, {
        onSuccess: (results) => {
            setWorkExperiences(results.data.workExperiences);
        },
    });

    const deleteWorkExperience = (workExperienceId: number) =>
        setWorkExperiences((prevWorkExperiences) =>
            prevWorkExperiences.filter(
                (WorkExperience) => WorkExperience.id !== workExperienceId
            )
        );

    const updateWorkExperience = (
        updatedWorkExperience: IWorkExperienceUpdateFormValues
    ) => {
        const workExperiencesToUpdate = [...workExperiences];
        const indexOfWorkExperienceToUpdate = workExperiences.findIndex(
            (workExperience) => workExperience.id === updatedWorkExperience.id
        );
        if (indexOfWorkExperienceToUpdate === -1) return;
        workExperiencesToUpdate[
            indexOfWorkExperienceToUpdate
        ] = updatedWorkExperience;
        setWorkExperiences(workExperiencesToUpdate);
    };

    React.useEffect(() => {
        sendGetWorkExperiencesRequest();
    }, [sendGetWorkExperiencesRequest]);

    return (
        <Card>
            <Grid container spacing={3}>
                <Grid item container justify='space-between'>
                    <Typography variant='h5' color='primary'>
                        Work Experiences{' '}
                        <JobIcon numberOfJobs={workExperiences.length} />
                    </Typography>
                    {hasPermission && (
                        <WorkExperienceCreateForm
                            onSuccess={sendGetWorkExperiencesRequest}
                        />
                    )}
                </Grid>
                <Grid item container spacing={3}>
                    {isGettingWorkExperiencesLoading ? (
                        <Loader centerRow />
                    ) : (
                        workExperiences.map((workExperience, index) => (
                            <Grid item key={index} xs={12}>
                                {index ? (
                                    <Divider style={{ marginBottom: 20 }} />
                                ) : (
                                    <> </>
                                )}
                                <WorkExperience
                                    workExperience={workExperience}
                                    hasPermission={hasPermission}
                                    onDeleteWorkExperience={
                                        deleteWorkExperience
                                    }
                                    onUpdateWorkExperience={
                                        updateWorkExperience
                                    }
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Grid>
        </Card>
    );
}

export default WorkExperiences;
