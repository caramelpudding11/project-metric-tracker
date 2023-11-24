import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";
import { Row } from "react-bootstrap";

import variables from '../env';
var URL=variables.getURL();

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};
const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};
const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};
const vproject = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Choose a project ID.
      </div>
    );
  }
};


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.getProjCode = this.getProjCode.bind(this);
    this.getProjName = this.getProjName.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.state = {
      username: "",
      email: "",
      password: "",
      project: "",
      projectCode: "",
      projectName: "",
      roles: ["manager"],
      successful: false,
      message: "",
      passwordType: "password",
      projectData: []
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  togglePassword (e){
    //e.preventDefault();
    if(e.target.className==="fas fa-eye-slash")
    {
     this.setState({
      passwordType:"text"
     });
     e.target.className="fas fa-eye";
    }
    else if(e.target.className==="fas fa-eye")
    {
    this.setState({
      passwordType:"password"
    });
    e.target.className="fas fa-eye-slash";
    }
  }

  getProjCode(e) {
    var descObjList = this.state.projectData.filter(item => item.p_code === e.target.value);
    var projectDetail = '';
    var projectID = '';
    if (descObjList != null) {
      for (const record of descObjList) {
        projectID = record._id;
        projectDetail = record.p_name;
      }
    }
    this.setState({ projectCode: e.target.value, projectName: projectDetail, project: projectID })
  }
  getProjName(e) {
    this.setState({ projectName: e.target.value })
  }

  componentDidMount() {
    fetch(URL+'/project')
      .then((response) => response.json())
      .then(ProjectDetList => {
        this.setState({ projectData: ProjectDetList });
      });
  }

  handleRegister(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.project,
        this.state.roles
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }
  render() {
    const projectObj = [];
    for (const record of this.state.projectData) {
      projectObj.push({ key: record.p_name, value: record.p_code });
    }
    return (
      <div className="col-md-12">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous" />
        
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div align="center">
                <div className="form-group" >
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-group my-2 mx-2">
                  <Input
                  type={this.state.passwordType}
                  onChange={this.onChangePassword}
                  value={this.state.password}
                    className="form-control"
                    name="password"
                    validations={[required, vpassword]}
                  />
                  <div className="input-group-btn">
                   <div onClick={this.togglePassword}>
                   { this.state.passwordType==="password"? <i className="fas fa-eye-slash" ></i> :<i className="fas fa-eye"></i> }
                   </div>
                  </div>
              </div>
                </div>

                
                <div className="form-group">
                <Row>
                  <label htmlFor="project">Project ID</label>
                  <select defaultValue="Choose..." onChange={this.getProjCode} name="project" >
                  <option>Choose...</option>
                  {projectObj.map((item) => <option key={item.p_name} value={item.code}>{item.value}</option>)}
                  </select>
                  </Row>
                </div>

                <div className="form-group">
                  <label htmlFor="project">Project Name</label>
                  <Input placeholder="Project Name" value={this.state.projectName} onChange={this.getProjName} name="projectName" className="form-control" validations={[vproject]} disabled>
                  </Input>
                </div>

                   
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Register</button>
                </div>
              </div>
            )}
            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}