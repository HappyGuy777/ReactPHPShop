import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import Axios
import '../../css/nav.css';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false); // State to control visibility of search results
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart.userChanges);
    const cartLength = cart?.length;
    const toProductPage = (product_id, user_id) => {
        navigate(`/products/${user_id}/${product_id}`);
        setShowResults(false);
        setSearchQuery("");
    };
    const toExtendedSearch = () => {
        navigate('/extended-search');
        setShowResults(false);
        setSearchQuery("");
    }
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim() !== '') {
            // Perform search request to backend
            axios.get(`http://endpointshop/api.php?action=getSearchedProdcuts&query=${query}`)
                .then(response => {
                    setSearchResults(response.data);
                    setShowResults(true); // Show search results when there are results
                })
                .catch(error => {
                    console.error('Error:', error);
                    setSearchResults([]);
                    setShowResults(false); // Hide search results on error
                });
        } else {
            // Hide search results if the query is empty
            setShowResults(false);
        }
    };
    // Function to close search results when clicked outside
    const handleCloseResults = (event) => {
        // Check if the click target is not a child of the search results container
        if (!event.target.closest('.search-results-container')) {
            setShowResults(false); // Close search results
            setSearchQuery("");
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleCloseResults);
        return () => {
            document.removeEventListener('click', handleCloseResults);
        };
    }, [cartLength, cart]); // Empty dependency array ensures the effect runs only once, when component mounts

    return (
        <nav>
            <ul className="nav-list">
                <li>
                    <h2 className="site-name"><Link to="/" className="link">GoldenShop</Link></h2>
                </li>
                <li className="search-box">
                    
                    <input type="text" className="search-bar" placeholder='Search' id="search" value={searchQuery} onChange={handleSearchChange} onClick={handleSearchChange} />
                    <label htmlFor="search" className='search-label'>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30" className="svg-search">
                            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                        </svg>
                    </label>
                </li>
                {showResults && (
                    <div className="search-results-container">
                        {/* Display search results */}
                        <ul className="search-results-list">
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <li key={product.id} onClick={() => { toProductPage(product.id, product.user_id) }}>{product.name}</li>
                                ))
                            ) : (
                                <li>No such product</li>
                            )}
                        </ul>
                        <p onClick={() => { toExtendedSearch() }}>Extended Search</p>
                    </div>
                )}

                {isLoggedIn ? (
                    <Fragment>
                        {/* Render profile link if user is logged in */}
                        <li>
                            <Link to="/cart" className="link sub-link icon-link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                    <circle cx="460" cy="80" r="100" fill="red" />
                                    <text x="460" y="130" fontSize="170" fill="white" textAnchor="middle">{cartLength}</text>
                                </svg>
                            </Link>
                            <Link to="/profile" className="link sub-link icon-link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                </svg>
                            </Link>
                        </li>
                    </Fragment>
                ) : (
                    <Fragment>
                        {/* Render login link if user is not logged in */}
                        <li>
                            <Link to="/cart" className="link sub-link icon-link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                    <circle cx="460" cy="80" r="100" fill="red" />
                                    <text x="460" y="130" fontSize="170" fill="white" textAnchor="middle">{cartLength}</text>
                                 </svg>
                            </Link>
                            <Link to="/login" className="link sub-link icon-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg></Link>
                        </li>
                    </Fragment>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
