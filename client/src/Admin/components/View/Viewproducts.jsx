import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, findProducts } from '../../../Redux/Product/Action';
import { Avatar, Button, Card, CardHeader } from '@mui/material';
import { toast } from 'react-hot-toast';
const ViewProducts = () => {

    const dispatch = useDispatch()
    const { product } = useSelector(store => store)
    console.log(product, "PRODUCT_DASHBOAD")
    useEffect(() => {
        const data = {
            category: "",
            colors: [],
            sizes: [],
            maxPrice: 1000000,
            minPrice: 0,
            minDiscount: 0,
            sort: "price_low",
            pageNumber: 1,
            pageSize: 10,
            stock: ""
        }
        dispatch(findProducts(data))
    }, [product.deletedProduct])

   

    return (
        <div className=''>
            <Card className='mt-2'>
                <CardHeader title="Recent Products" />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell align="left">Title</TableCell>
                                <TableCell align="left">Category</TableCell>
                                <TableCell align="left">Price</TableCell>
                                <TableCell align="left">Quantity</TableCell>
                               
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {product?.products?.products?.map((item) => (
                                <TableRow
                                    key={item._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align='left'>
                                        <Avatar src={item.imageUrl}></Avatar>
                                    </TableCell>
                                    <TableCell align="left" scope='row'>{item.title}</TableCell>
                                    <TableCell align="left">{item.category.name}</TableCell>
                                    <TableCell align="left">{item.price}</TableCell>
                                    <TableCell align="left">{item.quantity}</TableCell>
                              
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Card>

        </div>
    )
}

export default ViewProducts