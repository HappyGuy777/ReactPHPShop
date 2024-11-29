import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../Redux/feauter/slices/product/productSlice';
import ProductCard from '../ProductComponents/ProductCard';
import '../../css/searchpage.css'; // Import the search page CSS file

const ExtendedSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('name');
    const [sort, setSort] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); // Number of items per page

    const products = useSelector((state) => state.products.products)||[];
    console.log(products);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filter products based on search query and selected filter
    let filteredProducts = products?.filter(product => {
        if (filter === 'name') {
            return product.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        //  else if (filter === 'categories') {
        //     return product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase());
        // } else if (filter === 'subcategories') {
        //     return product.subcategories && product.subcategories.toLowerCase().includes(searchQuery.toLowerCase());
        // }
        return false;
    });

    // Sorting logic
    filteredProducts.sort((a, b) => {
        if (sort === 'name') {
            return a.name.localeCompare(b.name);
        } 
        // else if (sort === 'price') {
        //     return a.price - b.price;
        // } else if (sort === 'count') {
        //     return a.count - b.count;
        // }
        return 0;
    });

    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h1 className="section-title">Extended search:</h1>
            <div className="search-filter-container">
                <div className='flex'>
                    
                    <input type="text" className="search-bar" id="ext-search" placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <label htmlFor="ext-search" className='search-label'>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30" className="svg-search">
                            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                        </svg>
                    </label>
                </div>
                <div className='flex'>
                    <div>
                        <h3>Filter by:</h3>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                            <option value="name">Name</option>
                            <option value="categories">Categories</option>
                            <option value="subcategories">Subcategories</option>
                        </select>
                    </div>
                    <div>
                        <h3>Sort by:</h3>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select">
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="count">Count</option>
                        </select>
                    </div>
                </div>
            </div>
            <h1 className="section-title">Searched Products</h1>
            <div className="product-container">
                {currentItems.map((product, index) => (
                    <ProductCard key={index} product={product} className="product-card" />
                ))}
            </div>
            <ul className="pagination">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExtendedSearch;
