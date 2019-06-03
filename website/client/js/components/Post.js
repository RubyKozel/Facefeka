import React, {Component} from 'react';
import {Card, Col, Image, Row, NavDropdown} from "react-bootstrap";
import CommentList from './CommentList'
import {MDBIcon} from 'mdbreact'

class Post extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className="post" style={{width: '40rem'}}>
                <Card.Body>
                    <Row>
                        <Col>
                            <Image style={{width: '70%'}} src="../resources/temp.jpg" roundedCircle/>
                        </Col>
                        <Col md="10">
                            <Card.Title>Some Title</Card.Title>
                            Some time stamp
                        </Col>
                    </Row>
                    <br/>
                    <Card.Text>Some sample textSome sample textSome sample textSome sample textSome sample textSome
                        sample textSome sample textSome sample textSome sample textSome sample textSome sample textSome
                        sample textSome sample textSome sample textSome sample textSome sample textSome sample textSome
                        sample textSome sample textSome sample textSome sample textSome sample textSome sample textSome
                        sample textSome sample textSome sample textSome sample textSome sample textSome sample textSome
                        sample textSome sample textSome sample textSome sample textSome sample textSome sample textSome
                        sample textSome sample textSome sample textSome sample textSome sample text</Card.Text>
                    <Image src="../resources/temp.jpg"/>
                </Card.Body>
                <NavDropdown.Divider/>
                <Card.Body className="customBody">
                    <Row>
                        <Col>
                            <p><MDBIcon far icon="thumbs-up" size="1x" className="indigo-text pr-3"/>Like</p>
                        </Col>
                        <Col>
                            <p><MDBIcon far icon="comment" size="1x" className="indigo-text pr-3"/>Comment</p>
                        </Col>
                    </Row>
                </Card.Body>
                <NavDropdown.Divider/>
                <Card.Body>
                    <CommentList/>
                </Card.Body>
            </Card>
        )
    }
}

export default Post;