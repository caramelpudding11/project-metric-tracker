import React, { Component } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import { Container } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './addActivity.css'

import variables from '../env';
var URL=variables.getURL();

class addProject extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        p_code: '',
        p_name: '',
        projectData: [],
        errors: {}
      };
  
      this.getProjCode = this.getProjCode.bind(this);
      this.getProjName = this.getProjName.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    getProjCode(e) {
        var descObjList = this.state.projectData.filter(item => item.p_code === e.target.value);
        var detailail = '';
        if (descObjList != null) {
          for (const record of descObjList) {
            detailail = record.detail;
          }
        }
        this.setState({ p_code: e.target.value, p_name: detailail })
      }
      getProjName(e) {
        this.setState({ p_name: e.target.value })
      }
    
      // Function for handling validation
      handleValidation(detailsObj) {
        let errors = {};
        let formIsValid = true;
        if (['', undefined, null, 'Choose...'].includes(detailsObj.p_code)) {
          formIsValid = false;
          errors["formProjCode"] = "Project Code is a required field!!";
        }
        if (['', undefined, null, 'Choose...'].includes(detailsObj.p_name)) {
          formIsValid = false;
          errors["formProjName"] = "Project Name is a required field!";
        }
        this.setState({ errors: errors });
        return formIsValid;
      }
    
      onSubmit(e) {
        e.preventDefault()
    
        const detailsObj = {
          p_code: this.state.p_code,
          p_name: this.state.p_name,
        };
    
        const isValid = this.handleValidation(detailsObj);
        if (isValid) {
          axios.post(URL+'/project/addProject', detailsObj)
            .then(res => console.log(res.data));
          alert("Form submitted");
          console.log(`TimeSheet-Details successfully created!`);
    
          this.setState({ p_code: '', p_name: ''})
        } else {
          alert("Form has errors.");
        }
      }
    
      render() {
        const projectObj = [];
        for (const record of this.state.projectData) {
          projectObj.push({ key: record.p_name, value: record.p_code });
        }
    
        return (
    
          <Container className="cont-form">
            <Form onSubmit={this.onSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formProjCode">
                  <Form.Label>Project Code</Form.Label>
                  <Form.Control placeholder='Project Code' value={this.state.code} onChange={this.getProjCode}>
                  </Form.Control >
                  <span style={{ color: "red" }}>{this.state.errors["formProjCode"]}</span>
                </Form.Group>
    
                <Form.Group as={Col} controlId="formProjDet">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control placeholder="Project Name" value={this.state.p_name} onChange={this.getProjName} />
                  <span style={{ color: "red" }}>{this.state.errors["formProjName"]}</span>
                </Form.Group>
              </Row>
    
              <Button className="subBtn" variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
        )
      }
    }
    
    export default addProject
    