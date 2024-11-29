import React, { useState } from 'react';
import '../../css/modal.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getUser } from "../Redux/feauter/slices/auth/authSlice";

const UpdateUserModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth.userInfo);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const [cookies, setCookie] = useCookies(['errors']);
  const dispatch = useDispatch();
  const errors = cookies.errors || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('name', e.target.name.value);
      formDataToSend.append('second_name', e.target.second_name.value);
      formDataToSend.append('cellphone', e.target.cellphone.value);
      formDataToSend.append('bank_chard', e.target.bank_chard.value);
      formDataToSend.append('password', e.target.password.value);
      formDataToSend.append('repeat_password', e.target.repeat_password.value);

      // Ensure passwords are only sent if they are not empty
      if (!formDataToSend.get('password')) {
        formDataToSend.delete('password');
      }
      if (!formDataToSend.get('repeat_password')) {
        formDataToSend.delete('repeat_password');
      }

      // Append the image file if selected
      if (selectedImage) {
        const imageFile = e.target.updateAvatar.files[0];
        formDataToSend.append('avatar', imageFile);
      }

      console.log('Form Data:', formDataToSend);

      const response = await axios.post('http://endpointshop/api.php?action=updateUser', formDataToSend);
      console.log('Server Response:', response.data);

      if (response.data.errors) {
        setCookie('updateErrors', response.data.errors, { path: '/updateErrors', expires: new Date(Date.now() + 3600000) });
        console.log('Errors:', response.data.errors);
      } else {
        setCookie('updateErrors', {});
        console.log('Update Successful!');
        console.log('Inserted Data:', response.data);
        dispatch(getUser(user.id));
        window.location.reload();
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target;
    if (!file.files || file.files.length === 0) {
      setSelectedImage(null);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file.files[0]);
    }
  };

  return (
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update User Information</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" defaultValue={user.name} />
          </div>
          <div>
            <label htmlFor="second_name">Second Name:</label>
            <input type="text" id="second_name" name="second_name" defaultValue={user.second_name} />
          </div>
          <div>
            <label htmlFor="cellphone">Cell Phone:</label>
            <input type="number" id="cellphone" name="cellphone" defaultValue={user.cellphone} />
          </div>
          <div>
            <label htmlFor="bank_chard">Bank Chard:</label>
            <input type="number" id="bank_chard" name="bank_chard" defaultValue={user.bank_chard} />
            <span style={{ color: 'grey', fontSize: '0.8em' }}>Hint: Bank card number should be 16 digits.</span>
          </div>
          <div>
            <label htmlFor="password">Update password:</label>
            <input type="password" id="password" name="password" />
          </div>
          <div>
            <label htmlFor="repeat_password">Repeat password:</label>
            <input type="password" id="repeat_password" name="repeat_password" />
          </div>
          <div className="image-upload">
            <input type="file" id="updateAvatar" name="updateAvatar" accept="image/*" onChange={handleImageChange} />
            <label htmlFor="updateAvatar" className="file-container">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.3125 0H4.6875C2.10274 0 0 2.26177 0 5.04202V22.6891C0 25.4693 2.10274 27.7311 4.6875 27.7311H15.8203C16.2673 27.7311 16.6754 27.4576 16.8725 27.0258C17.0693 26.5942 17.0208 26.0794 16.7471 25.6993L13.6819 21.4382L22.1775 9.8147L27.6562 16.845V18.9706C27.6562 19.6668 28.1808 20.2311 28.8281 20.2311C29.4754 20.2311 30 19.6668 30 18.9706V5.04202C30 2.26177 27.8973 0 25.3125 0V0ZM23.0466 7.0054C22.8197 6.7144 22.4835 6.54822 22.1301 6.55487C21.777 6.56078 21.4453 6.73754 21.2272 7.03617L12.2028 19.3825L9.12987 15.111C8.90785 14.8023 8.56567 14.6219 8.20312 14.6219C8.20267 14.6219 8.20198 14.6219 8.20152 14.6219C7.83829 14.6223 7.49565 14.804 7.27432 15.1137L4.69528 18.72C4.30069 19.2719 4.39659 20.0632 4.90952 20.4876C5.42267 20.9123 6.15829 20.8089 6.55289 20.2572L8.20587 17.9459L13.4317 25.2101H4.6875C3.39523 25.2101 2.34375 24.0791 2.34375 22.6891V5.04202C2.34375 3.65202 3.39523 2.52101 4.6875 2.52101H25.3125C26.6048 2.52101 27.6562 3.65202 27.6562 5.04202V12.9207L23.0466 7.0054ZM8.20312 4.53782C6.2645 4.53782 4.6875 6.23408 4.6875 8.31933C4.6875 10.4046 6.2645 12.1008 8.20312 12.1008C10.1418 12.1008 11.7188 10.4046 11.7188 8.31933C11.7188 6.23408 10.1418 4.53782 8.20312 4.53782ZM8.20312 9.57983C7.55699 9.57983 7.03125 9.01433 7.03125 8.31933C7.03125 7.62433 7.55699 7.05882 8.20312 7.05882C8.84926 7.05882 9.375 7.62433 9.375 8.31933C9.375 9.01433 8.84926 9.57983 8.20312 9.57983ZM30 24.0126C30 24.7088 29.4754 25.2731 28.8281 25.2731H25.6055V28.7395C25.6055 29.4357 25.0809 30 24.4336 30C23.7863 30 23.2617 29.4357 23.2617 28.7395V25.2731H20.0391C19.3918 25.2731 18.8672 24.7088 18.8672 24.0126C18.8672 23.3164 19.3918 22.7521 20.0391 22.7521H23.2617V19.2857C23.2617 18.5895 23.7863 18.0252 24.4336 18.0252C25.0809 18.0252 25.6055 18.5895 25.6055 19.2857V22.7521H28.8281C29.4754 22.7521 30 23.3164 30 24.0126Z" fill="white" />
              </svg>

              Upload Avatar
              {selectedImage && <img src={selectedImage} alt="Selected Avatar" />}
            </label>
          </div>
          <button type="submit" className="modal-button">Update</button>
        </form>
      </div>
  );
};

export default UpdateUserModal;
