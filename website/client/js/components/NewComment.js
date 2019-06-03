import React, {Component} from 'react';
import {Col, Container, Image, Row, Form} from "react-bootstrap";
import {MDBIcon} from 'mdbreact';

class NewComment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Image style={{width: "100%"}} src="../resources/temp.jpg" roundedCircle/>
                    </Col>
                    <Col md="9">
                        <Form.Control type="text" placeholder="Write new comment..."/>
                    </Col>
                    <Col>
                        <MDBIcon far icon="image" size="2x"/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default NewComment;