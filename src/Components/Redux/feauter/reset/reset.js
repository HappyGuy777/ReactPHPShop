import { resetAuthState } from '../auth/authSlice';
import { resetUserState } from '../userActions/userSlice';

const reset = (dispatch) => {
    dispatch(resetAuthState());
    dispatch(resetUserState());
    // Dispatch other reset actions if you have additional slices
};

export default reset;
