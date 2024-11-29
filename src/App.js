// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navigation/Nav';
import Home from './Components/Pages/Home';
import Register from './Components/Pages/Register';
import Login from './Components/Pages/Login';
import Profile from './Components/Pages/Profile';
import {useSelector} from "react-redux";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Footer from "./Components/Navigation/Footer";
import ProductPage from './Components/Pages/ProductPage';
import OtherProfile from './Components/Pages/otherProfile';
import ExtendedSearch from './Components/Pages/ExtendedSearch';
import ErrorPage from './Components/Pages/ErrorPage';
import CartPage from './Components/Pages/CartPage';
import AdminPanel from './Components/Pages/admin/AdminPanel';


const App = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get isLoggedIn from Redux store
    return (
                <div className="App">
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/products/:user_id/:product_id" element={<ProductPage/>} />
                            <Route path="/users/:user_id" element={<OtherProfile/>} />
                            <Route path="/extended-search" element={<ExtendedSearch/>}/>
                            <Route path='/error-page' element={<ErrorPage/>}/>
                            <Route path='/cart' element={<CartPage/>}/>
                            <Route path='/admin-panel' element={<AdminPanel/>}/>
                        </Routes>
                        {/* <Footer/> */}
                    </Router>
                </div>
    );
};

export default App;
