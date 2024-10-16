import React, { useEffect, useState } from 'react';

import { Box, Grid, TextField, Button, Modal, FormHelperText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddress } from '../../../Redux/Auth/Actions';
import toast from "react-hot-toast";
import { getUser } from '../../../Redux/Auth/Actions';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 'none',
    p: 2,
};

const EditAddressModal = ({ open, handleClose, selectedAddress }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const [phoneError, setPhoneError] = useState(false);
    const [Addressdata, setAddressdata] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        mobile: '',
    });

    // Use useEffect to initialize Addressdata when selectedAddress changes
    useEffect(() => {
        if (selectedAddress) {
            setAddressdata({
                firstName: selectedAddress.firstName || '',
                lastName: selectedAddress.lastName || '',
                streetAddress: selectedAddress.streetAddress || '',
                city: selectedAddress.city || '',
                state: selectedAddress.state || '',
                country: selectedAddress.country || '',
                zipCode: selectedAddress.zipCode || '',
                mobile: selectedAddress.mobile || '',
            });
        }
    }, [selectedAddress]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressdata((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCountryChange = (val) => {
        setAddressdata((prevData) => ({
            ...prevData,
            country: val,
            state: '',
            city: '',
        }));
    };

    const handleStateChange = (val) => {
        setAddressdata((prevData) => ({
            ...prevData,
            state: val,
            city: '',  // Reset city when state changes
        }));
    };



    const handleMobileChange = (value) => {
        setAddressdata(prev => ({ ...prev, mobile: value }));

        // Validate phone number using isValidPhoneNumber function
        if (value && !isValidPhoneNumber(value)) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
        }
    };
    // Phone number validation check
    const validatePhoneNumber = (mobile) => {
        return isValidPhoneNumber(mobile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the form before submitting
        if (phoneError) {
            return; // Stop form submission if phone number is invalid
        }


        try {
            const addressId = selectedAddress._id;
            await dispatch(updateAddress(addressId, Addressdata));
            toast.success("Address updated successfully");
            handleClose();
        } catch (error) {
            toast.error("Error updating address");
        }
    };

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        dispatch(getUser(jwt));
    }, [auth.updatedAddress, auth.deleteaddress]);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container>
                        <div className='p-3'>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id='firstName'
                                            name='firstName'
                                            label='First Name'
                                            fullWidth
                                            autoComplete='given-name'
                                            onChange={handleChange}
                                            value={Addressdata.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id='lastName'
                                            name='lastName'
                                            label='Last Name'
                                            onChange={handleChange}
                                            fullWidth
                                            autoComplete='family-name'
                                            value={Addressdata.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id='streetAddress'
                                            name='streetAddress'
                                            label='Street Address'
                                            fullWidth
                                            autoComplete='address-line1'
                                            onChange={handleChange}
                                            multiline
                                            rows={2}
                                            value={Addressdata.streetAddress}
                                        />
                                    </Grid>

                                    {/* Country Dropdown */}
                                    <Grid item xs={12} sm={6}>
                                        <CountryDropdown
                                            value={Addressdata.country || ''}
                                            onChange={handleCountryChange}
                                            classes="border outline-none w-[16rem] p-3 rounded border-slate-300"
                                        />
                                    </Grid>

                                    {/* State Dropdown */}
                                    <Grid item xs={12} sm={6}>
                                        <RegionDropdown
                                            country={Addressdata.country}
                                            value={Addressdata.state || ''}
                                            onChange={handleStateChange}
                                            classes="border outline-none w-[16rem] p-3 rounded border-slate-300"
                                        />
                                    </Grid>

                                    {/* City Input */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id='city'
                                            name='city'
                                            label='City'
                                            fullWidth
                                            autoComplete='given-name'
                                            value={Addressdata.city || ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="zipCode"
                                            name="zipCode"
                                            label="Zip / Postal Code"
                                            fullWidth
                                            autoComplete="postal-code"
                                            value={Addressdata.zipCode || ''}
                                            onChange={handleChange}
                                            inputProps={{
                                                maxLength: 6, // Limit to 6 characters
                                                pattern: "[0-9]*", // Only allow numeric input
                                            }}
                                            error={Addressdata.zipCode?.length === 6 && Addressdata.zipCode.length !== 6} // Show error if length is not 6 when full input is entered
                                            helperText={
                                                Addressdata.zipCode?.length === 6 && Addressdata.zipCode.length !== 6
                                                    ? 'Invalid Zip code'
                                                    : ''
                                            }
                                        />
                                    </Grid>


                                    {/* Mobile Input */}
                                    <Grid item xs={12} sm={6}>
                                        <PhoneInput
                                            required
                                            international
                                            defaultCountry="US"
                                            value={Addressdata.mobile || ''}
                                            onChange={handleMobileChange}
                                            className="border outline-none w-[19rem] p-3 rounded border-slate-300 focus:outline-none"
                                        />
                                        {phoneError && !validatePhoneNumber(Addressdata.mobile) && (
                                            <FormHelperText error={true}>
                                                Invalid phone number
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                                    <Button type="submit" variant="contained" sx={{
                                        backgroundColor: "#38a3a5",
                                        "&:hover": { backgroundColor: "#2b8b8c" },
                                        marginRight: 2
                                    }}>Save</Button>
                                    <Button variant="outlined" onClick={handleClose} sx={{
                                        borderColor: "#38a3a5",
                                        color: "#38a3a5",
                                        "&:hover": {
                                            borderColor: "#2b8b8c",
                                            backgroundColor: "#e0f7fa",
                                            color: "#2b8b8c",
                                        },
                                    }}>Cancel</Button>
                                </Box>
                            </form>
                        </div>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}

export default EditAddressModal;
