import React, {Component} from 'react';
import {Button, ButtonToolbar, Card, Row, ToggleButton, ToggleButtonGroup, Col} from "react-bootstrap";
import {MDBInput} from "mdbreact";

import properties from "../../../websiteUtils/properties.json";

const {base_url, routes} = properties;

import '@babel/polyfill';

class NewPost extends Component {
    constructor(props) {
        super(props);
        this.onNewPost = props.onNewPost;
        this.name = props.name;
        this.creator = props.creator;
        this.profile_pic = props.profile_pic;
        this.state = {
            text: "",
            privacy: false
        }
    }

    async publishNewPost() {
        const data = this.state;
        data._creator = this.creator;
        data.name = this.name;
        data.profile_pic = this.profile_pic;
        console.log(data);
        const response = await fetch(`${base_url}${routes.new_post}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });

        if (response.status && response.status === 200) {
            this.onNewPost(() => {
                this.setState({text: ""});
            });
            this.setState({text: ""});
        } else {
            console.log("Unable to post the new post");
        }
    }

    render() {
        console.log("rendering", this.state.text);
        return (
            <Card className="post">
                <Card.Header> Write new post </Card.Header>
                <Card.Body>
                    <MDBInput value={this.state.text} getValue={(text) => this.setState({text})} id="new-post"
                              className="text-area"
                              type="textarea" rows="5"/>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col md="3">
                            <Button style={{padding: "6px"}} variant="outline-primary" size="md">Upload Images</Button>
                        </Col>
                        <Col md="5">
                            <Button style={{margin: "0 45px 0 0"}} onClick={this.publishNewPost.bind(this)}
                                    variant="outline-primary"
                                    size="md">Publish</Button>
                        </Col>
                        <Col className="extraSmallRightMargin" sm="3">
                            <ButtonToolbar>
                                <ToggleButtonGroup style={{margin: "0 0 0 2.5rem"}}
                                                   onChange={value => this.setState({privacy: value === 2})}
                                                   type="radio"
                                                   name="options"
                                                   defaultValue={1}>
                                    <ToggleButton value={1}>Public</ToggleButton>
                                    <ToggleButton value={2}>Private</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        )
    }
}

export default NewPost;