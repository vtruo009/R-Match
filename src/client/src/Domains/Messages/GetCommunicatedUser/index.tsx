import React from 'react';
import Grid from '@material-ui/core/Grid';
import {
    getCommunicatedUsers,
    io
} from 'Domains/Messages/api/api';
import useApi from 'hooks/useApi';
import Button from '@material-ui/core/Button';
import { IUser } from 'Domains/Accounts/api/api';
import Loader from 'Components/Loader';
import NewMessageForm from 'Domains/Messages/NewMessageForm';
import UserPreview from 'Domains/Messages/UserPreview';
import Dialog from '@material-ui/core/Dialog';

interface props {
    setUser: (user: IUser) => void;
    children: JSX.Element;
}

function GetCommunicateUser({ setUser, children }: props) {
    var selectedUser: IUser;
    const [open, setOpen] = React.useState(false);

    var [users, setUsers] = React.useState<IUser[]>([]);
    const request = React.useCallback(() => getCommunicatedUsers(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (response) => {
            if (response.data.users.length > 0) {
                selectedUser = response.data.users[0];
                setUsers(response.data.users);
            }
        }
    });

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    const SetUser = (
        user: IUser
    ) => {
        setUser(user);
        selectedUser = user;
    };

    return (
        <div style={{ margin: 30 }}>
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                        <div>
                            <Grid container spacing={3}>

                            <Button onClick={handleClickOpen} color='primary' variant='outlined'>
                                New Message
                            </Button>
                            {/* Render all users */}
                                <Grid item md={6} xs={12} spacing={3} direction='column'>
                                {users.map((user, key) => (
                                    <Grid item key={key}>
                                        <UserPreview
                                            user={user}
                                            onClick={SetUser}
                                            isSelected={selectedUser !== undefined &&  user.id === selectedUser.id}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                                <Grid item md={6} xs={12}>
                            {children}
                            </Grid>
                            </Grid>
                        </div>
                    )
                }
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
                <NewMessageForm
                    setUser={SetUser}
                    closeForm={handleClose}
                />
            </Dialog>
        </div>
    );
}

export default GetCommunicateUser;
