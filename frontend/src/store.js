import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  userLoginReducer,
  userLoginRefreshReducer,
  userRegisterReducer,
  userSendEmailVerficationReducer,
  userConfirmReducer,
  userResetPasswordReducer,
  userDetailsReducer,
  userProfileUpdateReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";

// combine all the above reducers to the store
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userLoginRefresh: userLoginRefreshReducer,
  userRegister: userRegisterReducer,
  userSendEmailVerfication: userSendEmailVerficationReducer,
  userConfirm: userConfirmReducer,
  userResetPassword: userResetPasswordReducer,
  userDetails: userDetailsReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
});

// get the user info from local storage
const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// get refresh token from the local storage
const tokenInfoFromLocalStoage = localStorage.getItem("refreshToken")
  ? localStorage.getItem("refreshToken")
  : null;

// set the initial state based on above local storage values
const initialState = {
  userLogin: {
    userInfo: userInfoFromLocalStorage,
  },
  userLoginRefresh: {
    tokenInfo: tokenInfoFromLocalStoage,
  },
};

// user redux thunk for making async calls
const middleware = [thunk];

// create the redux store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
