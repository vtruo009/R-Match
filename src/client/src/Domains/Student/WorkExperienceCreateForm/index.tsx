import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import WorkExperienceForm, {
    IWorkExperienceFormValues,
} from 'Domains/Student/WorkExperienceForm';
import { createWorkExperience } from '../api';

export type IWorkExperienceCreateFormValues = IWorkExperienceFormValues;

const workExperienceCreateFormInitialValues: IWorkExperienceCreateFormValues = {
    title: '',
    description: '',
    startDate: '',
    endDate: undefined,
    employer: '',
};

interface WorkExperienceCreateFormProps {
    onSuccess: () => void;
    studentId: number;
}

function WorkExperienceCreateForm({
    studentId,
    onSuccess,
}: WorkExperienceCreateFormProps) {
    const [
        workExperienceInitialValues,
        setWorkExperienceInitialValues,
    ] = React.useState<IWorkExperienceCreateFormValues>(
        workExperienceCreateFormInitialValues
    );
    const { openDialog, closeDialog, DialogProps, Dialog } = useDialog();
    const [snack] = useSnack();
    const request = React.useCallback(
        () => createWorkExperience(studentId, workExperienceInitialValues),
        [studentId, workExperienceInitialValues]
    );
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            closeDialog();
            onSuccess();
            snack('Work experience successfully added', 'success');
        },
    });

    return (
        <>
            <IconButton onClick={openDialog}>
                <AddIcon color='primary' />
            </IconButton>
            <Dialog {...DialogProps} title='Add Work Experience'>
                <WorkExperienceForm
                    onSubmit={(workExperienceBaseValues) => {
                        setWorkExperienceInitialValues(
                            workExperienceBaseValues
                        );
                        sendRequest();
                    }}
                    workExperienceInitialValues={
                        workExperienceCreateFormInitialValues
                    }
                    onCancel={closeDialog}
                    isLoading={isLoading}
                />
            </Dialog>
        </>
    );
}

export default WorkExperienceCreateForm;
