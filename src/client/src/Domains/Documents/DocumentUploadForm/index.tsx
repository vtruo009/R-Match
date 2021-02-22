import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field} from 'formik';
import * as yup from 'yup';

import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import { Checkbox, FormControlLabel} from '@material-ui/core';
import { documentType } from 'Domains/Documents/api'
import { SimpleFileUpload } from 'Components/FileUploadField';
import useSnack from 'hooks/useSnack';

import { createDocument } from 'Domains/Documents/api';
import useApi from 'hooks/useApi';

export interface IDocumentUploadForm {
    name: string,
    type: string,
    isDefault: boolean,
    dateAdded: string,
    document: Buffer,
}

interface DocumentUploadFormProps {
    //formInitialValues: DocumentUploadFormType;
    // formInitialValues: IDocumentUploadForm;
    // isLoading: boolean;
    // onCancel: () => void;
    // //onSubmit: (file: DocumentUploadFormType) => void;
    // onSubmit: (file: IDocumentUploadForm) => void;
    onSubmit: () => void;
}

// interface DocumentUploadFormType {
//     name: string,
//     type: string,
//     isDefault?: boolean,
// }

// const formInitialValues: DocumentUploadFormType = {
const formInitialValues: IDocumentUploadForm = {
    name: '',
    type: '',
    isDefault: false,
    dateAdded: '',
    document: Buffer.alloc(0),
};

const formSchema = yup.object({
    //name: yup.string().required('Name is required'),
    type: yup.string().required('Please choose a type'),
    //isDefault: yup.boolean().optional(),
    document: yup
        .mixed()
        .test('empty-check', 'Please select a document', (value) => {
            return (
                !value || (value && ['application/pdf'].includes(value.type))
            );
        })
        .test('fileFormat', 'PDF only', (value) => {
            return (
                !value || (value && ['application/pdf'].includes(value.type))
            );
        })
});

function DocumentUploadForm(
    {
//     //isLoading,
//     onCancel,
    onSubmit,
}: DocumentUploadFormProps
) {
    const [ docInitialValues, setDocInitialValues] = React.useState<IDocumentUploadForm>(formInitialValues);

    const [snack] = useSnack();
    const request = React.useCallback( () => createDocument(docInitialValues), [
        docInitialValues
    ]);

    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: () => {
            //sendRequest();
            snack('Document successfully uploaded', 'success');
            onSubmit();
        }
    })

    return (
        <Formik
            validationSchema={formSchema}
            initialValues={formInitialValues}
            onSubmit={(formValues) => {
                setDocInitialValues(formValues);
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
                        <Grid item md={6} xs={12}>
                            <Field
                                name='type'
                                label='Document Type'
                                options={documentType}
                                component={SelectFormField}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Field
                                name='document'
                                type='file'
                                component={SimpleFileUpload}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justify='flex-end'
                        style={{marginTop: 20}}    
                    >
                        <FormControlLabel
                            label='Make Default'
                            control={
                                <Checkbox
                                    color='primary'
                                />
                            }
                        />
                        <SubmitButton
                            isLoading={false}
                        />
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default DocumentUploadForm;