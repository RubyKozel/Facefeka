import React, {Component} from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap'

class Comment extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }

    getFormatedDate() {
        if (this.data.date) {
            const parts = this.data.date.split('T');
            if (parts[1]) {
                let time = parts[1].split('.')[0];
                const timeparts = time.split(':');
                if (timeparts[0]) {
                    timeparts[0] = parseInt(timeparts[0]) + 3;
                    time = timeparts.join(':');
                    this.data.date = `${parts[0]}   ${time}`;
                }

            }
        }
    }

    render() {
        this.getFormatedDate();
        return (
            <Card className="smallMarginTop">
                <Row>
                    <Col>
                        <Image style={{padding: '1.25rem', width: '105%'}} src={this.data.profilePic} roundedCircle/>
                    </Col>
                    <Col md="10">
                        <Card.Subtitle className="customSubTitleMargin">{this.data.userName}</Card.Subtitle>
                    </Col>
                    <Col className="commentTimeMargin">
                        {this.data.date}
                    </Col>
                </Row>
                <Row>
                    <Card.Body className="comment">{this.data.text}</Card.Body>
                </Row>
            </Card>
        );
    }
}

export default Comment;