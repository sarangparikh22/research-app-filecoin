import React, { Component } from 'react'
import { Container, Header, Card, Button, Loader, Form, TextArea } from 'semantic-ui-react'
import ipfs from '../ipfs'
import swal from 'sweetalert'
import { createPow, ffsTypes, ffsOptions } from "@textile/powergate-client";

const host = "http://0.0.0.0:6002"; // or whatever powergate instance you want

const pow = createPow({ host });

export class Upload extends Component {
    state = {ipfsURL: "", cid: "", jobId: ""}

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    generateToken = async () => {
        const { token } = await pow.ffs.create();
        this.setState({token});
        console.log(token)
        pow.setToken(token);
      };

    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
      // cache data in IPFS in preparation to store it using FFS

        await this.generateToken()

      const buffer = await Buffer.from(reader.result);

      const { cid } = await pow.ffs.addToHot(buffer);
      this.setState({cid})
        // console.log(cid)
      // store the data in FFS using the default storage configuration
      const { jobId } = await pow.ffs.pushConfig(cid, ffsOptions.withOverrideConfig(true));
      console.log("JOB ID");
      console.log(jobId)

      const { info } = await pow.ffs.info();
      console.log("INFO");
      console.log(info);

    //   set this buffer -using es6 syntax
      this.setState({buffer});
      ipfs.add(this.state.buffer)
      .then( (hash) => {
        //   console.log(hash);
          this.setState({ipfsURL: hash[0].hash})
      })     
    };

    submitPaper = async () => {

        const { account, contract } = this.props;
        let tx = await contract.methods.addPaper(
            this.state.paperAuthor,
            this.state.paperTitle,
            this.state.paperAbstract,
            this.state.ipfsURL,
            this.state.cid,
            this.state.paperGoal
        ).send({from: account})
        console.log(tx)
        
        swal({
            title: "Transaction sent!",
            text: 'Paper has been uploaded',
            icon: "success",
          });

          await this.props.updateToken(this.state.token)
    }

    render() {
        return (
            <div>
                <Container style={{ padding: "20px", margin: "50px", borderRadius: "5px", backgroundColor: "white"}}>
                    <Header as="h2" textAlign="center">Upload Paper</Header>
                    <hr />
                    <Form>
                        <Form.Field>
                            <label>Title</label>
                            <input name="paperTitle" placeholder='Enter Paper Title' onChange={this.handleChange.bind(this)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Authors</label>
                            <input name="paperAuthor" placeholder='Enter Paper Authors separated by commas' onChange={this.handleChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Abstract</label>
                            <TextArea name="paperAbstract" placeholder="Enter Paper Abstract"onChange={this.handleChange.bind(this)}></TextArea>
                        </Form.Field>
                        <Form.Field>
                            <label>Goal</label>
                            <input type="number" name="paperGoal" placeholder="Enter Goal Amount" onChange={this.handleChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Upload Paper Pdf</label>
                            <input type="file"  onChange={this.captureFile.bind(this)}/>
                        </Form.Field>
                        <Form.Field>
                            {/* <label>IPFS Hash: {this.state.ipfsURL}</label> */}
                            <label>CID: {this.state.cid}</label>
                        </Form.Field>
                        <Button onClick={this.submitPaper.bind(this)} primary fluid><i className="upload icon" />Upload</Button>
                    </Form>
                </Container>
            </div>
        )
    }
}

export default Upload
