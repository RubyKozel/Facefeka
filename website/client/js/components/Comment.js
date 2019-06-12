import React, {Component} from 'react';
import {Card, Col, Image, Row} from 'react-bootstrap'
import ImagePopup from "./ImagePopup";
import getFormattedDate from "../utils/timeFormatter";

class Comment extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.data.date = getFormattedDate(this.data.date);
        this.state = {
            popUp: null
        }
    }

    pictures() {
        if (this.data.pictures && this.data.pictures.length > 0) {
            const jsx = this.data.pictures.map(picture =>
                <Card.Img
                    onClick={() => this.setState({popUp: picture})}
                    style={{width: '20%', height: '20%', margin: '0 0 1rem 2.8rem', cursor: "pointer"}}
                    tag="a"
                    variant="bottom"
                    src={picture}/>);
            return <Row>{jsx}</Row>
        }
        return <></>;
    };

    render() {
        return (
            <>
                {this.state.popUp ?
                    <ImagePopup src={this.state.popUp} close={() => this.setState({popUp: null})}/> : <></>}
                <Card className="smallMarginTop">
                    <Row>
                        <Col>
                            <Image style={{padding: '1.25rem', width: '105%'}} src={this.data.profilePic}
                                   roundedCircle/>
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
                    {this.pictures()}
                </Card>
            </>
        );
    }
}

export default Comment;