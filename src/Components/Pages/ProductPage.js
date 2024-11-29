import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/product.css';
import 'swiper/swiper-bundle.css';
import { getCurrentProduct, statusToggle } from '../Redux/feauter/slices/product/productSlice';
import ProductCard from '../ProductComponents/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { addToCart, fetchLatestProductData } from '../Redux/feauter/slices/product/cartSlice';
import axios from 'axios';

const ProductPage = () => {
  const { userChanges } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { user_id, product_id } = useParams();
  const currentProduct = useSelector((state) => state.products.currentProduct.currentProduct);
  const otherProducts = useSelector((state) => state.products.currentProduct.otherProducts);
  const error = useSelector((state) => state.products.currentProduct.error);
  const loading = useSelector((state) => state.products.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(currentProduct);
  console.log(error);
  
  const handleBannedToggle=()=>{
    if (user.status==2) {
      
      dispatch(statusToggle(currentProduct.id));
      window.location.reload();
    }
  }
  const handleBuyProduct = async () => {
    if (window.confirm('Are you sure?')) {
      if (currentProduct.user_id == user.id) {
        alert("This is your product");
      }else{
        if (isLoggedIn) {
          if (user.bank_chard != null) {
            const cvv = prompt('Please enter your CVV:');
            if (!cvv || cvv.length !== 3) {
              alert('Invalid CVV. Please enter a valid 3-digit CVV.');
              return;
            }

            try {
              const purchaseData = {
                id: product_id,
                quantity: 1,
                cvv,
              };

              const response = await axios.post('http://endpointshop/api.php?action=buyProduct', { products: purchaseData });

              const result = response.data;
              console.log(result);
              if (result.errors) {
                alert('There were errors processing your purchase: ' + result.errors.join(', '));
              } else {
                alert('Purchase successful!');
                window.location.reload();
              }
            } catch (error) {
              console.error('Error during purchase:', error);
              alert('There was an error processing your purchase. Please try again.');
            }
          } else {
            alert("Please add bank card and try again.");
            navigate('/profile');
          }
        } else {
          alert('Please login and add bank card.');
          navigate('/login');
        }
      }
    }
  };

  const handleAddToCartClick = () => {
    const existingChange = userChanges.find(item => item.id === currentProduct.id);
    if (!existingChange) {
      if (currentProduct.user_id==user.id) {
        alert('You cant add your product in cart.');
      }else{
        dispatch(addToCart({ id: currentProduct.id, quantity: 1 }));
      dispatch(fetchLatestProductData([currentProduct.id]));
      }
      
    } else {
      alert('Product already in cart.');
    }
  };

  const productCheck = () => {
    if (user.status == 2) {
      if (currentProduct?.count > 0) {
        return (
          <>
            <button onClick={handleBuyProduct} className='main-button'>Buy product</button>
            <button onClick={handleAddToCartClick} className='main-button'>Add product to cart</button>
            <button className={` ${currentProduct.status ==1 ? 'banned' : ''} `} onClick={handleBannedToggle}>{currentProduct?.status != 1 ? "Ban the poduct" : 'Banned product'}</button>
          </>
        );
      } else {
        return <button className='main-button'>Product not available</button>;
      }
    } else {
      if (currentProduct?.status !== 1 && currentProduct?.count > 0) {

        return (
          <>
            <button onClick={handleBuyProduct} className='main-button'>Buy product</button>
            <button onClick={handleAddToCartClick} className='main-button'>Add product to cart</button>

          </>
        );
      } else {
        return <button className='main-button'>Product not available</button>;
      }
    }

  };

  useEffect(() => {
    
    const fetchProduct = async () => {
      try {
        const response = await dispatch(getCurrentProduct({ product_id, user_id,requestorID:user.id })).unwrap();
      
        console.log(response);
        
        if (response.errors && (response.errors.includes("User is banned.") || response.errors.includes("Product is banned.") )) {
          if (user.status!=2) {
            navigate('/error-page');
          }
        }
        if (response.errors && (response.errors.includes("Invalid ProductId.") || response.errors.includes("This product dont belong this user.")|| response.errors.includes("Invalid UserId."))) {
          navigate('/error-page');
        }
      } catch (error) {
        navigate('/error-page');
      }
    };

    fetchProduct();
  }, [dispatch, navigate, user_id, product_id,user]);

  if (error) {
    navigate('/error-page');
  }

  return (
    <div>
      {loading ? (
      <div>Loading...</div>
    ) : (
      <><div className="product-page">
        <div className="product-header">
          <Swiper pagination={{ type: 'fraction' }} navigation={false} modules={[Pagination, Navigation]} className="mySwiper">
            {currentProduct?.images?.map((image, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <div className='full'>
                  <img src={image} alt={`Product ${index + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="product-info">
            <div className="title_box">
              <img
                src={currentProduct?.user.avatar}
                alt="Company Avatar"
                className="company-avatar big-avatar"
                onClick={() => navigate(`/users/${user_id}`)}
              />
              <h2>{currentProduct?.name}</h2>
            </div>

            <div className="description-box">
              <h3>Product Description:</h3>
              <p>{currentProduct?.description}</p>
            </div>

            <div className="details-list">
              <h3>Product Details:</h3>
              <p><strong>Price:</strong> {currentProduct?.price}</p>
              <p><strong>Count:</strong> {currentProduct?.count}</p>
            </div>
            <div className="product-buttons">
              {productCheck()}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Company Other Products</h2>
        <div className="product-container">
          {otherProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div></>
      
    )}
    </div>
  );
};

export default ProductPage;
