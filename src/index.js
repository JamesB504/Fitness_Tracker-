import React, {useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Routines, AccountForm, Profile, } from './components';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { callApi } from "./api";

const App = () => {
    const [token, setToken] = useState("");
    const [userData, setUserData] = useState({});

    const fetchUserData = async (token) => {
        const { data } = await callApi({
          url: "/users/me",
          token,
        });
        return data;
      };

      useEffect(async () => {
        if (!token) {
          setToken(localStorage.getItem("token"));
          return;
        }
        const data = await fetchUserData(token);
        if (data && data.username) {
          setUserData(data);
        }
      }, [token]);

      const logginOutclickButton = () => {
        setToken("");
        localStorage.removeItem("token");
        setUserData({});
      };


    return <div>


         <nav>
      <h1>Fitness Tracker</h1>
     { token ? <Link to="/posts/new">Add A Post</Link>: null }
      <Link to="/routines">Routines</Link>
      {!token?  <Link to="/login">Login</Link>: 
      <Link to="/" onClick={logginOutclickButton}>
        Log Out
      </Link> } 

      { token?<Link to="/Profile">Profiile</Link>: null }

      </nav>
<Switch>
<Route exact path="/">
          {userData.username && <div>Hello {userData.username}</div>}
        </Route>
        <Route path="/register">
          <AccountForm
            action="register"
            setToken={setToken}
            setUserData={setUserData}
          />
        </Route>
        <Route path="/login">
          <AccountForm
            action="login"
            setToken={setToken}
            setUserData={setUserData}
          />
        </Route>
        <Route path="/Profile">
          <Profile
            userData={userData}
            token={token}
            setUserData={setUserData}
            fetchUserData={fetchUserData}
          />
        </Route> 
        <Route path="/routines">
        <Routines>
       
        </Routines>
        </Route>
       

  </Switch>
    </div> 
}


ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById("app")
  );