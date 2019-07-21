import React from 'react';
import ImagePopup from "../ImagePopup";
import {Card, Col, Image, Row} from "react-bootstrap";
import {PicturesPane} from "../ViewComponents";
import {controller} from "./Comment.controller";
import {model} from "./Comment.model";

export const view = () => {
    console.log("on view, state", model.state);
    const {profile_pic, name, date, text, pictures, popUp} = model.state;
    return (
        <>
            <ImagePopup show={popUp !== null} src={popUp}
                        close={controller.onImagePopupClosed}/>
            <Card className="smallMarginTop">
                <Row>
                    <Col><Image className="commentProfilePicture" src={profile_pic} roundedCircle/></Col>
                    <Col md="10"><Card.Subtitle className="customSubTitleMargin">{name}</Card.Subtitle></Col>
                    <Col className="commentTimeMargin">{date}</Col>
                </Row>
                <Row><Card.Body className="comment">{text}</Card.Body></Row>
                <PicturesPane data={pictures} className="commentImage" that={controller}/>
            </Card>
        </>
    );
};