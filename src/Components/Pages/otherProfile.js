import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/profile.css';
import { getOtherProfile } from '../Redux/feauter/slices/otherProfile/otherProfileSlice';
import UpdateUserModal from '../ModalComponents/UpdateUserModal';
import UpdateAccountModal from '../ModalComponents/UpdateAccountModal';
import UpdateCompanyInfoModal from '../ModalComponents/UpdateCompanyInfoModal';
import AddProductModal from '../ModalComponents/AddProductModal';
import { getUserProducts } from '../Redux/feauter/slices/product/productSlice';
import ProductCard from '../ProductComponents/ProductCard';

const OtherProfile = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const { user_id } = useParams();
    const activeUser = useSelector((state) => state.auth.userInfo);
    const user = useSelector((state) => state.otherProfle.userInfo);
    const error = useSelector((state) => state.otherProfle.error);
    const loading = useSelector((state) => state.otherProfle.loading);
    const products = useSelector((state) => state.products.products);
    console.log(products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
    const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false);
    const [showUpdateCompanyModal, setShowUpdateCompanyModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);

    const handleUpdateUserClick = () => {
        setShowUpdateUserModal(true);
    };

    const handleUpdateAccountClick = () => {
        setShowUpdateAccountModal(true);
    };

    const handleUpdateCompanyClick = () => {
        setShowUpdateCompanyModal(true);
    };

    const handleAddProductClick = () => {
        setShowAddProductModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateUserModal(false);
        setShowUpdateAccountModal(false);
        setShowUpdateCompanyModal(false);
        setShowAddProductModal(false);
    };

    const companyCheck = () => {
        if (user?.status === 1) {
            return (
                <Fragment>
                    <button onClick={handleUpdateCompanyClick}>Update company information</button>
                    <button onClick={handleAddProductClick}>Add a product</button>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <button onClick={handleUpdateUserClick}>Update User</button>
                    <button onClick={handleUpdateAccountClick}>Convert Account</button>
                </Fragment>
            );
        }
    };
    useEffect(() => {
        if (activeUser.id == user_id) {
            navigate('/profile');
        } else {
            dispatch(getOtherProfile({ userId: user_id, requestorID: isLoggedIn && activeUser.id }));
            dispatch(getUserProducts({ userId: user_id, requestorID: isLoggedIn && activeUser.id }));
        }
    }, [activeUser.id, user_id, dispatch, navigate]);
    
    
    

    const getImageFormat = (imageData) => {
        // Your logic for determining image format
    };

    useEffect(() => {
        // if (error) {
        //     navigate("/error-page");
        // }
    }, [error, navigate]);

    if (loading) {
        return (<div>LOADING</div>);
    }

    return (
        <div>
            {showUpdateUserModal && <div className="modal-backdrop"><UpdateUserModal isOpen={showUpdateUserModal} onClose={handleCloseModal} /></div>}
            {showUpdateCompanyModal && <div className="modal-backdrop"><UpdateCompanyInfoModal isOpen={showUpdateCompanyModal} onClose={handleCloseModal} /></div>}
            {showAddProductModal && <div className="modal-backdrop"><AddProductModal isOpen={showAddProductModal} onClose={handleCloseModal} /></div>}
            {showUpdateAccountModal && <div className="modal-backdrop"><UpdateAccountModal isOpen={showUpdateAccountModal} onClose={handleCloseModal} /></div>}

            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-image">

                        {user && user?.avatar_base64 && (
                            <img
                                src={`data:image/${getImageFormat(user.avatar_base64)};base64, ${user?.avatar_base64}`}
                                alt="Profile"
                            />
                        )}

                    </div>
                    <div className="profile-info">
                        <div>
                            <h2>{user?.status==0? user?.name: user?.company_name}</h2>
                            <h2>{user?.status==0? user?.second_name: ""}</h2>
                        </div>
                        {/*<button onClick={handleLogout}>Logout</button>*/}
                    </div>
                </div>
                <div className="user-details">
                    <p>{user?.status==0? "": user?.description}</p>
                    <h2>User Details</h2>
                    <div className="details-list">
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Gender:</strong> {user?.gender}</p>
                        <p><strong>{user?.status==0? "Birthday:": "Company created:"}</strong> {user?.birthday}</p>
                        <p><strong>Cellphone:</strong>{user?.cellphone?user.cellphone:""}</p>
                        <p><strong>Account create date:</strong> {user?.created_at}</p>
                    </div>
                </div>
                {/* <div className="profile-actions">
                    <h2>Profile Actions</h2>
                    <div className="action-buttons">
                        {companyCheck()}
                    </div>
                </div> */}
            </div>
            {user?.status == 1 &&
            <div>
                <h2>Products</h2>
                <div className="product-container">
                    {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>}
            {user?.status != 1 && activeUser.status==2  && user.status!=0 &&
            <div>
                <h2>Products</h2>
                <div className="product-container">
                    {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default OtherProfile;

