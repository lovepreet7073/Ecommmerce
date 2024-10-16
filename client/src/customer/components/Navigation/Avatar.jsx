// Avatar.js
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar'; // If you're using Material UI
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { API_BASE_URL } from '../../../Config/apiConfig';
const AvatarSection = ({ user, handleLogout, handleMyProfile, handleMyOrders, handleopenModal }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
            {user?.firstName ? (
                <div>
                    {user?.profile_pic ? (
                        <img
                            src={`${API_BASE_URL}/images/${user?.profile_pic}`}
                            alt="User Profile"
                            className="w-10 h-10 rounded-full mr-2 cursor-pointer"
                            onClick={handleClick}
                        />
                    ) : (
                        <Avatar
                            className="text-white mr-2"
                            aria-controls={openMenu ? 'basic-menu' : undefined}
                            onClick={handleClick}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? 'true' : undefined}
                            sx={{
                                bgcolor: '#38a3a5',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            {user?.firstName[0].toUpperCase()}
                        </Avatar>
                    )}
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMyProfile();
                                handleClose(); // Close the menu after the action
                            }}
                        >
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMyOrders();
                                handleClose(); // Close the menu after the action
                            }}
                        >
                            My Orders
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleLogout();
                                handleClose(); // Close the menu after the action
                            }}
                        >
                            Logout
                        </MenuItem>

                    </Menu>
                </div>
            ) : (
                <button
                    onClick={handleopenModal}
                    className="px-4 py-2 border border-[#38a3a5] text-[#38a3a5] rounded-md hover:bg-[#e0f7fa] hover:text-[#2b8b8c]"
                >
                    Sign In
                </button>
            )}
        </div>
    );
};

export default AvatarSection;
