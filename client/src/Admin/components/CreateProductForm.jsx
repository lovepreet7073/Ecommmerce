import React, { useState, Fragment } from 'react';
import { Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../Redux/Product/Action';
import { MdOutlineDelete } from "react-icons/md";
import { toast } from 'react-hot-toast';
import { navigation } from '../../customer/components/Navigation/Navigation';
import { RxUpdate } from "react-icons/rx";
import ImageUploading from 'react-images-uploading';
const initialSizes = [
    {
        name: "S",
        quantity: 0
    },
    {
        name: "M",
        quantity: 0
    },
    {
        name: "L",
        quantity: 0
    }
];

const initialProductData = {
    imageUrl: [],
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPercent: "",
    sizes: initialSizes,
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: ""
};

const CreateProductForm = () => {
    const [productData, setProductData] = useState(initialProductData);
    const [filteredSecondLevel, setFilteredSecondLevel] = useState([]);
    const [filteredThirdLevel, setFilteredThirdLevel] = useState([]);
    const dispatch = useDispatch();
 
    const [images, setImages] = useState([]);
    const maxNumber = 69;

    const onChange = (imageList) => {
        // data for submit
        console.log(imageList, 'imagelist');
        setImages(imageList);
        setProductData((prev) => ({
            ...prev,
            imageUrl: imageList.map((image) => image.file) // Assuming image.file is the file object
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();


        if (productData.imageUrl.length > 0) {
            productData.imageUrl.forEach((file, index) => {
                formData.append(`imageUrl[${index}]`, file); // Appends each image file directly
            });
        }

        // Append other product data to formData
        formData.append('brand', productData.brand);
        formData.append('title', productData.title);
        formData.append('color', productData.color);
        formData.append('discountedPrice', productData.discountedPrice);
        formData.append('price', productData.price);
        formData.append('discountPercent', productData.discountPercent);
        formData.append('quantity', productData.quantity);
        formData.append('topLavelCategory', productData.topLavelCategory);
        formData.append('secondLavelCategory', productData.secondLavelCategory);
        formData.append('thirdLavelCategory', productData.thirdLavelCategory);
        formData.append('description', productData.description);

        // If sizes field is an array, send it as a JSON string
        formData.append('sizes', JSON.stringify(productData.sizes));

        // Dispatch or make an API call here
        dispatch(createProduct(formData))
            .then(() => {
                toast.success("Product added successfully!");
                setProductData(initialProductData);
            })

    };



    console.log(productData, 'product')
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'topLavelCategory') {
            const selectedCategory = navigation.categories.find(cat => cat.id === value);
            setFilteredSecondLevel(selectedCategory ? selectedCategory.sections : []);
            setProductData(prev => ({
                ...prev,
                secondLavelCategory: '',
                thirdLavelCategory: '',
            }));
        }

        if (name === 'secondLavelCategory') {
            const selectedSection = filteredSecondLevel.find(sec => sec.id === value);
            setFilteredThirdLevel(selectedSection ? selectedSection.items : []);
            setProductData(prev => ({
                ...prev,
                thirdLavelCategory: '',
            }));
        }
    };
    const handleSizeChange = (e, index) => {
        const { name, value } = e.target;
        const keyName = name === "size_quantity" ? "quantity" : name;

        const updatedSizes = [...productData.sizes];
        updatedSizes[index][keyName] = value;

        setProductData((prev) => ({
            ...prev,
            sizes: updatedSizes
        }));
    };


    return (
        <Fragment>
            <Box
                sx={{
                    padding: '50px',
                    border: '1px solid #ccc',
                }}
            >
                <Typography variant='h4' sx={{ textAlign: "center" }} className='p-0 mb-2 text-center'>
                    Add New Product
                </Typography>
                <form onSubmit={handleSubmit} className='min-h-screen'>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ImageUploading
                                required
                                multiple
                                value={images}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                name='imageUrl'
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    <div className="upload__image-wrapper">
                                        <div className=''>
                                            <Button
                                                variant='contained'
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                Upload Images
                                            </Button>
                                            &nbsp;
                                            <Button variant='contained' onClick={onImageRemoveAll}>Remove all images</Button>
                                        </div>

                                        {/* Image list container with flexbox */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                                            {imageList.map((image, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <img src={image['data_url']} alt="" width="100" style={{ marginRight: '10px' }} className='border border-slate-300 rounded-full w-[80px] h-[80px] object-cover object-top p-0.3' />
                                                    </div>
                                                    <div className="flex items-center justify-center" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                        <RxUpdate className='text-green-500 cursor-pointer' size={22} onClick={() => onImageUpdate(index)} />

                                                        <MdOutlineDelete className='text-red-500 cursor-pointer' size={27} onClick={() => onImageRemove(index)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ImageUploading>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Brand" name='brand' value={productData.brand} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Title" name='title' value={productData.title} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Color" name='color' value={productData.color} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Quantity" name='quantity' value={productData.quantity} type='number' onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Price" name='price' value={productData.price} type='number' onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Discounted Price" name='discountedPrice' value={productData.discountedPrice} type='number' onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Discount Percentage" name='discountPercent' value={productData.discountPercent} type='number' onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Top Level Category</InputLabel>
                                <Select
                                    name='topLavelCategory'
                                    value={productData.topLavelCategory}
                                    onChange={handleChange}
                                    label="Top Level Category"
                                >
                                    {navigation?.categories?.map(category => (
                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Second Level Category</InputLabel>
                                <Select
                                    name='secondLavelCategory'
                                    value={productData.secondLavelCategory}
                                    onChange={handleChange}
                                    label="Second Level Category"
                                    disabled={!productData.topLavelCategory}
                                >
                                    {filteredSecondLevel.map(section => (
                                        <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Third Level Category</InputLabel>
                                <Select
                                    name='thirdLavelCategory'
                                    value={productData.thirdLavelCategory}
                                    onChange={handleChange}
                                    label="Third Level Category"
                                    disabled={!productData.secondLavelCategory}
                                >
                                    {filteredThirdLevel.map(item => (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Description" name='description' value={productData.description} multiline rows={3} onChange={handleChange} required />
                        </Grid>

                        {productData.sizes.map((size, index) => (
                            <Grid container item spacing={3} key={index}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label='Size Name' value={size.name} name='name' onChange={(e) => handleSizeChange(e, index)} required fullWidth />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField label='Quantity' value={size.quantity} name='size_quantity' onChange={(e) => handleSizeChange(e, index)} required fullWidth type='number' />
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                sx={{ p: 1.8 }}
                                className='py-20'
                                size='large'
                                type='submit'
                            >Add New Product</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Fragment>
    )
}

export default CreateProductForm;
