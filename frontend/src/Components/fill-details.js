import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import { Container } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from 'moment';
import '../Table/table.css';
import './addActivity.css'
import AuthService from "../services/auth.service";
import BasicTable from '../Table/basicTable';
import { COLUMNS } from '../Table/columns';


import variables from '../env';
var URL=variables.getURL();

class FillDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: '',
      activity: '',
      activityCode: '',
      activityDet: '',
      description: '',
      project: '',
      projectCode: '',
      projectName: '',
      duration: '',
      approved: false,
      success: false,
      date: moment(new Date()).format("YYYY-MM-DD"),
      enteredData: [],
      activityData: [],
      projectData: [],
      errors: {}
    };
    this.getUser = this.getUser.bind(this);
    this.getActCode = this.getActCode.bind(this);
    this.getActDet = this.getActDet.bind(this);
    this.getDesc = this.getDesc.bind(this);
    this.getDurat = this.getDurat.bind(this);
    this.getProjCode = this.getProjCode.bind(this);
    this.getProjName = this.getProjName.bind(this);
    this.getDate = this.getDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    fetch(URL+'/project')
      .then((response) => response.json())
      .then(ProjectDetList => {
        this.setState({ projectData: ProjectDetList });
      });
    fetch(URL+'/activity')
      .then((response) => response.json())
      .then(ActivityDetList => {
        this.setState({ activityData: ActivityDetList });
      });
      
  }

  getUser(e) {
    const user = AuthService.getCurrentUser();
    this.setState({userName: user.username})
  }
  getActCode(e) {
    var descObjList = this.state.activityData.filter(item => item.code === e.target.value);
    var activityDetail = '';
    var activityID = '';
    if (descObjList != null) {
      for (const record of descObjList) {
        activityID = record._id;
        activityDetail = record.detail;
      }
    }
    this.setState({ activityCode: e.target.value, activityDet: activityDetail, activity: activityID })
  }
  getActDet(e) {
    this.setState({ activityDet: e.target.value })
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
  getDesc(e) {
    this.setState({ description: e.target.value })
  }
  getDurat(e) {
    this.setState({ duration: e.target.value })
  }
  getDate(e) {
    this.setState({ date: e.target.value })
  }

  // Function for handling validation
  handleValidation(detailsObj) {
    let errors = {};
    let formIsValid = true;
    if (['', undefined, null, 'Choose...'].includes(detailsObj.activity)) {
      formIsValid = false;
      errors["formActCode"] = "Activity Code is a required field!!";
    }
    if (['', undefined, null, 'Choose...'].includes(detailsObj.project)) {
      formIsValid = false;
      errors["formProjCode"] = "Project Code is a required field!!";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  onSubmit(e) {
    e.preventDefault()
    const user = AuthService.getCurrentUser();
    const detailsObj = {
      userName: user.username,
      activity: this.state.activity,
      activityCode: this.state.activityCode,
      activityDet: this.state.activityDet,
      description: this.state.description,
      project: this.state.project,
      projectCode: this.state.projectCode,
      projectName: this.state.projectName,
      duration: this.state.duration,
      date: this.state.date,
      approved: false,
    };
    
    const isValid = this.handleValidation(detailsObj);
    if (isValid) {
      axios.post(URL+'/details/addDetails', detailsObj)
      console.log(`TimeSheet-Details successfully created!`);
      alert("TimeSheet-Details successfully created!");
      this.state.enteredData.push(detailsObj);
      this.setState({success: true});
      console.log(this.state.enteredData);
      this.setState({ userName: '', activityCode: '', activityDet: '', description: '', project: '', duration: '', date: '', projectCode: '',projectName: '', activity: '' })
    } else {
      alert("Form has errors.");
    }
  }


  render() {
    const activityObj = [];
    const columns = COLUMNS;
    for (const record of this.state.activityData) {
      activityObj.push({ key: record.detail, value: record.code });
    }
    const projectObj = [];
    for (const record of this.state.projectData) {
      projectObj.push({ key: record.p_name, value: record.p_code });
    }

    return (
      <div className='table-container'>
      <Container className="cont-form">
        <Form onSubmit={this.onSubmit}>
          <Row className="mb-2">
            <Form.Group as={Col} controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" onChange={this.getDate} value={this.state.date} max={this.state.date} required />
            </Form.Group>

            <Form.Group as={Col} controlId="formDurat">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="number" placeholder="Duration in minutes" value={this.state.duration} onChange={this.getDurat} min="0" step="15" required />
            </Form.Group>
          </Row>
          <Row className="mb-2">
          <Form.Group as={Col} controlId="formProjCode">
              <Form.Label>Project Code</Form.Label>
              <Form.Select defaultValue="Choose..." onChange={this.getProjCode}>
                <option>Choose...</option>
                {projectObj.map((item) => <option key={item.p_name} value={item.code}>{item.value}</option>)}
              </Form.Select >
              <span style={{ color: "red" }}>{this.state.errors["formProjCode"]}</span>
            </Form.Group>

            <Form.Group as={Col} controlId="formProjName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control placeholder="Project Name" value={this.state.projectName} onChange={this.getProjName} disabled />
            </Form.Group>

          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formActCode">
              <Form.Label>Activity Code</Form.Label>
              <Form.Select defaultValue="Choose..." onChange={this.getActCode}>
                <option>Choose...</option>
                {activityObj.map((item) => <option key={item.detail} value={item.code}>{item.value}</option>)}
              </Form.Select >
              <span style={{ color: "red" }}>{this.state.errors["formActCode"]}</span>
            </Form.Group>

            <Form.Group as={Col} controlId="formActDet">
              <Form.Label>Activity Detail</Form.Label>
              <Form.Control placeholder="Activity Detail" value={this.state.activityDet} onChange={this.getActDet} disabled />
            </Form.Group>

            <Form.Group as={Col} controlId="formDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control placeholder="Description" value={this.state.description} onChange={this.getDesc} required />
            </Form.Group>
          </Row>

          <Button className="subBtn" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Container>
        <Row>
        <div className="detailListTable">
                <div>
                    {this.state.success ? <BasicTable data={this.state.enteredData} columns={columns} /> : null}
                </div>
            </div>
            </Row>
        <Row>
          <div className="detailListTableText">
            {this.state.success? <h4>was added successfully!</h4>: null}
          </div>
        </Row>
      </div>
      
    )
  }
}

export default FillDetails
