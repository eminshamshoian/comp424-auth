import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshLogin, getUserDetails } from "../actions/userActions";
import Message from "../components/Message";

const HomePage = () => {
  const [promptVerfication, setPromptVerification] = useState(false);
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userInfoError } = userDetails;

  useEffect(() => {
    userInfo
      ? userInfo.isSocialLogin
        ? dispatch(getUserDetails(userInfo.id))
        : dispatch(getUserDetails("profile"))
      : dispatch(getUserDetails("profile"));
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (userInfoError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      dispatch(refreshLogin(user?.email));
    }
  }, [userInfoError, dispatch, userInfo]);

  useEffect(() => {
    setPromptVerification(
      localStorage.getItem("promptEmailVerfication") === "true" ? true : false
    );
  }, []);

  return (
    <>
      {promptVerfication ? (
        <Message dismissible variant='info' duration={10}>
          Account Created! Please check your email to verify your account.
        </Message>
      ) : null}

      {!userInfo && (
        <>
          <h1>Welcome to Our Comp 424 Project</h1>{" "}
          <h5>Please Login to View Company Data</h5>
        </>
      )}
      {userInfo && userInfo.isConfirmed && (
        <>
          <h1>Welcome {userInfo.name}</h1>
          <p>you have logged in 2 times and your last login was 4/21/2022</p>
          <div>
            <a
              href='https://drive.google.com/file/d/178xzgYjxyF7tolCJWo__-JGfGKbu-Y_6/view?usp=sharing'
              download
            >
              Click to download the company file
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
