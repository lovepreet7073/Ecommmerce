import React, { useState } from 'react';
import { api } from '../../../Config/apiConfig';
import { useNavigate } from 'react-router-dom';
const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const handleSearch = async (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        if (query.length > 2) { // Trigger search after typing 3 characters
            try {
                const response = await api.get('/api/products/search', {
                    params: { search: query }
                });
                console.log(response.data, "response=dataa");

                // Assuming the API response contains an array of products with title, category, and image
                setSuggestions(response.data); // Set the suggestions based on the API response
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        } else {
            setSuggestions([]); // Clear suggestions when the search term is too short
        }
    };

    const handleSuggestionClick = (suggestion) => {
        // Log the entire suggestion structure
        console.log("Full suggestion object:", suggestion);

        // Access category, section (parentCategory), and the top-level parentCategory
        const category = suggestion?.category?.name || null;
        const section = suggestion?.category?.parentCategory?.name || null;
        const parentCategory = suggestion?.category?.parentCategory?.parentCategory?.name || null;

        console.log("Category:", category);
        console.log("Section:", section);
        console.log("Parent Category:", parentCategory);

        // Check if all the necessary values exist
        if (parentCategory && section && category) {
            const redirectUrl = `/${parentCategory}/${section}/${category}`;
            console.log("Redirect URL:", redirectUrl);
            setSearchTerm("")
            // Navigate to the constructed URL
            navigate(redirectUrl);
            setSuggestions([])
        } else {
            console.error("One or more properties are missing:", { parentCategory, section, category });
        }
    };


    return (
        <div className=" items-center  relative lg:w-full">
            <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={handleSearch}
                className="p-1 border border-gray-300 rounded-md focus:outline-none focus:border-[#38a3a5] focus:ring-1 focus:ring-[#38a3a5] w-full"
            />

            {/* Display suggestions */}
            {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-19 mt-2 bg-neutral-100 border border-gray-300 rounded-lg shadow-lg w-[29.5rem] z-10">
                    {suggestions.slice(0, 3).map((suggestion, index) => ( // Display only the first 3 suggestions
                        <div
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200 flex items-center"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {/* Product Image */}
                            {suggestion.imageUrl && (
                                <img
                                    src={suggestion.imageUrl}
                                    alt={suggestion.title}
                                    className="w-12 h-12 object-cover rounded-md mr-2"
                                />
                            )}

                            <div className="flex-1">
                                {/* Product Title */}
                                <p className="text-sm font-semibold">{suggestion.title}</p>

                                {/* Product Category */}
                                {suggestion.category && suggestion.category.name && (
                                    <p className="text-xs text-gray-500">in {suggestion.category.name}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default SearchBar;
