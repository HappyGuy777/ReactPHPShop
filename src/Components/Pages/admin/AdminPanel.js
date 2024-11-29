import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../Redux/feauter/slices/auth/authSlice';
import { getAllProducts } from '../../Redux/feauter/slices/product/productSlice';
import CategoryModal from '../../ModalComponents/CategoryModal';
import SubcategoryModal from '../../ModalComponents/SubcategoryModal';
import { getAllCategories } from '../../Redux/feauter/slices/admin/categotiesSlice';
import '../../../css/main.css';
import '../../../css/admin.css';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const categories = useSelector((state) => state.categories.categories);
    const user = useSelector((state) => state.auth.userInfo);
    const [activeGender, setActiveGender] = useState(1); // 1 for first button, 2 for second button
    const products = useSelector((state) => state.products.products);
    const [isSelected, setIsSelected] = useState(0);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            if (parseInt(user.status) !== 2) {
                navigate('/error-page');
            } else {
                dispatch(getUser(user.id));
                dispatch(getAllProducts(user.id));
                dispatch(getAllCategories());
            }
        }
    }, [dispatch, isLoggedIn, navigate, user.id, user.status]);

    useEffect(() => {
        if (products.length === 0) {
            console.log("No products loaded yet.");
            return;
        }

        console.log("Products before filtering:", products);

        // Filter by gender first
        let filtered = products.filter(product => product.gender == activeGender);
        console.log("Filtered by gender:", filtered);

        // Filter by category if selected
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category_id
                == selectedCategory.id);
            console.log("Filtered by category:", filtered);
        }

        // Filter by subcategory if selected
        if (selectedSubcategory && selectedCategory) {
            filtered = filtered.filter(product => product.subcategory_id == selectedSubcategory);
            console.log("Filtered by subcategory:", filtered);
        }

        // Update the filtered products state
        setFilteredProducts(filtered);
        console.log("Final filtered products:", filtered);

    }, [products, activeGender, selectedCategory, selectedSubcategory]);

    const toProductPage = (product_id, user_id) => {
        navigate(`/products/${user_id}/${product_id}`);
    };

    const showSubcategoryModalFunc = () => {
        if (selectedCategory) {
            setShowSubcategoryModal(true);
            document.body.style.overflow = 'hidden';
        } else {
            alert('Please select category')
        }


    };
    const closeModal = () => {
        setShowSubcategoryModal(false);
        setShowCategoryModal(false);
        document.body.style.overflow = '';
    };
    const showCategoryModalFunc = () => {
        setShowCategoryModal(true);
        document.body.style.overflow = 'hidden';
    };

    const handleGenderClick = (gender) => {
        setActiveGender(gender);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        console.log(selectedCategory);
        setSelectedSubcategory(null); // Reset subcategory when category changes
    };
    const selectedChange = (select) => {
        setIsSelected(select);
    }
    const handleSubcategoryClick = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
    };

    console.log("Products before filtering:", products);

    return (
        <div className='admin-panel'>
            <div className='filter-select'>
                <button className={`${isSelected == 0 ? 'selected' : ''}`} onClick={() => { selectedChange(0) }}>Products</button>
                <button className={`${isSelected == 1 ? 'selected' : ''}`} onClick={() => { selectedChange(1) }}>Users</button>
            </div>
            {isSelected == 0 ? (
                <div>
                    <div className='categories-list'>
                        <div className='gender-buttons'>
                            <button onClick={() => handleGenderClick(1)} className={`gender-button ${activeGender === 1 ? 'active' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.19275 13.5375L6.06599 12.8196L6.23176 12.1564C5.16951 12.0125 4.13926 11.6902 3.18453 11.2032C3.07811 11.1394 3.01019 11.0272 3.00301 10.9034C2.99549 10.7796 3.04896 10.6598 3.14628 10.5827C3.15978 10.5737 4.50003 9.46762 4.50003 5.63532C4.50003 2.40326 5.25677 0.764386 6.75003 0.764386H6.97503C7.49309 0.208152 8.24431 -0.0698417 9.00002 0.0150247C10.4093 0.0150247 13.5 1.4306 13.5 5.63532C13.5 9.46762 14.8403 10.5737 14.85 10.5812C15.0158 10.7051 15.0497 10.9399 14.9257 11.1057C14.8966 11.1445 14.8602 11.1774 14.8185 11.2024C13.8646 11.694 12.833 12.0175 11.769 12.1586L11.9348 12.8203L14.8072 13.5382C16.6853 14.0051 18.0027 15.6915 18 17.6253C18 17.8322 17.8321 18 17.625 18H0.374987C0.167881 18 -2.47955e-05 17.8322 -2.47955e-05 17.6253C-0.00308418 15.6913 1.31436 14.0044 3.19275 13.5375Z" fill={activeGender === 1 ? '#0008C1' : '#939393'} />
                                </svg>
                            </button>
                            <button onClick={() => handleGenderClick(2)} className={`gender-button ${activeGender === 2 ? 'active' : ''}`}>
                                <svg width="19" height="18" viewBox="0  0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_312_187)">
                                        <path d="M18.989 17.5343L18.514 15.7343C18.2887 14.861 17.6054 14.1588 16.705 13.875L13.2217 12.7755C12.3722 12.4403 11.9835 11.1443 11.8996 10.6522C12.5469 10.1423 12.9633 9.41685 13.0634 8.62499C13.0491 8.48974 13.0828 8.35383 13.1591 8.23873C13.2826 8.20944 13.3836 8.1257 13.4307 8.01373C13.6586 7.49088 13.8016 6.93837 13.855 6.37499C13.8551 6.34437 13.8512 6.31389 13.8431 6.28425C13.7864 6.06533 13.6506 5.87215 13.4592 5.73824V3.74998C13.4592 2.54173 13.0697 2.04599 12.6596 1.75873C12.5813 1.17675 11.9234 0 9.50089 0C7.35163 0.0819844 5.62909 1.71387 5.54255 3.75001V5.73827C5.35114 5.87218 5.21528 6.06537 5.15858 6.28429C5.15056 6.31392 5.14659 6.34444 5.1467 6.37502C5.19999 6.93868 5.34305 7.49145 5.57105 8.01453C5.60534 8.12053 5.69525 8.20206 5.80855 8.2298C5.85289 8.25078 5.93602 8.35956 5.93602 8.62506C6.03662 9.41917 6.45551 10.1463 7.10611 10.6561C7.02299 11.1473 6.63664 12.4426 5.81096 12.7696L2.29674 13.875C1.3971 14.1588 0.714283 14.8603 0.488584 15.7328L0.0135835 17.5328C-0.040188 17.7336 0.0879879 17.9376 0.299882 17.9885C0.331537 17.9962 0.364082 18 0.396738 18.0001H18.6051C18.8237 18 19.0009 17.8321 19.0008 17.625C19.0008 17.5943 18.9968 17.5639 18.989 17.5343Z" fill={activeGender === 2 ? '#0008C1' : '#939393'} />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_312_187)">
                                            <rect width="19" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>

                        <div className='categories'>
                            {categories?.map((category) => {
                                if (category.gender == activeGender) {
                                    return (
                                        <div className={`category ${selectedCategory?.id == category.id ? 'selected' : ''} `} key={category.id} onClick={() => handleCategoryClick(category)}>
                                            <img className='category-image' src={category.image} alt={category.name} />
                                            <p className='category-name'>{category.name}</p>
                                        </div>
                                    )
                                }

                            })}
                        </div>

                        <div className='modalbox'>
                            <button className={`category-add ${showCategoryModal ? 'z-top' : ''}`} onClick={() => { showCategoryModalFunc(true) }}>+</button>
                            {showCategoryModal && (
                                <CategoryModal
                                    show={showCategoryModal}
                                    onClose={() => {
                                        closeModal();

                                    }}
                                />
                            )}</div>
                    </div>


                    <div className='subcategories'>
                        <div className='subategories-list'>
                            {
                                selectedCategory?.subcategories.map((subcategory) => {
                                    return (
                                        <div className={`subcategory ${selectedSubcategory == subcategory.id ? 'selected' : ''}`} key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory.id)}>
                                            <p className='subcategory-name'>{subcategory.name}</p>
                                        </div>)

                                })}



                        </div>
                        <div className='modalbox'>
                            <button className={`category-add horizontal-btn ${showSubcategoryModal ? 'z-top' : ''}`} onClick={() => { showSubcategoryModalFunc(true) }}>+</button>

                            {showSubcategoryModal && (
                                <SubcategoryModal
                                    category={selectedCategory}
                                    onClose={() => {
                                        closeModal();
                                    }}
                                />
                            )}
                        </div>

                    </div>


                    {showCategoryModal && <div className='modal-backdrop modal-part'></div>}
                    {showSubcategoryModal && <div className='modal-backdrop modal-part'></div>}

                    <div className='admin-products'>
                        {/* <div className='admin-filter'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.172 5.73484H16.9543C17.2411 5.73484 17.4758 5.47678 17.4758 5.16137C17.4758 4.84596 17.2411 4.58789 16.9543 4.58789H16.172C15.8852 4.58789 15.6505 4.84596 15.6505 5.16137C15.6505 5.47678 15.8852 5.73484 16.172 5.73484Z" fill="white" />
                        <path d="M23.8902 0.630824C23.7077 0.229391 23.3427 0 22.9515 0H1.04846C0.657335 0 0.292284 0.258064 0.109758 0.630824C-0.0727673 1.03226 -0.0206171 1.49104 0.214059 1.83513L9.41857 14.5663V22.853C9.41857 23.2832 9.62717 23.6559 9.96614 23.8566C10.1226 23.9427 10.279 24 10.4616 24C10.6702 24 10.8788 23.9427 11.0613 23.7993L13.9556 21.5914C14.3728 21.2473 14.6075 20.7312 14.6075 20.1864V14.5376L23.7859 1.83513C24.0206 1.49104 24.0728 1.03226 23.8902 0.630824ZM13.6688 13.9928C13.6167 14.0789 13.5645 14.1935 13.5645 14.3369V20.1577C13.5645 20.3584 13.4863 20.5305 13.3559 20.6452L10.4616 22.853V14.3369C10.4616 14.1362 10.3833 13.9642 10.253 13.8781L4.36 5.73477H13.8253C14.1121 5.73477 14.3468 5.4767 14.3468 5.16129C14.3468 4.84588 14.1121 4.58781 13.8253 4.58781H3.65597C3.6299 4.58781 3.57775 4.58781 3.55167 4.58781L1.04846 1.14695H22.9515L13.6688 13.9928Z" fill="white" />

                    </svg>
                    <div className='arrow'>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13L7 7L0.999999 1" stroke="white" stroke-linecap="round" stroke-linejoin="round" />

                        </svg>
                    </div>
                    <p className='filter-text'>Filter</p>
                </div> */}

                        {filteredProducts?.map((product) => (
                            <div className='admin-product' key={product.id}>
                                <div className={`upper-right-box ${product.status == 1 ? 'banned' : ''} `}>{`${product.status == 1 ? 'X' : '✓'}`}</div>
                                <img className='admin-product-image' src={product.images[0]} alt='img' onClick={() => { toProductPage(product.id, product.user_id) }} />
                                <div className='admin-product-info'>
                                    <p className='product-id'>{product.id}</p>
                                    <p className='product-price'>{product.price}$</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div className='categories'>
                        <div>
                            <h1>Users List</h1>
                            <label>Search User: </label>
                            <input type='text'></input>
                        </div>


                    </div>
                    {filteredProducts?.map((product) => (
                            <div className='admin-product' key={product.id}>
                                <div className={`upper-right-box ${product.status == 1 ? 'banned' : ''} `}>{`${product.status == 1 ? 'X' : '✓'}`}</div>
                                <img className='admin-product-image' src={product.images[0]} alt='img' onClick={() => { toProductPage(product.id, product.user_id) }} />
                                <div className='admin-product-info'>
                                    <p className='product-id'>{product.id}</p>
                                    <p className='product-price'>{product.price}$</p>
                                </div>
                            </div>
                        ))}
                </div>
            )}

        </div>
    );
};

export default AdminPanel;
