import React, {Component} from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap'
import ImagePopup from "./ImagePopup";
import getFormattedDate from "../utils/timeFormatter";

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.data.date = getFormattedDate(this.data.date);
        this.state = {popUp: null};
    }

    pictures() {
        return this.data.pictures && this.data.pictures.length > 0 ?
            <Row>{
                this.data.pictures.map(picture =>
                    <Card.Img
                        onClick={() => this.setState({popUp: picture})}
                        className="commentImage"
                        tag="a"
                        variant="bottom"
                        src={picture}
                    />)}
            </Row> :
            <></>;
    };

    render() {
        const popUpImage = () => {
            return this.state.popUp ?
                <ImagePopup src={this.state.popUp} close={() => this.setState({popUp: null})}/> :
                <></>
        };

        return (
            <>
                {popUpImage()}
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
                    {this.pictures()}
                </Card>
            </>
        );
    }
}