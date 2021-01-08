import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props {
    label: string;
    values?: string[];
}

function LabelValues({ label, values }: Props) {
    const labelCounter = () => (values ? `(${values.length})` : '(0)');
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{}>) => {
        setExpanded(!expanded);
    };

    return (
        <Card style={{ padding: 25 }} variant='outlined'>
            <Accordion
                expanded={expanded}
                onChange={handleChange}
                style={{ borderStyle: 'none' }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon color='primary' />}
                >
                    <Typography variant='h6' color='primary'>
                        {label} {labelCounter()}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {values ? (
                        <List>
                            {values.map((value, index) => (
                                <div key={index}>
                                    {index ? (
                                        <Divider />
                                    ) : (
                                        <ListItem> </ListItem>
                                    )}
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
