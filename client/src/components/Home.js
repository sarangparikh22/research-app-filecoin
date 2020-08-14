import React, { Component } from 'react'
import { Container, Header, Card, Button, Loader, Form, Label } from 'semantic-ui-react'

import Paper from './Paper'

export class Home extends Component {
    render() {
        return (
            <div>
                <Container style={{ padding: "20px", margin: "50px", borderRadius: "5px", backgroundColor: "white"}}>
                    {this.props.paperArray.length == 0 ? <Label style={{ margin: "15px", padding: "10px"}}>No papers published yet</Label> : ""}
                    <Card.Group>
                        {this.props.paperArray.map( (p) => {
                            return <Paper 
                                    key={p.id}
                                    p={p}
                                    account = {this.props.account}
                                    contract = {this.props.contract}
                                />
                        })}
                    </Card.Group>
                </Container>
            </div>
        )
    }
}

export default Home
