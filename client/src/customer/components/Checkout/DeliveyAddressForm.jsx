import { Box, Button, Grid, TextField, FormHelperText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../../Redux/Order/Actions';
import { useNavigate } from 'react-router-dom';
import AddressCard from '../AddressCard/AddressCard';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
const DeliveryAddressForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth } = useSelector(store => store);
    const { order } = useSelector(store => store.order);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [formData, setFormData] = useState({});
    const [phoneError, setPhoneError] = useState(false);

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
        const selectedAddress = auth.user.address.find(address => address._id === id);
        if (selectedAddress) {
            setFormData({
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
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (val) => {
        setFormData(prev => ({ ...prev, country: val }));
    };

    const handleStateChange = async (val) => {
        setFormData(prev => ({ ...prev, state: val, city: '' })); // Reset city when state changes

    };


    const handleMobileChange = (value) => {
        setFormData(prev => ({ ...prev, mobile: value }));

        // Validate phone number using isValidPhoneNumber function
        if (value && !isValidPhoneNumber(value)) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        if (phoneError) {
            return;
        }

        if (formData.zipCode && formData.zipCode.length !== 6) {
            return; // Prevent form submission if ZIP code is not valid
        }

        const shipAddress = selectedAddressId ? { _id: selectedAddressId } : formData;
        dispatch(createOrder({ ...shipAddress, navigate }));
    };

    useEffect(() => {
        if (order && order._id) {
            navigate(`/checkout?step=2&order_id=${order._id}`);
        }
    }, [order, navigate]);

    return (
        <div>
            <Grid container spacing={4} justifyContent={auth?.user?.address?.length > 0 ? 'flex-start' : 'center'}>
                {auth?.user?.address?.length > 0 && (
                    <Grid xs={12} lg={5} className='h-[30.5rem] mt-7'>
                        <div className='p-5 py-7 cursor-pointer'>
                            {auth?.user?.address?.map((item) => (
                                <AddressCard
                                    key={item._id}
                                    address={item}
                                    onSelect={handleAddressSelect}
                                    isSelected={selectedAddressId === item._id}
                                    showRadio={true}
                                />
                            ))}
                        </div>
                    </Grid>
                )}

                {/* Form Section */}
                <Grid item xs={12} lg={auth?.user?.address?.length > 0 ? 7 : 12}>
                    <Box className={`border rounded-s-md shadow-md p-5 ${auth?.user?.address?.length === 0 && 'mx-auto max-w-2xl'}`}>
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
                                        value={formData.firstName || ''}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id='lastName'
                                        name='lastName'
                                        label='Last Name'
                                        fullWidth
                                        autoComplete='family-name'
                                        value={formData.lastName || ''}
                                        onChange={handleInputChange}
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
                                        multiline
                                        rows={4}
                                        value={formData.streetAddress || ''}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                {/* Country Dropdown */}
                                <Grid item xs={12} sm={6}>
                                    <CountryDropdown
                                        value={formData.country || ''}
                                        onChange={handleCountryChange}
                                        classes="border outline-none w-[19rem] p-3 rounded border-slate-300"
                                    />
                                </Grid>

                                {/* State Dropdown */}
                                <Grid item xs={12} sm={6}>
                                    <RegionDropdown
                                        country={formData.country}
                                        value={formData.state || ''}
                                        onChange={handleStateChange}
                                        classes="border outline-none w-[19rem] p-3 rounded border-slate-300"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id='city'
                                        name='city'
                                        label='City'
                                        fullWidth
                                        autoComplete='given-name'
                                        value={formData.city || ''}
                                        onChange={handleInputChange}
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
                                        value={formData.zipCode || ''}
                                        onChange={handleInputChange}
                                        inputProps={{
                                            maxLength: 6, // Limit to 6 characters
                                            pattern: "[0-9]*", // Only allow numeric input
                                        }}
                                        error={formData.zipCode?.length === 6 && formData.zipCode.length !== 6} // Show error if length is not 6 when full input is entered
                                        helperText={
                                            formData.zipCode?.length === 6 && formData.zipCode.length !== 6
                                                ? 'Invalid Zip code'
                                                : ''
                                        }
                                    />
                                </Grid>


                                <Grid item xs={12} sm={6}>
                                    <PhoneInput
                                        required
                                        international
                                        defaultCountry="US"
                                        value={formData.mobile || ''}
                                        onChange={handleMobileChange}
                                        className="border outline-none w-[19rem] p-3 rounded border-slate-300 outline-none focus:none"
                                    />
                                    {phoneError && (
                                        <FormHelperText error>
                                            Invalid phone number
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        sx={{ mt: 1, bgcolor: "#38a3a5", py: 1.5 }}
                                        size='large'
                                        variant='contained'
                                        type='submit'
                                    >
                                        Deliver Here
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default DeliveryAddressForm;
