import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderCard from './OrderCard';
import { getOrdersByUserId } from '../../../Redux/Order/Actions'; // Import the action creator

const Order = () => {
    const dispatch = useDispatch();
    const { auth, order } = useSelector(store => store); // Access both auth and order from the store
    const userId = auth?.user?._id;
    const orders = order?.orders || []; // Fallback to empty array if no orders
    console.log(order, "order")

    useEffect(() => {
        if (userId) {
            dispatch(getOrdersByUserId(userId)); // Fetch orders on component mount if userId is available
        }
    }, [dispatch, userId]);

    const orderStatusOptions = [
        { label: "On the way", value: "on_the_way" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Return", value: "return" },
        { label: "Pending", value: "pending" }
    ];

    return (
        <div className='mx-3 my-3 p-4'>
            <Grid container sx={{ justifyContent: "space-between" }} spacing={2}>
                <Grid item xs={12} sm={2.5}>
                    <div className='h-auto bg-white shadow-lg p-5 sticky top-5'>
                        <h1 className='font-bold text-lg'>Filter</h1>
                        <div className='space-y-4 mt-10'>
                            <h1 className='font-semibold'>ORDER STATUS</h1>
                            {orderStatusOptions.map((option) => (
                                <div className='flex items-center' key={option.value}>
                                    <input
                                        type="checkbox"
                                        defaultValue={option.value}
                                        className='h-4 w-4 border-gray-300 text-[#38a3a5] focus:ring-[#38a3a5]'
                                    />
                                    <label htmlFor={option.value} className='ml-3 text-sm text-gray-600'>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <div className='space-y-6'>
                        {orders.length === 0 ? (
                            <div className="text-center text-gray-500">
                                <p>No orders found.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <OrderCard
                                    key={order._id}
                                    orderStatus={order.orderStatus}
                                    orderNumber={order._id}
                                    subtotal={order.totalDiscountedPrice}
                                    totalItems={order.orderItems.length}
                                    shippingAddress={order.shippingAddress}
                                    orderItems={order.orderItems}
                                    paymentDetails={order.paymentDetails}
                                />
                            ))
                        )}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default Order;
