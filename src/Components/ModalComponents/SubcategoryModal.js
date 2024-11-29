import React, { useState } from 'react';
import '../../css/admin.css';
import '../../css/modal.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const SubcategoryModal = ({ category, onClose}) => {
    const [subcategoryName, setSubcategoryName] = useState('');
    const [cookies, setCookie] = useCookies(['errors']);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('subcategory_name', subcategoryName);
            formDataToSend.append('category_id',category.id)
            console.log('Form Data:', formDataToSend);
            const response = await axios.post('http://endpointshop/api.php?action=addSubcategory', formDataToSend);
            if (response.data.errors) {
                setCookie('addCategoryErrors', response.data.errors, { path: '/updateErrors', expires: new Date(Date.now() + 3600000) });
                console.log('Errors:', response.data.errors);
              } else {
                setCookie('addCategoryErrors', {});
                console.log('Added Subategory Successful!');
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
   
    return (
            <div className="modal-content subcategory-modal">

                <span className="close"  onClick={()=>{onCloseFunc()}}>&times;</span>
                <h3>Add Subcategory</h3>

                <form onSubmit={handleSubmit}>
                <div className="form-group">
                        <input type="text" value={subcategoryName}  onChange={(e) => setSubcategoryName(e.target.value)} placeholder='Subcategory' required/>
                    </div>

                  
                  
                    <div className="form-group">
                       <button type="submit" className="modal-button">Add</button>
                    </div>
                </form>
            </div>
    );
};

export default SubcategoryModal;
