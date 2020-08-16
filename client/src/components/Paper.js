import React, { Component } from "react";
import {
  Container,
  Header,
  Card,
  Button,
  Loader,
  Form,
} from "semantic-ui-react";
import { Modal, Badge, Nav } from "react-bootstrap";
import swal from "sweetalert";
import { createPow, ffsTypes } from "@textile/powergate-client";

const host = "http://0.0.0.0:6002"; // or whatever powergate instance you want

const pow = createPow({ host });

export class Paper extends Component {
  state = { show: false };

  componentDidMount() {
    // this.getDataFromFFS()
  }

  handleShow = (e) => {
    let a = e.target.name;
    this.setState({ active: a, show: true });
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  fund = async () => {
    const { account, contract } = this.props;
    let tx = await contract.methods
      .fundPaper(this.props.p.id)
      .send({ from: account, value: this.state.fundAmount });
    console.log(tx);
    swal({
      title: "Tip sent!",
      text: "Thank You for supporting the author!",
      icon: "success",
    });
  };

  generateToken = async () => {
    const { token } = this.props;
    this.setState({ token });
    // console.log(token);
    pow.setToken(token);
  };

  getDataFromFFS = async () => {
    console.log(this.props.p.cid);
    // retreive data from FFS by cid

    await this.generateToken();
    console.log("Raw data retrieved from Filecoin")
    const bytes = await pow.ffs.get(this.props.p.cid);

    console.log(bytes);

    await this.saveByteArray(bytes);

    // const pdf = await pdfjs.getDocument(bytes)
    // console.log(pdf)
    
  };

  saveByteArray = async (byte) => {
    console.log(byte);

    var blob = await new Blob([byte], {
      type: "octet/stream",
    });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = this.props.p.paperTitle + 'Paper' + '.pdf';
    link.download = fileName;
    link.click();
  };

  render() {
    return (
      <div style={{ marginTop: "25px" }}>
        <Card
          fluid
          color="green"
          header={this.props.p.paperTitle}
          meta={
            <span style={{ color: "#546978" }}>
              <i className="user outline icon" />
              {this.props.p.authors}
              <br />
              {parseInt(this.props.p.totalContribution) >
              parseInt(this.props.p.goal) ? (
                <>
                  {" "}
                  <Badge pill variant="success">
                    {"Goal Reached"}
                  </Badge>{" "}
                </>
              ) : (
                ""
              )}
              <hr />
            </span>
          }
          description={
            <div>
              <b>Abstract</b>
              <br />
              <span>{this.props.p.paperAbstract}</span>
              <div style={{ marginTop: "30px", color: "#546978" }}>
                Goal: <span> {this.props.p.goal} Wei</span>
                <br />
                Total Contributed:{" "}
                <span> {this.props.p.totalContribution} Wei</span>
                <Button
                  name="5"
                  onClick={this.handleShow.bind(this)}
                  style={{ backgroundColor: "#1AAB9B", color: "white" }}
                  floated="right"
                >
                  <i className="money bill alternate icon" />
                  Fund Research
                </Button>
                <Button
                  primary
                  floated="right"
                  onClick={this.getDataFromFFS.bind(this)}
                >
                  <i className="download icon" />
                  Download
                </Button>
                
              </div>
            </div>
          }
        />
        <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
          <Modal.Title style={{ margin: "10px" }}>
            Enter Amount to Tip <hr />
          </Modal.Title>
          <Modal.Body style={{ marginTop: "-25px" }}>
            <Form>
              <Form.Field>
                <label>Amount To Fund</label>
                <input
                  type="number"
                  name="fundAmount"
                  placeholder="Enter Amount"
                  onChange={this.handleChange.bind(this)}
                />
              </Form.Field>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose.bind(this)}>Close</Button>
            <Button color="green" onClick={this.fund.bind(this)}>
              Fund
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Paper;
