import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, fetchLatestProductData } from '../Redux/feauter/slices/product/cartSlice';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const [localProduct, setLocalProduct] = useState(product);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.userInfo);
  const userChanges = useSelector((state) => state.cart.userChanges);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const truncateDescription = (description) => {
    if (description.length > 50) {
      return description.slice(0, 50) + '...';
    } else {
      const words = description.split(' ');
      if (words.length > 20) {
        return words.slice(0, 20).join(' ') + '...';
      } else {
        return description;
      }
    }
  };

  const handleSoldClick = () => {
    alert("Product sold!");
  };
  const handleBannedClick = () => {
    alert("Product Banned!");
  };
  const handleBuyProduct = async () => {
    if (window.confirm('Are you sure?')) {
      if (localProduct?.user_id == user.id) {
        alert("This is your product");
      } else {
        if (isLoggedIn) {
          if (user.bank_chard != null) {
            const cvv = prompt('Please enter your CVV:');
            if (!cvv || cvv.length !== 3) {
              alert('Invalid CVV. Please enter a valid 3-digit CVV.');
              return;
            }

            try {
              const purchaseData = {
                id: localProduct.id,
                user_id: user.id,
                quantity: 1,
                cvv,
              };

              const response = await axios.post('http://endpointshop/api.php?action=buyProduct', { products: purchaseData });

              const result = response.data;
              if (result.errors) {
                alert('There were errors processing your purchase: ' + result.errors.join(', '));
              } else {
                alert('Purchase successful!');

                setLocalProduct(prevProduct => ({
                  ...prevProduct,
                  count: prevProduct.count - 1
                }));
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
    const existingChange = userChanges.find(item => item.id === localProduct.id);
    if (!existingChange) {
      console.log(localProduct);
      if (localProduct.user_id == user.id) {
        alert('You cant add your product in cart.');
      } else {
        dispatch(addToCart({ id: localProduct.id, quantity: 1 }));
        dispatch(fetchLatestProductData([localProduct.id]));
      }

    } else {
      alert('Product already in cart.');
    }
  };
  
  const showCompanyName = (user_id) => {
    // Show company name logic here
  };

  const toProductPage = (product_id, user_id) => {
    navigate(`/products/${user_id}/${product_id}`);
  };

  const toProfilePage = (user_id) => {
    navigate(`/users/${user_id}`);
  };

  return (
    <div className="product-card">
      <div className='title_box'>
        <img src={product.user.avatar} alt="Company Avatar" className="company-avatar" onMouseOver={() => showCompanyName(localProduct.user_id)} onClick={() => toProfilePage(localProduct.user_id)} />
        <h3 className='product_title' onClick={() => toProductPage(localProduct.id, localProduct.user_id)}>{localProduct.name}</h3>
      </div>

      <div className="product-images">
        <Swiper
          pagination={{
            type: 'fraction',
          }}
          navigation={false}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {product.images.map((image, index) => (
            <div className='full' key={index}>
              <SwiperSlide><img src={image} alt={`Product ${index + 1}`} /></SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>

      <div className='product_list'>
        <p>Price: {product.price}</p>
        <p>Count: {product.count}</p>
        <p>Description: {truncateDescription(product.description)}</p>
      </div>

      {product.count <= 0 ? (
        <div className='btn_box'>
          <button className='main-button' onClick={handleSoldClick}>Product sold</button>
        </div>
      ) : (
        product.status == 1 ? (
          <div className='btn_box'>
            <button className='main-button' onClick={handleBannedClick}>Product banned</button>
          </div>
        ) : (

          <div className='btn_box'>
            <button className='main-button' onClick={handleBuyProduct}>Buy Now</button>
            <button className='main-button' onClick={handleAddToCartClick}>Add to cart</button>
          </div>
        )
      )}

    </div>
  );
};

export default ProductCard;
