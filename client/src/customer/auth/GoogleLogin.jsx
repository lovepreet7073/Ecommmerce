import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { googlelogin } from '../../Redux/Auth/Actions';

const GoogleLoginComponent = ({ handleClose }) => {

    const dispatch = useDispatch();

    const handleSuccess = async (credentialResponse) => {
        try {
            console.log(credentialResponse);
            const jwtDetail = jwtDecode(credentialResponse.credential);
            console.log("Decoded JWT:", jwtDetail);
            dispatch(googlelogin({ googleToken: credentialResponse.credential }));
            handleClose();
            toast.success('Login Successfully');

        } catch (error) {
            console.error('Error decoding token or making API request', error);
            toast.error("Login failed. Please try again.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <div className=''>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                size='large'

            />
        </div>
    );
};

export default GoogleLoginComponent;
