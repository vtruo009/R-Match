import React from 'react';
import { getSamples, ISample } from './api';
import Button from '@material-ui/core/Button';

function Sample() {
    const [samples, setSamples] = React.useState<ISample[]>([]);
    const fetchSamples = async () => {
        try {
            const response = await getSamples();
            setSamples(response.data.samples);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ margin: 30 }}>
            <Button onClick={fetchSamples} color='primary' variant='outlined'>
                Get Samples
            </Button>
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
        </div>
    );
}

export default Sample;
