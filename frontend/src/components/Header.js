import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { logoutUser } from "../actions/userActions";
import "../styles/header.css";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [show1, setShow1] = useState(false); // to close dropdown when clicking anywhere outside
  const [show2, setShow2] = useState(false); // to close dropdown when clicking anywhere outside

  // close the second dropdown when it is open and user clicks anywhere else
  const handleDropdown2 = (e) => {
    if (show2) {
      setShow2(false);
    } else {
      setShow2(true);
      setShow1(false);
    }
  };

  // close the first dropdown when it is open and user clicks anywhere else
  const handleDropdown1 = (e) => {
    if (show1) {
      setShow1(false);
    } else {
      setShow1(true);
      setShow2(false);
    }
  };

  // dispatch action to logout user
  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = "/";
  };

  // render different navbars for large and small screens without navbar toggle
  return (
    <header>
      {/* this section covers entire screen except the dropdown, to handle onclicks */}
      <section
        className='navbar-dropdown-cover'
        style={{
          display:
            window.innerHeight > 430 && (show1 || show2) ? "block" : "none",
          minWidth: "100%",
          height: "100%",
          zIndex: "100",
          position: "absolute",
        }}
        onClick={() => {
          setShow1(false);
          setShow2(false);
        }}
      />

      {/* conditionally render different navbars for the mobile sreens */}
      <Navbar bg='secondary' variant='dark' expand='lg'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>COMP 424 Project</Navbar.Brand>
          </LinkContainer>
          <Nav
            className='ms-auto nav-mobile'
            style={
              userInfo
                ? {
                    justifyContent: "space-between",
                  }
                : {
                    justifyContent: "space-evenly",
                  }
            }
          >
            {userInfo && userInfo.isAdmin && (
              <>
                {/* display this only on mobile screens */}
                <LinkContainer
                  className='d-block d-md-none'
                  to='/admin/userlist'
                >
                  <Nav.Link>
                    <i className='fas fa-users' />
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer
                  className='d-block d-md-none'
                  to='/admin/orderlist'
                >
                  <Nav.Link>
                    <i className='fas fa-user-shield' />
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer
                  className='d-block d-md-none'
                  to='/admin/productlist'
                >
                  <Nav.Link>
                    <i className='fas fa-shopping-bag' />
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
            {userInfo && userInfo.isAdmin && (
              // show this only on md screens and above
              <NavDropdown
                className='d-none d-md-block'
                title='Admin'
                id='adminMenu'
                show={show2}
                onClick={handleDropdown2}
              >
                <LinkContainer to='/admin/userlist'>
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}

            {userInfo && (
              // show this only on mobile screens
              <Nav.Link className='d-block d-md-none' onClick={handleLogout}>
                <i className='fas fa-sign-out-alt navbar-icons' />{" "}
                {!(userInfo && userInfo.isAdmin) && "Logout"}
              </Nav.Link>
            )}

            {userInfo ? (
              <div className='nav-avatar-container'>
                {/* show this container only on mobile screens */}
                <LinkContainer to='/profile' className='d-block d-md-none'>
                  <Nav.Link>
                    <img
                      src={userInfo.avatar}
                      className='nav-avatar'
                      alt={userInfo.name}
                    />
                  </Nav.Link>
                </LinkContainer>
                <img
                  src={userInfo.avatar}
                  className='nav-avatar d-none d-md-block'
                  alt={userInfo.name}
                />

                {/* show this dropdown only on large screens */}
                <NavDropdown
                  className='d-none d-md-block'
                  title={userInfo.name}
                  id={userInfo.id}
                  show={show1}
                  onClick={handleDropdown1}
                >
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <LinkContainer to='/login' variant='primary'>
                <Nav.Link>
                  <i className='fas fa-user navbar-icons mx-1' /> Login
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
