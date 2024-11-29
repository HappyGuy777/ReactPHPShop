import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/main.css';
import { resetProductState } from '../Redux/feauter/slices/product/productSlice';

import { resetOtherProfileState } from '../Redux/feauter/slices/otherProfile/otherProfileSlice';
const ErrorPage = () => {
    const dispatch=useDispatch();
    useEffect(() => {
        
            dispatch(resetProductState());
            dispatch(resetOtherProfileState());
        
    }, [dispatch]);
    return (
        <div className='error-page'>
            <h1>Ooups! Something gone wrong.</h1>
        </div>
    );
};

export default ErrorPage;
