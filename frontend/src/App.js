
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import React from "react";
import AuthService from "./services/auth.service";
import Login from "../src/Components/login.component";
import Register from "../src/Components/register.component";
import RegisterM from "../src/Components/register.man.component";
import Home from "../src/Components/home.component";
import Main from "../src/Components/main.component";
import Profile from "../src/Components/profile.component";
import FillDetails from './Components/fill-details';
import ProjectDetailTable from './Table/managerTable';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { IoIosListBox, IoIosCreate} from "react-icons/io";
import { MdCreateNewFolder,MdFeedback } from "react-icons/md";
import {HiOutlineLogout,HiUserAdd} from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { IconContext } from 'react-icons';
import './react-sidenav.css'
import DetailTable from './Table/detailTable';
import addActDetails from './Components/addActDetails';
import addProject from './Components/addProject';
import feedbackForm from './Components/feedback';
const createError = require('http-errors');

class App extends React.Component{

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      Admin: false,
      User: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        Admin: user.roles.includes("ADMIN"),
        User: user.roles.includes("USER"),
        Manager: user.roles.includes("MANAGER")
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render(){
    const { currentUser, Admin, User, Manager } = this.state;
    var arr = [{"eventKey" : "logs", "text":"Logs"},{"eventKey" : "logs/add", "text":"Add"},{"eventKey" : "logs/display", "text":"Display"}]
  return (
    <div className="navbar-items">
        <Navbar className="navbar" property='position: fixed; top:0'>
        <Navbar.Brand className="navbar-brand"><Link to={"/main"} ><div className="navbar-title"> CorpSpace  </div></Link></Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <IconContext.Provider value={{ color: 'white', size: '30px' }}>
              <Link to={"/home"} ><div className="navbar-title">Info  </div></Link>
              <li className="nav-item" >
                <Link to={"/profile"} className="nav-link" >
                  <CgProfile />
                </Link>
              </li>
              
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  <HiOutlineLogout />
                </a>
              </li>
              </IconContext.Provider>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

            </div>
          )}
          
        </Navbar.Collapse>
        </Navbar>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/main"]} component={Main} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register/user" component={Register} />
            <Route exact path="/register/manager" component={RegisterM} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/logs/add" component={FillDetails} />
            <Route path="/logs/display" component={DetailTable} />
            <Route path="/logs/project/display" component={ProjectDetailTable} />
            <Route path="/activity" component={addActDetails} />
            <Route path="/project" component={addProject} />
            <Route path="/feedback" component={feedbackForm}/>
            <Route path="/home" component={Home}/>
            
          </Switch>
        </div>

        
        <div className="App">
    {currentUser && (
      <Switch>
    <Route render={({ location, history }) => (
        <React.Fragment>
      <SideNav class="SideNav"
    onSelect={(selected) => {
      const to = '/' + selected;
      if (location.pathname !== to) {
          history.push(to);
      }
    }}
>
    <SideNav.Toggle />
    {Admin && (
    <SideNav.Nav defaultSelected="main">
        
        <NavItem eventKey="logs">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '18px' }}>
              <IoIosListBox class title = "logs"/>
              </IconContext.Provider>
            </NavIcon>
            <NavText>
                Logs
            </NavText>
            <NavItem eventKey="logs/add">
                <NavText>
                    Add
                </NavText>
            </NavItem>
            <NavItem eventKey="logs/display">
                <NavText>
                    Display
                </NavText>
            </NavItem>
        </NavItem>

        <NavItem eventKey="activity">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
              <IoIosCreate class title = "Add Activity"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Add Activity
            </NavText>
        </NavItem>

        <NavItem eventKey="project">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
              <MdCreateNewFolder class title = "Add Project"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Add Project
            </NavText>
        </NavItem>

        <NavItem eventKey="register">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '18px' }}>
              <HiUserAdd class title = "register"/>
              </IconContext.Provider>
            </NavIcon>
            <NavText>
                Register
            </NavText>
            <NavItem eventKey="register/user">
                <NavText>
                    Register new user
                </NavText>
            </NavItem>
            <NavItem eventKey="register/manager">
                <NavText>
                    Register new manager
                </NavText>
            </NavItem>
        </NavItem>

        <NavItem eventKey="feedback">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
              <MdFeedback class title = "Feedback"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Feedback
            </NavText>
        </NavItem>
    </SideNav.Nav>
    )}


{User && (
    <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="logs">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '18px' }}>
              <IoIosListBox class title = "logs"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Logs
            </NavText>
            <NavItem eventKey="logs/add">
                <NavText>
                    Add
                </NavText>
            </NavItem>
            <NavItem eventKey="logs/display">
                <NavText>
                    Display
                </NavText>
            </NavItem>
        </NavItem>
        <NavItem eventKey="feedback">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
              <MdFeedback class title = "Feedback"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Feedback
            </NavText>
        </NavItem>
    </SideNav.Nav>
    )}

{Manager && (
    <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="logs">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '18px' }}>
              <IoIosListBox class title = "logs"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Logs
            </NavText>
            <NavItem eventKey="logs/add">
                <NavText>
                    Add
                </NavText>
            </NavItem>
            <NavItem eventKey="logs/project/display">
                <NavText>
                    Display
                </NavText>
            </NavItem>
        </NavItem>
        <NavItem eventKey="feedback">
            <NavIcon>
            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
              <MdFeedback class title = "Feedback"/>
            </IconContext.Provider>
            </NavIcon>
            <NavText>
                Feedback
            </NavText>
        </NavItem>
    </SideNav.Nav>
    )}
</SideNav>
</React.Fragment>
    )}
    />
    </Switch>
    )}
    </div>
      
      </div>

  );
}
}

export default App;
