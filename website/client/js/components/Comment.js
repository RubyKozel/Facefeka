import React, {Component} from 'react';
import {Card, Row, Col, Image} from 'react-bootstrap'

class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className="smallMarginTop">
                <Row>
                    <Col>
                        <Image style={{padding: '1.25rem', width: '105%'}} src="../resources/temp.jpg" roundedCircle/>
                    </Col>
                    <Col md="10">
                        <Card.Subtitle className="customSubTitleMargin">Some Title</Card.Subtitle>
                    </Col>
                </Row>
                <Row>
                    <Card.Body className="comment">Some comment</Card.Body>
                </Row>
            </Card>
        );
    }
}

export default Comment;