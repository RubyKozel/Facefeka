import React, {Component} from 'react';
import {Card, Col, Image, Row, NavDropdown} from "react-bootstrap";
import CommentList from './CommentList'
import {MDBIcon} from 'mdbreact'

class Post extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        const that = this;

        const getComments = () => {
            return (
                <>
                    <NavDropdown.Divider/>
                    <Card.Body>
                        <CommentList id={that.data._id}
                                     profilePic={that.data.userProfilePic} comments={that.data.comments}/>
                    </Card.Body>
                </>
            )
        };

        this.state = {
            comments: getComments(),
            show_div: <></>,
            collapsed: false
        }
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
        const pictures = () => {
            if (this.data.pictures && this.data.pictures.length > 0) {
                return this.data.pictures.map(picture => pictures.push(<Image src={picture}/>));

            }
            return <></>;
        };

        return (
            <Card className="post" style={{width: '40rem'}}>
                <Card.Body>
                    <Row>
                        <Col>
                            <Image style={{width: '100%'}} src={this.data.userProfilePic} roundedCircle/>
                        </Col>
                        <Col className="profileNameAndDateMargin" md="10">
                            <Card.Title className="profileNameMargin">{this.data.userName}</Card.Title>
                            {this.data.date}
                        </Col>
                    </Row>
                    <br/>
                    <Card.Text className="postText">{this.data.text}</Card.Text>
                    {pictures()}
                </Card.Body>
                <NavDropdown.Divider/>
                <Card.Body className="customBody">
                    <Row>
                        <Col sm="8">
                            <p><MDBIcon far icon="thumbs-up" size="2x"
                                        className="indigo-text pr-3"/>&nbsp;&nbsp;&nbsp;&nbsp;{this.data.likes}</p>
                        </Col>
                        <Col sm="4">
                            <p onClick={() => {
                                const that = this;
                                this.setState({
                                    show_div: that.state.collapsed ? <></> : that.state.comments,
                                    collapsed: !that.state.collapsed
                                })
                            }}><MDBIcon far icon="comment" size="2x"
                                        className="indigo-text pr-3"/>&nbsp;&nbsp;&nbsp;&nbsp;{this.data.comments.length}
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
                {this.state.show_div}
            </Card>
        )
    }
}

export default Post;