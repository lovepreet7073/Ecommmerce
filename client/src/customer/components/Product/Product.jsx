import React, { useEffect } from "react"
import { useState } from "react"
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import FilterListIcon from '@mui/icons-material/FilterList';
import Pagination from "@mui/material/Pagination";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { mens_kurta } from "../../../Data/Men/men_kurta"
import ProductCard from "./ProductCard"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { filters, singleFilter } from "./Filterdata"
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from "../../../Redux/Product/Action";
const sortOptions = [

    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export default function Product() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const location = useLocation();
    const navigate = useNavigate()
    const param = useParams();
    const dispatch = useDispatch()

    // decoding url
    const decodedQueryString = decodeURIComponent(location.search);
    const searchParams = new URLSearchParams(decodedQueryString);
    const colorValue = searchParams.get("color");
    const sizeValue = searchParams.get("size");
    const priceValue = searchParams.get("price");
    const discount = searchParams.get("discount");
    const sortvalue = searchParams.get("sort");
    const pageNumber = searchParams.get("page") || 1;
    const stock = searchParams.get("stock");
    const { product } = useSelector(store => store)

    console.log(product.products, "TEST")
    const handleFilter = (value, sectionId) => {
        const searchParams = new URLSearchParams(location.search);
        let filterValue = searchParams.getAll(sectionId);

        // Toggle filter
        if (filterValue.includes(value)) {
            filterValue = filterValue.filter((item) => item !== value);
        } else {
            filterValue.push(value);
        }

        // Update filter in search params
        if (filterValue.length === 0) {
            searchParams.delete(sectionId);
        } else {
            searchParams.set(sectionId, filterValue.join(','));
        }

        // Reset page number to 1 when applying a new filter
        searchParams.set('page', 1);

        const query = searchParams.toString();
        navigate({ search: `?${query}` });
    };


    const handlePaginationChange = (event, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", value);// Use the actual page number
        const query = searchParams.toString();
        navigate({ search: `?${query}` }); // Add '?' before the query
    };
    const handleRadioFilter = (e, sectionId) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(sectionId, e.target.value)
        const query = searchParams.toString();
        navigate({ search: `?${query}` });
    }

    useEffect(() => {
        const [minPrice, maxPrice] = priceValue === null ? [0, 10000] : priceValue.split("-").map(Number);
        const data = {
            category: param.item,
            colors: colorValue || [],
            sizes: sizeValue || [],
            maxPrice,
            minPrice,
            minDiscount: discount || 0,
            sort: sortvalue || "price_low",
            pageNumber: pageNumber,
            pageSize: 4,
            stock: stock
        }
        dispatch(findProducts(data))
    }, [param.item,
        colorValue,
        sizeValue,
        priceValue,
        discount,
        sortvalue,
        pageNumber,
        stock])

    return (
        <div className="bg-white">
            <div>
                
                <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel
                            transition
                            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </div>
                            {/* Filters */}
                            <form className="mt-4 border-t border-gray-200">


                                {filters.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                                        <h3 className="-my-3 flow-root">
                                            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                <span className="font-medium text-gray-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                    <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-4">
                                                {section.options.map((option, optionIdx) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            onChange={() => handleFilter(option.value, section.id)}
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-[#38a3a5] focus:ring-[#38a3a5]"
                                                        />
                                                        <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                                {singleFilter.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">

                                        <h3 className="-my-3 flow-root">
                                            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                <FormLabel id="demo-radio-buttons-group-label" className="font-medium text-gray-900" sx={{ color: "black" }}>{section.name}</FormLabel>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                    <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pt-6">
                                            <div className="space-y-4">
                                                <FormControl>

                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="female"
                                                        name="radio-buttons-group"
                                                    >
                                                        {section.options.map((option, optionIdx) => (

                                                            <>
                                                                <FormControlLabel onChange={(e) => handleRadioFilter(e, section.id)} value={option.value} control={<Radio />} label={option.label} />

                                                            </>

                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>

                                            </div>
                                        </DisclosurePanel>

                                    </Disclosure>
                                ))}
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>

                <main className="mx-auto  px-4 sm:px-6 lg:px-20">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-20">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                <a
                                                    href={option.href}
                                                    className={classNames(
                                                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                        'block px-4 py-2 text-sm data-[focus]:bg-gray-100',
                                                    )}
                                                >
                                                    {option.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>

                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                            {/* Filters */}
                            <div>
                                <div className="py-10 flex justify-between items-center"><h1 className="text-lg opacity-50 font-bold">Filters</h1>
                                    <FilterListIcon /></div>

                                <form className="hidden lg:block">


                                    {filters.map((section) => (
                                        <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                                            <h3 className="-my-3 flow-root">
                                                <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                    <span className="font-medium text-gray-900">{section.name}</span>
                                                    <span className="ml-6 flex items-center">
                                                        <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                        <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                    </span>
                                                </DisclosureButton>
                                            </h3>
                                            <DisclosurePanel className="pt-6">
                                                <div className="space-y-4">
                                                    {section.options.map((option, optionIdx) => (
                                                        <div key={option.value} className="flex items-center">
                                                            <input
                                                                onChange={() => handleFilter(option.value, section.id)}
                                                                defaultValue={option.value}
                                                                defaultChecked={option.checked}
                                                                id={`filter-${section.id}-${optionIdx}`}
                                                                name={`${section.id}[]`}
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-[#38a3a5] focus:ring-[#38a3a5]"
                                                            />
                                                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                                                                {option.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </DisclosurePanel>
                                        </Disclosure>
                                    ))}
                                    {singleFilter.map((section) => (
                                        <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">

                                            <h3 className="-my-3 flow-root">
                                                <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                    <FormLabel id="demo-radio-buttons-group-label" className="font-medium text-gray-900" sx={{ color: "black" }}>{section.name}</FormLabel>
                                                    <span className="ml-6 flex items-center">
                                                        <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                        <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                    </span>
                                                </DisclosureButton>
                                            </h3>
                                            <DisclosurePanel className="pt-6">
                                                <div className="space-y-4">
                                                    <FormControl>

                                                        <RadioGroup
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            defaultValue="female"
                                                            name="radio-buttons-group"
                                                        >
                                                            {section.options.map((option, optionIdx) => (

                                                                <>
                                                                    <FormControlLabel onChange={(e) => handleRadioFilter(e, section.id)} value={option.value} control={<Radio />} label={option.label} />

                                                                </>

                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>

                                                </div>
                                            </DisclosurePanel>

                                        </Disclosure>
                                    ))}
                                </form>

                            </div>

                            {/* Product grid */}
                            {/* Product grid */}
                            <div className="lg:col-span-4 w-full ">
                                <div className="grid grid-cols-1 gap-x-12 gap-y-10  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                                    {product?.products?.products?.length > 0 ? (
                                        product.products.products.map((item, index) => (
                                            <ProductCard key={index} product={item} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-10">
                                            <h2 className="text-lg font-bold text-gray-500">No Products Found</h2>
                                            <p className="text-gray-400">Please adjust your filters or try again later.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="w-full px-[3.6rem]">
                        <div className="px-4 py-5 justify-center flex">
                            <Pagination
                                count={product.products?.totalPages}
                                onChange={handlePaginationChange}
                                color="secondary"
                                sx={{
                                    "& .Mui-selected": {
                                        backgroundColor: "#38a3a5", // Active page background color
                                        color: "#fff", // Active page text color
                                        "&:hover": {
                                            backgroundColor: "#2e8d91", // Hover effect for active page
                                        },
                                    },
                                }}
                            />
                        </div>
                    </section>



                </main>
            </div>
        </div>
    )
}