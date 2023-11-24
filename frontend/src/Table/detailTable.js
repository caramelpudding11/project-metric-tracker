import React, { Component } from 'react';
import { Form, Col, Row, Button } from "react-bootstrap";
import moment from 'moment';
import axios from 'axios';
import BasicTable from './basicTable';
import './table.css'
import { COLUMNS } from '../Table/columns';
import AuthService from "../services/auth.service";

import variables from '../env';
var URL=variables.getURL();
let global_list = [];

function toCsv(detailsList) {
    const fields = Object.keys(detailsList[0]);
    const header = fields.join(',');
    const csvRows = detailsList.map(detail => Object.values(detail).join(','));
    const csvString = [header, ...csvRows].join('\n');
    const encoded = encodeURI('data:text/csv;charset=utf-8,' + csvString);
    return encoded;
}
export class DetailTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            maxDate: moment(new Date()).format("YYYY-MM-DD"),
            date: '',
            detailList: [],
            listLength: false,
            initialListLen: true,
            showTable: false,
            approved: false,
            activityData: [],
            projectData: [],
        }

        this.getDate = this.getDate.bind(this);
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
    getDate(e) {
        this.setState({ date: e.target.value }, () => {
            this.getActivityDetails(this.state.date)
        })

    }

    toggleApprove()
    {
        this.setState({approved: true})
        console.log("approved,,",this.state.approved)
    }

    getActivityDetails(date) {
        axios.post(URL+'/details/detailList', { date: date, userName:AuthService.getCurrentUser().username, roles: AuthService.getCurrentUser().roles, project: AuthService.getCurrentUser().project}).then(response => {
            if (!['', undefined, null].includes(response.data)) {
                let detailListObj = [];
                var a_code; var a_det; var p_code; var p_det;
                if (response.data.response.length !== 0) {
                    for (let i = 0; i < response.data.response.length; i++) {
                        for(let j = 0; j < this.state.activityData.length; j++)
                        {
                            if(response.data.response[i].activity==this.state.activityData[j]._id)
                            {
                                a_code = this.state.activityData[j].code;
                                a_det = this.state.activityData[j].detail;
                            }
                        }

                        for(let j = 0; j < this.state.projectData.length; j++)
                        {
                            if(response.data.response[i].project==this.state.projectData[j]._id)
                            {
                                p_code = this.state.projectData[j].p_code;
                                p_det = this.state.projectData[j].p_name;
                            }
                        }
                        const detailsObj = {
                            userName: response.data.response[i].userName,
                            activityCode: a_code,
                            activityDet: a_det,
                            description: response.data.response[i].description,
                            projectCode: p_code,
                            projectName: p_det,
                            duration: response.data.response[i].duration,
                            date: response.data.response[i].date,
                            approved: false
                          };
                        detailListObj.push(detailsObj);
                        global_list.push(detailsObj);
                    }
                    this.setState({
                        detailList: detailListObj,
                        showTable: true,
                        listLength: false
                    });

                } else {
                    this.setState({
                        detailList: '',
                        listLength: true,
                        showTable: false
                    });
                }

            }

        });
    }

    render() {

        const columns = COLUMNS;
        return (

            <div className="detailListTable">
                <Row>
                    <Form>
                        <Form.Group as={Col} controlId="formDate">
                            <Form.Label>Choose Date : </Form.Label>
                            <Form.Control className="dateClass" type="date" onChange={this.getDate} value={this.state.date} max={this.state.maxDate} required />
                        
                        </Form.Group>
                    </Form>
                </Row>
                <div className="detailListTable">
                    <div> {this.state.listLength && this.state.initialListLen ? " No Data !!" : null} </div>
                    <div>
                        {this.state.showTable ? <BasicTable data={this.state.detailList} columns={columns} /> : null}
                        <Button type="submit" onClick={() => window.open(toCsv(global_list))}>
                            Download
                        </Button>
                    </div>
                    
                </div>
                <Row>
                    
                </Row>
            </div>
        )
    }
}

export default DetailTable
