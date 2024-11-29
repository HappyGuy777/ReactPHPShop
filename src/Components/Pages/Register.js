import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import '../../css/main.css';
import '../../css/register.css';
import {  useNavigate } from 'react-router-dom';
import Footer from "../Navigation/Footer";
import {useSelector} from "react-redux";

const RegistrationForm = () => {
    const isLoggedIn=useSelector((state )=> state.auth.isLoggedIn);
    const navigate = useNavigate(); // Initialize useNavigate
    const [cookies, setCookie] = useCookies(['errors']);
    const errors = cookies.errors || {};
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile');
        }
    }, [isLoggedIn, navigate]);


    const [formData, setFormData] = useState({
        name: '',
        second_name: '',
        email: '',
        birthday:'',
        gender: 'male',
        password: '',
        repeatPassword: ''
    });



    useEffect(() => {
        // Clear errors when component mounts
        setCookie('errors', {});
    }, [setCookie]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    function getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
    
        // Append leading zeros if month/day is less than 10
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
    
        return `${year}-${month}-${day}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Form Data:', formData);
            const response = await axios.post('http://endpointshop/api.php?action=register', formData);
            console.log('Server Response:', response.data);

            if (response.data.errors) {
                // Update errors in cookies
                setCookie('errors', response.data.errors, { path: '/', expires: new Date(Date.now() + 3600000) });
                console.log('Errors:', response.data.errors);
            } else {
                // Clear errors on successful registration
                setCookie('errors', {});
                console.log('Registration Successful!');
                console.log('Inserted Data:', response.data); // Assuming PHP sends the inserted data back
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div>
            <div className="body">
                <div className="registration-form">
                    <h2>Registration</h2>
                    {errors.network_error && (
                        <div className="error-message">
                            <p>{errors.network_error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name: {errors.register_errors && errors.register_errors.name && <p>{errors.register_errors.name}</p>}</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Second Name: {errors.register_errors && errors.register_errors.second_name && <p>{errors.register_errors.second_name}</p>}</label>
                            <input type="text" name="second_name" value={formData.second_name} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Email: {errors.register_errors && errors.register_errors.email && <p>{errors.register_errors.email}</p>}</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Birthday:{errors.register_errors && errors.register_errors.birthday&& <p>{errors.register_errors.birthday}</p>}</label>
                            <input type="date" name="birthday" placeholder="Birthday" value={formData.birthday} onChange={handleChange} max={getCurrentDate()} />
                        </div>

                        <div>
                            <label>Gender:</label>
                            <div className="gender_box">
                                <label>
                                    Male
                                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
                                </label>
                                <label>
                                    Female
                                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label>Password: {errors.register_errors && errors.register_errors.password && <p>{errors.register_errors.password}</p>}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Repeat Password: {errors.register_errors && errors.register_errors.repeatPassword && <p>{errors.register_errors.repeatPassword}</p>}</label>
                            <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} />
                        </div>

                        <button type="submit">Register</button>
                    </form>
                </div>
                <div className="linkBox">
                    <h2 className="heading">Already have an account?</h2>
                  <button onClick={()=>{navigate("/login")}}>To login</button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
