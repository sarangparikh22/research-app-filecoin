import React, { Component } from 'react'
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import swal from 'sweetalert';

import 'bootstrap/dist/css/bootstrap.min.css';


export class NavComp extends Component {
    withdraw = async () => {
        const { accounts, contract } = this.props;

        let tx = await contract.methods.withdraw().send({from: accounts})
        console.log(tx);
        swal({
            title: "Funds withdrawn!",
            icon: "success",
          });
    }
    render() {
        return (
            <div>
            <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    {/* <img alt="logo" style={{marginLeft: "100px", marginRight: "30px"}}src="https://positiveblockchain.io/wp-content/uploads/2019/07/maker-lrg-510x510-1.png" height="50" width="50" /> */}
                    <span>Research Paper Portal</span>
                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/upload">Upload</Nav.Link>
                    <Nav.Link>{this.props.accounts ? <>{this.props.accounts.toString().slice(0,12) + "..."} <span>
                        <Badge pill variant="light">
                            <><i className="dollar icon" />{this.props.userBalance} </>
                        </Badge>{' '}</span><Button onClick={this.withdraw.bind(this)} variant="success" size="sm">Withdraw</Button>
</> : <Button variant="outline-success">Connect to Wallet</Button>}</Nav.Link>
                </Nav>
            </Navbar>
            </div>
        )
    }
}

export default NavComp