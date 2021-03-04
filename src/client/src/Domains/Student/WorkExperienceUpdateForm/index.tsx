import React from 'react';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import WorkExperienceForm, {
    IWorkExperienceFormValues,
} from 'Domains/Student/WorkExperienceForm';
import EditButton from 'Components/EditButton';
import { updateWorkExperience } from '../api';

export interface IWorkExperienceUpdateFormValues
    extends IWorkExperienceFormValues {
    id: number;
}

interface JobUpdateFormProps {
    workExperienceInitialValues: IWorkExperienceUpdateFormValues;
    onSuccess: (updatedWorkExperience: IWorkExperienceUpdateFormValues) => void;
}

function JobUpdateForm({
    workExperienceInitialValues,
    onSuccess,
}: JobUpdateFormProps) {
    const [
        workExperienceToUpdate,
        setWorkExperienceToUpdate,
    ] = React.useState<IWorkExperienceUpdateFormValues>(
        workExperienceInitialValues
    );
    const { openDialog, closeDialog, DialogProps, Dialog } = useDialog();
    const [snack] = useSnack();
    const request = React.useCallback(
        () => updateWorkExperience(workExperienceToUpdate),
        [workExperienceToUpdate]
    );
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            closeDialog();
            onSuccess(workExperienceToUpdate);
            snack('Work experience successfully updated', 'success');
        },
    });

    React.useEffect(
        () => setWorkExperienceToUpdate(workExperienceInitialValues),
        [workExperienceInitialValues]
    );

    return (
        <>
            <EditButton onClick={openDialog} />
            <Dialog {...DialogProps} title='Update Work Experience'>
                <WorkExperienceForm
                    onSubmit={(workExperienceBaseValues) => {
                        setWorkExperienceToUpdate((prevWorkExperience) => ({
                            ...workExperienceBaseValues,
                            id: prevWorkExperience.id,
                        }));
                        sendRequest();
                    }}
                    onCancel={closeDialog}
                    workExperienceInitialValues={workExperienceToUpdate}
                    isLoading={isLoading}
                />
            </Dialog>
        </>
    );
}

export default JobUpdateForm;
