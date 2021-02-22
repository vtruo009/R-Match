import React from 'react';
import { useParams } from 'react-router-dom';

import Verification from 'Domains/Accounts/Verification';

interface VerifyParams {
    verificationKey: string;
}

function Verify() {
    const { verificationKey } = useParams<VerifyParams>();
    return <Verification verificationKey={verificationKey} />;
}

export default Verify;
