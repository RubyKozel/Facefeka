import React, {Component} from 'react';
import {Col, Container, Image, Row, Form} from "react-bootstrap";
import {MDBIcon, MDBInput} from 'mdbreact';

import properties from "../../../websiteUtils/properties.json";

const {base_url, routes} = properties;

import '@babel/polyfill';

class NewComment extends Component {
    constructor(props) {
        super(props);
        this.profilePic = props.profilePic;
        this.onNewComment = props.onNewComment;
        this.id = props.id;
        this.state = {text: ""};
    }

    async postNewComment(e) {
        if (e.key === 'Enter') {
            const data = this.state;

            const response = await fetch(`${base_url}${routes.comment_post_by_id}`.replace(':id', this.id), {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    'x-auth': localStorage.getItem('x-auth')
                }
            });

            if (response.status && response.status === 200) {
                this.onNewComment();
            } else {
                console.log("Unable to post the new post");
            }
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Image style={{width: "100%"}} src={this.profilePic} roundedCircle/>
                    </Col>
                    <Col md="9">
                        <MDBInput onKeyPress={this.postNewComment.bind(this)}
                                  getValue={(text) => this.setState({text})} type="text"
                                  placeholder="Write new comment..."/>
                    </Col>
                    <Col>
                        <MDBIcon className="uploadImageIconComment" far icon="image" size="3x"/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default NewComment;