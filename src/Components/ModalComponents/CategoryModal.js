import React, { useState } from 'react';
import '../../css/admin.css';
import '../../css/modal.css'; // You may need to create or import a CSS file for the modal styles
import axios from 'axios';
import { useCookies } from 'react-cookie';

const CategoryModal = ({ show, onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
    const [activeGender, setActiveGender] = useState(1);
    const [cookies, setCookie] = useCookies(['errors']);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('category_name', categoryName);
            formDataToSend.append('gender',activeGender);
            if (selectedImage) {
                const imageFile = e.target.updateAvatar.files[0];
                formDataToSend.append('image', imageFile);
              }
            console.log('Form Data:', formDataToSend);
            const response = await axios.post('http://endpointshop/api.php?action=addCategory', formDataToSend);
            if (response.data.errors) {
                setCookie('addCategoryErrors', response.data.errors, { path: '/updateErrors', expires: new Date(Date.now() + 3600000) });
                console.log('Errors:', response.data.errors);
              } else {
                setCookie('addCategoryErrors', {});
                console.log('Add Category Successful!');
                console.log('Inserted Data:', response.data);
                // dispatch(getUser(user.id));
                onClose(false);
                window.location.reload();
              }
            console.log('Server Response:', response.data);
        
    }catch (error) {
        console.error('Update failed:', error);
      }
    };
    const onCloseFunc=()=>{
        onClose(false);
    }
    const handleGenderClick = (gender) => {
        setActiveGender(gender);
    };
    // if (!show) {
    //     return null;
    // }
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
            <div className="modal-content category-modal">

                <span className="close" onClick={()=>{onCloseFunc()}}>&times;</span>
                <h3>Add Category</h3>

                <form onSubmit={handleSubmit}>
                    <div className='gender-buttons row'>
                        <label className='gender-button radio-input'>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={activeGender === 1}
                                onChange={() => handleGenderClick(1)}
                            />
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.19275 13.5375L6.06599 12.8196L6.23176 12.1564C5.16951 12.0125 4.13926 11.6902 3.18453 11.2032C3.07811 11.1394 3.01019 11.0272 3.00301 10.9034C2.99549 10.7796 3.04896 10.6598 3.14628 10.5827C3.15978 10.5737 4.50003 9.46762 4.50003 5.63532C4.50003 2.40326 5.25677 0.764386 6.75003 0.764386H6.97503C7.49309 0.208152 8.24431 -0.0698417 9.00002 0.0150247C10.4093 0.0150247 13.5 1.4306 13.5 5.63532C13.5 9.46762 14.8403 10.5737 14.85 10.5812C15.0158 10.7051 15.0497 10.9399 14.9257 11.1057C14.8966 11.1445 14.8602 11.1774 14.8185 11.2024C13.8646 11.694 12.833 12.0175 11.769 12.1586L11.9348 12.8203L14.8072 13.5382C16.6853 14.0051 18.0027 15.6915 18 17.6253C18 17.8322 17.8321 18 17.625 18H0.374987C0.167881 18 -2.47955e-05 17.8322 -2.47955e-05 17.6253C-0.00308418 15.6913 1.31436 14.0044 3.19275 13.5375Z" fill={activeGender === 1 ? '#0008C1' : '#939393'} />
                            </svg>
                            Female
                        </label>
                        <label className='gender-button radio-input'>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={activeGender === 2}
                                onChange={() => handleGenderClick(2)}
                            />
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
                            Male
                        </label>
                    </div>

                    <div className="form-group">
                        <input type="text" value={categoryName}  onChange={(e) => setCategoryName(e.target.value)} placeholder='CATEGORY' required/>
                    </div>
                    <div className="image-upload">
                        <input type="file" id="updateAvatar" name="updateAvatar" accept="image/*" onChange={handleImageChange} />
                        <label htmlFor="updateAvatar" className="file-container">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.3125 0H4.6875C2.10274 0 0 2.26177 0 5.04202V22.6891C0 25.4693 2.10274 27.7311 4.6875 27.7311H15.8203C16.2673 27.7311 16.6754 27.4576 16.8725 27.0258C17.0693 26.5942 17.0208 26.0794 16.7471 25.6993L13.6819 21.4382L22.1775 9.8147L27.6562 16.845V18.9706C27.6562 19.6668 28.1808 20.2311 28.8281 20.2311C29.4754 20.2311 30 19.6668 30 18.9706V5.04202C30 2.26177 27.8973 0 25.3125 0V0ZM23.0466 7.0054C22.8197 6.7144 22.4835 6.54822 22.1301 6.55487C21.777 6.56078 21.4453 6.73754 21.2272 7.03617L12.2028 19.3825L9.12987 15.111C8.90785 14.8023 8.56567 14.6219 8.20312 14.6219C8.20267 14.6219 8.20198 14.6219 8.20152 14.6219C7.83829 14.6223 7.49565 14.804 7.27432 15.1137L4.69528 18.72C4.30069 19.2719 4.39659 20.0632 4.90952 20.4876C5.42267 20.9123 6.15829 20.8089 6.55289 20.2572L8.20587 17.9459L13.4317 25.2101H4.6875C3.39523 25.2101 2.34375 24.0791 2.34375 22.6891V5.04202C2.34375 3.65202 3.39523 2.52101 4.6875 2.52101H25.3125C26.6048 2.52101 27.6562 3.65202 27.6562 5.04202V12.9207L23.0466 7.0054ZM8.20312 4.53782C6.2645 4.53782 4.6875 6.23408 4.6875 8.31933C4.6875 10.4046 6.2645 12.1008 8.20312 12.1008C10.1418 12.1008 11.7188 10.4046 11.7188 8.31933C11.7188 6.23408 10.1418 4.53782 8.20312 4.53782ZM8.20312 9.57983C7.55699 9.57983 7.03125 9.01433 7.03125 8.31933C7.03125 7.62433 7.55699 7.05882 8.20312 7.05882C8.84926 7.05882 9.375 7.62433 9.375 8.31933C9.375 9.01433 8.84926 9.57983 8.20312 9.57983ZM30 24.0126C30 24.7088 29.4754 25.2731 28.8281 25.2731H25.6055V28.7395C25.6055 29.4357 25.0809 30 24.4336 30C23.7863 30 23.2617 29.4357 23.2617 28.7395V25.2731H20.0391C19.3918 25.2731 18.8672 24.7088 18.8672 24.0126C18.8672 23.3164 19.3918 22.7521 20.0391 22.7521H23.2617V19.2857C23.2617 18.5895 23.7863 18.0252 24.4336 18.0252C25.0809 18.0252 25.6055 18.5895 25.6055 19.2857V22.7521H28.8281C29.4754 22.7521 30 23.3164 30 24.0126Z" fill="white" />
                            </svg>

                            Add Photo
                            {selectedImage && <img src={selectedImage} alt="Selected Avatar" />}
                        </label>
                    </div>
                    <div className="form-group">
                       <button type="submit" className="modal-button">Add</button>
                    </div>
                </form>
            </div>
    );
};

export default CategoryModal;
