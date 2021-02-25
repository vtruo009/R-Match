import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import useSnack from 'hooks/useSnack';
import useApi from 'hooks/useApi';
import { SelectFormField } from 'Components/SelectFormField';
import SubmitButton from 'Components/SubmitButton';
import { SimpleFileUpload } from 'Components/FileUploadField';
import { CheckBoxField } from 'Components/CheckBoxField';
import { createDocument } from 'Domains/Documents/api';
import { documentType } from 'Domains/Documents/api';

export interface IDocumentUploadForm {
    type: string;
    isDefault: boolean;
    data: Blob;
}

interface DocumentUploadFormProps {
    onSubmit: () => void;
}

const formInitialValues: IDocumentUploadForm = {
    type: '',
    isDefault: false,
    data: new Blob(),
};

const formSchema = yup.object({
    type: yup.string().required('Please choose a type'),
    isDefault: yup.boolean().optional(),
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
        }),
});

function DocumentUploadForm({ onSubmit }: DocumentUploadFormProps) {
    const [
        documentValues,
        setDocumentValues,
    ] = React.useState<IDocumentUploadForm>(formInitialValues);
    const [encodedPDF, setEncodedPDF] = React.useState<string>('');
    const [documentName, setDocumentName] = React.useState('');
    const [snack] = useSnack();
    const createDocumentRequest = React.useCallback(
        () =>
            createDocument(
                documentName,
                documentValues.type,
                documentValues.isDefault,
                encodedPDF
            ),
        [documentName, documentValues, encodedPDF]
    );
    const [sendRequest, isLoading] = useApi(createDocumentRequest, {
        onSuccess: () => {
            snack('Document successfully uploaded', 'success');
            onSubmit();
        },
    });

    async function getPDFBase64(pdfFile: Blob) {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.DONE) {
                    resolve(e.target.result as string);
                }
            };
            reader.readAsDataURL(pdfFile);
        });
    }

    return (
        <Formik
            validationSchema={formSchema}
            initialValues={formInitialValues}
            onSubmit={async (formValues) => {
                const b64Data = await getPDFBase64(formValues.data);
                const file = formValues.data as File;
                setDocumentName(file.name);
                setEncodedPDF(b64Data);
                setDocumentValues(formValues);
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
                        <Grid item md={4} xs={12}>
                            <Field
                                name='type'
                                label='Type'
                                options={documentType}
                                component={SelectFormField}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Field
                                name='data'
                                label='File'
                                type='file'
                                component={SimpleFileUpload}
                            />
                        </Grid>
                        <Grid item md={2} xs={12}>
                            <Field
                                name='isDefault'
                                label='Make Default'
                                component={CheckBoxField}
                                color='primary'
                            />
                        </Grid>
                        <Grid item md={2} xs={12}>
                            <SubmitButton isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default DocumentUploadForm;
