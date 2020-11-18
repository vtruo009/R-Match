import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MUISelect, { SelectProps } from '@material-ui/core/Select';

interface props {
    label: string;
    items: itemType[];
}

interface itemType {
    label: string;
    value: string | number;
}

function Select({ label, items, ...passThroughProps }: SelectProps & props) {
    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <MUISelect {...passThroughProps}>
                {items.map((item, key) => (
                    <MenuItem key={key} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </MUISelect>
        </FormControl>
    );
}

export default Select;
