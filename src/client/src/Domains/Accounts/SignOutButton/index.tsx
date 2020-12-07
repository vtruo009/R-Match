import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import useApi from 'hooks/useApi';
import { signOut } from 'Domains/Accounts/api/api';
import { AuthContext } from 'Contexts/AuthContext';

function SignInForm() {
    const history = useHistory();
    const { setUser, setIsAuthenticated } = React.useContext(AuthContext);

    const request = React.useCallback(() => signOut(), []);
    const [sendRequest, isLoading] = useApi(request, {
        onSuccess: (results) => {
            // set global user to empty object
            setUser(results.data.user);
            setIsAuthenticated(false);
            // redirect user to home page
            history.push('/');
        },
    });
    return (
        <Button
            style={{ color: '#ffff' }}
            onClick={sendRequest}
            startIcon={<SignOutIcon />}
            disabled={isLoading}
        >
            Sign Out
        </Button>
    );
}

export default SignInForm;
