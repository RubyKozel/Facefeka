import React, {Component} from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap'
import ImagePopup from "./ImagePopup";
import getFormattedDate from "../utils/timeFormatter";
import {PicturesPane} from "./ViewComponents";

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.data.date = getFormattedDate(this.data.date);
        this.state = {popUp: null};
    }

    render() {
        return (
            <>
                <ImagePopup show={this.state.popUp !== null} src={this.state.popUp}
                            close={() => this.setState({popUp: null})}/>
                <Card className="smallMarginTop">
                    <Row>
                        <Col>
                            <Image className="commentProfilePicture" src={this.data.profile_pic} roundedCircle/>
                        </Col>
                        <Col md="10">
                            <Card.Subtitle className="customSubTitleMargin">{this.data.name}</Card.Subtitle>
                        </Col>
                        <Col className="commentTimeMargin">{this.data.date}</Col>
                    </Row>
                    <Row>
                        <Card.Body className="comment">{this.data.text}</Card.Body>
                    </Row>
                    <PicturesPane data={this.data.pictures} className="commentImage" that={this}/>
                </Card>
            </>
        );
    }
}