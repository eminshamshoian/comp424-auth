import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Button,
  Row,
  InputGroup,
  Col,
  Card,
  Image,
  FloatingLabel,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  sendVerficationEmail,
  getUserDetails,
  updateUserProfile,
  refreshLogin,
} from "../actions/userActions";
import { USER_PROFILE_UPDATE_RESET } from "../constants/userConstants";
import Meta from "../components/Meta";
import axios from "axios";
import "../styles/profile-page.css";

const ProfilePage = ({ history }) => {
  const inputFile = useRef(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [typePassword, setTypePassword] = useState("password");
  const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [errorImageUpload, setErrorImageUpload] = useState("");
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userProfileUpdate = useSelector((state) => state.userProfileUpdate);
  const { success } = userProfileUpdate;

  const userSendEmailVerfication = useSelector(
    (state) => state.userSendEmailVerfication
  );
  const { emailSent, hasError } = userSendEmailVerfication;

  useEffect(() => {
    if (error && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [error, dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      if (name && userInfo.name !== name) setShowSubmitButton(true);
      else if (email && userInfo.email !== email) setShowSubmitButton(true);
      else if (password || confirmPassword) setShowSubmitButton(true);
      else setShowSubmitButton(false);
    }
  }, [name, email, password, confirmPassword, userInfo]);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_PROFILE_UPDATE_RESET });
        userInfo
          ? userInfo.isSocialLogin
            ? dispatch(getUserDetails(userInfo.id))
            : dispatch(getUserDetails("profile"))
          : dispatch(getUserDetails("profile"));
        if (success) {
          userInfo.isSocialLogin
            ? dispatch(getUserDetails(userInfo.id))
            : dispatch(getUserDetails("profile"));
        }
      } else {
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar);
      }
    }
  }, [history, userInfo, user, dispatch, success]);

  const showHidePassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTypePassword(typePassword === "password" ? "text" : "password");
  };

  const showHideConfirmPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTypeConfirmPassword(
      typeConfirmPassword === "password" ? "text" : "password"
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setAvatar(data);
      dispatch(
        updateUserProfile({
          id: user.id,
          avatar: data,
        })
      );
      setUploading(false);
    } catch (error) {
      setErrorImageUpload("Please choose a valid image");
      setUploading(false);
    }
  };

  const handleImageClick = () => {
    inputFile.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please retry.");
    } else {
      dispatch(
        updateUserProfile({
          id: user.id,
          name,
          email,
          avatar,
          password,
          confirmPassword,
        })
      );
    }
  };

  return (
    <Row className='mt-2'>
      <Meta title='My Profile | COMP 424' />
      {userInfo && !userInfo.isConfirmed ? (
        <>
          {emailSent && (
            <Message variant='success' dismissible>
              A verification link has been sent your mail!
            </Message>
          )}
          {hasError && (
            <Message dismissible variant='danger'>
              {hasError}
            </Message>
          )}
          <Card style={{ margin: "0" }} className='mb-3'>
            <Card.Body className='ps-0 '>
              <Card.Title style={{ fontWeight: "bold" }}>
                Account Not Verified
              </Card.Title>
              <Card.Text>
                {`${userInfo.name}, `} your account is not yet verfied. Please{" "}
                <Button
                  variant='link'
                  className='p-0'
                  style={{
                    fontSize: "0.9em",
                    margin: "0 0 0.1em 0",
                    focus: "none",
                  }}
                  onClick={() => dispatch(sendVerficationEmail(userInfo.email))}
                >
                  click here
                </Button>{" "}
                to send a verfication email.
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      ) : null}
      <Col
        md={3}
        style={
          userInfo && !userInfo.isConfirmed
            ? {
                opacity: "0.5",
                pointerEvents: "none",
              }
            : {
                opacity: "1",
                pointerEvents: "",
              }
        }
      >
        <h2 className='text-center'>My Profile</h2>
        {message && (
          <Message dismissible variant='warning' duration={8}>
            {message}
          </Message>
        )}
        {error && error !== "Not authorised. Token failed" && (
          <Message dismissible variant='danger' duration={10}>
            {error}
          </Message>
        )}
        {success && (
          <Message dismissible variant='success' duration={8}>
            Profile Updated!
          </Message>
        )}
        {loading ? (
          <Loader />
        ) : (
          <div style={{ display: "flex", flexFlow: "column nowrap" }}>
            {errorImageUpload && (
              <Message dismissible variant='danger' duration={10}>
                {errorImageUpload}
              </Message>
            )}
            {uploading ? (
              <Loader />
            ) : (
              <div
                className='profile-page-image'
                style={{ alignSelf: "center" }}
              >
                <Image
                  src={avatar}
                  alt={name}
                  style={{
                    height: "5em",
                    width: "5em",
                    marginBottom: "1em",
                    border: "1px solid #ced4da",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
                <div className='image-overlay' onClick={handleImageClick}>
                  Click to upload image
                </div>
              </div>
            )}
            <input
              type='file'
              accept='image/*'
              id='file'
              ref={inputFile}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='name'>
                <FloatingLabel
                  controlId='nameinput'
                  label='Name'
                  className='mb-3'
                >
                  <Form.Control
                    size='lg'
                    placeholder='Enter Name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group
                controlId='email'
                className='my-2'
                style={
                  userInfo && userInfo.isSocialLogin
                    ? {
                        pointerEvents: "none",
                        opacity: "0.8",
                      }
                    : {}
                }
              >
                <FloatingLabel
                  controlId='emailinput'
                  label='Email'
                  className='mb-3'
                >
                  <Form.Control
                    size='lg'
                    placeholder='Enter Email Address'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              {userInfo && !userInfo.isSocialLogin && (
                <>
                  <Form.Group>
                    <InputGroup className='d-block'>
                      <FloatingLabel
                        controlId='passwordinput'
                        label='Password'
                        style={{ display: "flex" }}
                        className='mb-3'
                      >
                        <Form.Control
                          size='lg'
                          type={typePassword}
                          placeholder='Enter your password'
                          value={password}
                          style={{
                            borderRight: "none",
                            width: "100%",
                          }}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='input-group-append'>
                          <InputGroup.Text
                            onClick={showHidePassword}
                            style={{
                              fontSize: "1rem",
                              height: "100%",
                              marginLeft: "-0.5em",
                              background: "transparent",
                              borderLeft: "none",
                            }}
                          >
                            {typePassword === "text" ? (
                              <i className='far fa-eye-slash' />
                            ) : (
                              <i className='far fa-eye' />
                            )}
                          </InputGroup.Text>
                        </div>
                      </FloatingLabel>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <InputGroup className='d-block'>
                      <FloatingLabel
                        controlId='confirmpasswordinput'
                        label='Confirm Password'
                        style={{ display: "flex" }}
                        className='mb-3'
                      >
                        <Form.Control
                          size='lg'
                          type={typeConfirmPassword}
                          placeholder='Confirm password'
                          value={confirmPassword}
                          style={{
                            borderRight: "none",
                          }}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className='input-group-append'>
                          <InputGroup.Text
                            onClick={showHideConfirmPassword}
                            style={{
                              fontSize: "1rem",
                              height: "100%",
                              marginLeft: "-0.5em",
                              background: "transparent",
                              borderLeft: "none",
                            }}
                          >
                            {typeConfirmPassword === "text" ? (
                              <i className='far fa-eye-slash' />
                            ) : (
                              <i className='far fa-eye' />
                            )}
                          </InputGroup.Text>
                        </div>
                      </FloatingLabel>
                    </InputGroup>
                  </Form.Group>
                </>
              )}
              <div className='d-grid mb-3'>
                <Button
                  type='submit'
                  disabled={!showSubmitButton}
                  style={{
                    padding: "0.5em 1em",
                  }}
                >
                  Update Profile
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
