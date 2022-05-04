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

const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const tokenInfoFromLocalStoage = localStorage.getItem("refreshToken")
  ? localStorage.getItem("refreshToken")
  : null;

const initialState = {
  userLogin: {
    userInfo: userInfoFromLocalStorage,
  },
  userLoginRefresh: {
    tokenInfo: tokenInfoFromLocalStoage,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
