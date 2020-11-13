import React from 'react';
import { getSamples, ISample } from './api';
import Button from '@material-ui/core/Button';
import useApi from '../../hooks/useApi';
import useSnack from '../../hooks/useSnack';

function Sample() {
    const [samples, setSamples] = React.useState<ISample[]>([]);
    const [snack] = useSnack();
    const request = React.useCallback(() => getSamples(), []);
    const [sendRequest, isLoading] = useApi(request, (response) => {
        const samplesLength = response.data.samples.length;
        if (samplesLength === 0) {
            snack('No samples were found', 'warning');
        } else {
            setSamples(response.data.samples);
            snack(`${samplesLength} samples found`, 'success');
        }
    });

    return (
        <div style={{ margin: 30 }}>
            <Button onClick={sendRequest} color='primary' variant='outlined'>
                Get Samples
            </Button>
            <div>
                {isLoading ? (
                    <h3>...Loading</h3>
                ) : (
                    <div>
                        {samples.map((sample, key) => (
                            <div style={{ margin: 10 }} key={key}>
                                Sample ({sample.id})
                                <ul>
                                    <li> num: {sample.num}</li>
                                    <li> message: {sample.message} </li>
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sample;
