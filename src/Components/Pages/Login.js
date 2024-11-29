// Login.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Redux/feauter/slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Footer from '../Navigation/Footer';
import '../../css/main.css';
import '../../css/register.css';

const Login = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const error = useSelector((state) => state.auth.error); // Get error from Redux state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [cookies, setCookie] = useCookies(['errors']);
    const errors = cookies.errors || {};

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile');
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div>
            <div className="body">
                <div className="registration-form">
                    <h2>Login</h2>
                    {error && error.login_errors && ( // Check if error exists and has login_errors
                        <div>
                            {error.login_errors.email && <p>{error.login_errors.email}</p>}
                            {error.login_errors.password && <p>{error.login_errors.password}</p>}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>

                        <button type="submit">Login</button>
                    </form>
                </div>
                <div className="linkBox">
                    <h2 className="heading">Don't have an account?</h2>
                   <button onClick={()=>{navigate("/register")}}>Register</button>
                </div>
            </div>
        </div>
    );
};

export default Login;