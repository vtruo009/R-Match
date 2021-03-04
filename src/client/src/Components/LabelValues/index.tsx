import React from 'react';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge';

import Card from 'Components/Card';

interface LabelValuesProps {
    label: string;
    values?: string[];
    icon: JSX.Element;
}

function LabelValues({ label, values, icon }: LabelValuesProps) {
    const labelCounter = values ? values.length : 0;
    const [expanded, setExpanded] = React.useState(false);
    return (
        <Card>
            <Accordion
                style={{ boxShadow: 'none' }}
                expanded={expanded}
                onChange={() => setExpanded(!expanded)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon color='primary' />}
                >
                    <Typography variant='h5' color='primary'>
                        {label}{' '}
                        <Badge
                            badgeContent={labelCounter}
                            color='secondary'
                            showZero
                        >
                            {icon}
                        </Badge>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {values && values.length > 0 ? (
                        <List>
                            {values.map((value, index) => (
                                <div key={index}>
                                    {index ? <Divider /> : <> </>}
                                    <ListItem>
                                        <ListItemText>{value}</ListItemText>
                                    </ListItem>
                                </div>
                            ))}
                        </List>
                    ) : (
                        <Typography variant='h6'>
                            <i>Not provided</i>
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>
        </Card>
    );
}
export default LabelValues;
