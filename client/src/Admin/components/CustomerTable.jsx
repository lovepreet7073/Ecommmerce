import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from '../../Redux/Auth/Actions';

const CustomerTable = () => {
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    useEffect(() => {
        dispatch(getAllUser());
    }, [dispatch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Customer List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200 text-gray-600 text-left">
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">First Name</th>
                            <th className="py-2 px-4 border-b">Last Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auth?.allusers
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user, index) => (
                                <tr
                                    key={user._id}
                                    className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                        } hover:bg-gray-200`}
                                >
                                    <td className="py-2 px-4 border-b">{user._id}</td>
                                    <td className="py-2 px-4 border-b">{user.firstName}</td>
                                    <td className="py-2 px-4 border-b">{user.lastName}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.role}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <label className="mr-2">Rows per page:</label>
                <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="border border-gray-300 rounded-md p-1"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                </select>
                <button
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 0}
                    className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page >= Math.ceil(auth?.allusers?.length / rowsPerPage) - 1}
                    className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CustomerTable;
