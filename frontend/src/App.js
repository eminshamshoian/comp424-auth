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

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-2'>
        <Container>
          <Switch>
            <Route path='/' component={HomePage} exact />
            <Route path='/login' component={LoginPage} />
            <Route path='/register' component={RegisterPage} />
            <Route
              path='/user/password/reset/:token'
              component={PasswordResetPage}
            />
            <Route path='/profile' component={ProfilePage} />
            <Route path='/user/confirm/:token' component={ConfirmPage} exact />
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
  );
};

export default App;
