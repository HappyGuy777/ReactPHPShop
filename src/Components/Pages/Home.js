import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../Redux/feauter/slices/product/productSlice';
import ProductCard from '../ProductComponents/ProductCard';
import '../../css/main.css';
const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); 
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user=useSelector((state=>state.auth.userInfo));
    console.log(user);
    
    const products = useSelector((state) => state.products.products);
    const dispatch = useDispatch();
   
    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    // Logic to paginate products array
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <div>
                 <h1>All products</h1>
            </div>
           
            <div className="product-container">
                {currentItems.map((product, index) => (
                    <ProductCard key={index} product={product} />
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

export default Home;
