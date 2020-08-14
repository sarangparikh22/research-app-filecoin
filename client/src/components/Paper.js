import React, { Component } from 'react'
import { Container, Header, Card, Button, Loader, Form } from 'semantic-ui-react'
import { Modal, Badge, Nav } from 'react-bootstrap'

export class Paper extends Component {
    state = {show: false}
    handleShow = (e) => {
        let a = e.target.name
        this.setState({active:a, show: true})
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleClose = () => {
        this.setState({show: false})
    }
    fund = async () => {
        const { account, contract } = this.props;
        let tx = await contract.methods.fundPaper(this.props.p.id).send({from: account, value: this.state.fundAmount})
        console.log(tx);
    }
    render() {
        return (
            <div style={{ marginTop: '25px'}}>
                <Card fluid 
                    color="green" 
                    header={this.props.p.paperTitle} 
                    meta={<span style={{color: "#546978"}}><i className="user outline icon" />{this.props.p.authors}<br />{parseInt(this.props.p.totalContribution) > parseInt(this.props.p.goal) ? <> <Badge pill variant="success">
                    {"Goal Reached"} 
                </Badge>{' '} </>: ""}<hr /></span>}
                    description = {
                    <div>
                        <b>Abstract</b><br />
                        <span>{this.props.p.paperAbstract}</span>
                        <div style={{marginTop: "30px", color: "#546978"}}>
                            Goal: <span> {this.props.p.goal} Wei</span><br />
                            Total Contributed: <span> {this.props.p.totalContribution} Wei</span>
                            <Button name="5" onClick={this.handleShow.bind(this)} style={{backgroundColor: "#1AAB9B", color: "white"}} floated="right"><i className="money bill alternate icon" />Fund Research</Button>
                            {/* <Button primary onClick={this.handleShow.bind(this)} floated="right"><i className="download icon" />Download</Button> */}
                            <a href={"https://gateway.ipfs.io/ipfs/"+ this.props.p.paperURL} target="_blank" rel="noopener noreferrer" download>
                                <Button primary floated="right"><i className="download icon" />Download</Button>
                            </a>
                        </div>
                    </div>}
                    />
                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Title style={{margin: "10px"}}>Select Option to Vote <hr /></Modal.Title>
                    <Modal.Body style={{marginTop: "-25px"}}>
                        <Form>
                        <Form.Field>
                            <label>Amount To Fund</label>
                            <input type="number" name="fundAmount" placeholder="Enter Amount" onChange={this.handleChange.bind(this)}/>
                        </Form.Field>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={this.handleClose.bind(this)}>
                        Close
                    </Button>
                    <Button color="green" onClick={this.fund.bind(this)}>
                        Fund
                    </Button>
                    </Modal.Footer>
            </Modal>
            </div>
        )
    }
}

export default Paper
