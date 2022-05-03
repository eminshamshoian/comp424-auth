import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ConfirmPage from "./pages/ConfirmPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";
import ErrorPage from "./pages/ErrorPage";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// for showing the 'new update available' banner and to register the service worker
import ServiceWorkerWrapper from "./ServiceWorkerWrapper";

const App = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey='6LdeibwfAAAAAKzYkKfvncVQsNR4B9bv_VzF7oiQ'>
      <Router>
        <Header />
        <ServiceWorkerWrapper />

        <main className='py-2'>
          <Container>
            <Switch>
              <Route path='/' component={HomePage} exact />
              <Route path='/search/:keyword' component={HomePage} exact />
              <Route path='/page/:pageNumber' component={HomePage} exact />
              <Route
                path='/search/:keyword/page/:pageNumber'
                exact
                component={HomePage}
              />
              <Route path='/login' component={LoginPage} />
              <Route path='/register' component={RegisterPage} />
              <Route
                path='/user/password/reset/:token'
                component={PasswordResetPage}
              />
              <Route path='/profile' component={ProfilePage} />
              <Route
                path='/user/confirm/:token'
                component={ConfirmPage}
                exact
              />
              <Route path='/admin/userlist' component={UserListPage} exact />
              <Route
                path='/admin/userlist/:pageNumber'
                component={UserListPage}
                exact
              />
              <Route path='/admin/user/:id/edit' component={UserEditPage} />
              <Route component={ErrorPage} />
            </Switch>
          </Container>
        </main>
      </Router>
    </GoogleReCaptchaProvider>
  );
};

export default App;
