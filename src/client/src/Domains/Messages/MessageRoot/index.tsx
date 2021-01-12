import React from 'react';
import Grid from '@material-ui/core/Grid';
import { IMessage } from 'Domains/Messages/api/api';

import Messaging from 'Domains/Messages/SendMessage';
import MessageResults from 'Domains/Messages/GetMessages';

interface Props {
    messages: IMessage[];
}

function MessageRoot() {
    // const [jobSelected, setJobSelected] = React.useState<IJob>(jobs[0]);
    // Resets job selected to first job after new jobs are fetched
    return (
        <Grid container spacing={3} style={{ marginTop: 20 }}>
            <Grid item>
                {/* Render all messages */}
                <MessageResults />
                <Messaging />
            </Grid>
        </Grid>
    );
}

export default MessageRoot;
