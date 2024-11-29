import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestProductData, removeFromCart, updateQuantity } from '../Redux/feauter/slices/product/cartSlice';
import "../../css/main.css";
import '../../css/cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const [combinedCart, setCombinedCart] = useState([]);
  const { cart, userChanges, error, loading } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.userInfo);
  const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn);
  const navigate=useNavigate();
  const [fetched, setFetched] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    console.log(combinedCart);
    combinedCart.map((product, i) => {
      setTotalPrice(totalPrice + combinedCart.quantity * combinedCart.price)
      return totalPrice;
    })
    const productIds = userChanges.map(product => product.id);
    if (productIds.length > 0 && !fetched) {
      dispatch(fetchLatestProductData(productIds));
      setFetched(true);
    }
  }, [dispatch, userChanges, fetched]);
  useEffect(() => {
    const total = combinedCart.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);
    setTotalPrice(total);
  }, [combinedCart]);
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart({ id }));
    setFetched(false);
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }))
      .catch(error => {
        setCombinedCart(combinedCart);
        console.error('Failed to update quantity:', error);
      });
  };


  const handleBuyProduct = async () => {
    if (window.confirm('Are you sure?')) {
      if (isLoggedIn) {
        if (user.bank_chard != null) {
          const cvv = prompt('Please enter your CVV:');
          if (!cvv || cvv.length !== 3) {
            alert('Invalid CVV. Please enter a valid 3-digit CVV.');
            return;
          }

          try {
            // Prepare the data to send to the backend
            const purchaseData = combinedCart.map(product => ({
              id: product.id,
              quantity: product.quantity,
              user_id: user.id,
              cvv
            }));

            const response = await axios.post('http://endpointshop/api.php?action=buyProducts', { products: purchaseData });

            const result = response.data;
            console.log(result);
            if (result.errors) {
              alert('There were errors processing your purchase: ' + result.errors.join(', '));
            } else {
              alert('Purchase successful!');
              combinedCart.forEach(product => {
                dispatch(removeFromCart({ id: product.id }));
              });

            }
          } catch (error) {
            console.error('Error during purchase:', error);
            alert('There was an error processing your purchase. Please try again.');
          }
        } else {
          alert("Please add bank card and try again.");
          navigate('/profile');
        }

      }else {
        alert('Please login and add bank card.');
        navigate('/login');
      }

    }
  };

  useEffect(() => {
    setCombinedCart(
      userChanges.map(change => {
        const product = cart.find(product => product.id === change.id);
        if (product) {
          return {
            ...product,
            quantity: change.quantity,
            available: product.status == 0 && product.count > 0 && change.quantity <= product.count
          };
        } else {
          // Handle case where product is not found in cart
          return null; // or any default value
        }
      }).filter(Boolean) // Remove any null values
    );
  }, [cart, userChanges]);

  return (
    <div className="cart-page">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <h2>Cart</h2>
      <ul className="product-list">
        {combinedCart.map(product => (
          <li key={product.id} className='cart-list'>
            <div><img src={product.image} alt={product.name} className="product-image" /></div>
            <div className="cart-details">
              <span className="product-title">Title: {product.name} </span>
              <span className="product-quantity">Quantity: {product.quantity} </span>
              <span className="product-max-count">Max Count: {product.count} </span>
              <span className='product-price'>Price:{product.quantity * product.price}</span>
              {product.available ? '' : <span className="product-unavailable">(Not Available) </span>}
            </div>
            <div>
              <button onClick={() => handleRemoveFromCart(product.id)}>Remove</button>
              <button
                onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                disabled={product.quantity <= 1}
                className="quantity-btn"
              >
                -
              </button>
              <button
                onClick={() => {
                  if (product.count === product.quantity) {
                    alert("You ordered maximum count");
                  } else {
                    handleQuantityChange(product.id, product.quantity + 1);
                  }
                }}
                disabled={!product.available || product.quantity >= product.count}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className='final-details'>
        <h2>Final details</h2>
        <div>
          <p><strong>Total products:</strong> {combinedCart.length}</p>
          <p><strong>Price:</strong> {totalPrice}</p>
        </div>
        <button onClick={handleBuyProduct} className="quantity-btn">Buy Products</button>
      </div>

    </div>
  );
};

export default CartPage;
