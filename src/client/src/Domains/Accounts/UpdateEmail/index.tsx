import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useApi from 'hooks/useApi';
import useSnack from 'hooks/useSnack';
import useDialog from 'hooks/useDialog';
import { TextFormField } from 'Components/TextFormField';
import SubmitButton from 'Components/SubmitButton';
import EditButton from 'Components/EditButton';
import { updateEmail } from 'Domains/Accounts/api';
import { AuthContext } from 'Contexts/AuthContext';

export interface IUpdateEmailForm {
    email: string;
}

const formInitialValues: IUpdateEmailForm = {
    email: '',
};

const formSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter valid email'),
});

function UpdateEmail() {
    const history = useHistory();
    const { Dialog, DialogProps, openDialog } = useDialog();
    const { setUser, setIsAuthenticated } = React.useContext(AuthContext);
    const [
        updateEmailInfo,
        setUpdateEmailInfo,
    ] = React.useState<IUpdateEmailForm>(formInitialValues);
    const request = React.useCallback(
        () => updateEmail(updateEmailInfo.email),
        [updateEmailInfo]
    );
    const [snack] = useSnack();
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            setUser(undefined);
            setIsAuthenticated(false);
            history.push('/');
            snack(
                'Email successfully updated. Please check your email inbox to verify it!',
                'success'
            );
        },
        onFailure: (error, results) => {
            console.log(error);
            if (results) {
                snack(results.data.error, 'error');
            } else {
                snack('Something went wrong. Try again later!', 'error');
            }
        },
    });

    return (
        <>
            <EditButton onClick={openDialog} />
            <Dialog {...DialogProps} title='Update Email'>
                <Formik
                    validationSchema={formSchema}
                    initialValues={formInitialValues}
                    onSubmit={(formValues) => {
                        setUpdateEmailInfo(formValues);
                        sendRequest();
                    }}
                >
                    {() => (
                        <Form>
                            <Grid
                                container
                                spacing={5}
                                justify='center'
                                alignItems='center'
                            >
                                <Grid item xs={12}>
                                    <Field
                                        name='email'
                                        label='New email'
                                        component={TextFormField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <SubmitButton
                                        isLoading={isLoading}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
}

export default UpdateEmail;
