import React, {Component} from 'react';
import {Card, Col, Image, Row, NavDropdown} from "react-bootstrap";
import CommentList from './CommentList'
import {MDBIcon} from 'mdbreact'

import properties from "../../../websiteUtils/properties.json";

const base_url = properties.base_url;
const routes = properties.routes;

import '@babel/polyfill';

class Post extends Component {
    constructor(props) {
        super(props);
        this.data = props.post;
        this.user_id = props.user_id;
        const that = this;
        const getComments = () => {
            return (
                <>
                    <NavDropdown.Divider/>
                    <Card.Body>
                        <CommentList
                            onNewComment={(commentsLength) => this.setState({comments: commentsLength})}
                            creator={that.data._creator}
                            id={that.data._id}
                            name={that.data.name}
                            profilePic={that.data.profile_pic}
                            comments={that.data.comments}/>
                    </Card.Body>
                </>
            )
        };

        this.state = {
            commentsJsx: getComments(),
            comments: props.post.comments.length,
            likes: props.post.likes,
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

    async likePost() {
        console.log(this.data);
        const likeButton = $("#likeButton");
        let like;
        if (likeButton.hasClass('iconButtonClicked')) {
            like = false;
            likeButton.removeClass('iconButtonClicked');
        } else {
            like = true;
            likeButton.addClass('iconButtonClicked');
        }

        const response = await fetch(routes.like_post_by_id.replace(':id', this.data._id), {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            },
            body: JSON.stringify({like, _id: this.user_id})
        });

        let likes = null;
        if (response.status && response.status === 200) {
            likes = await response.json();
        } else {
            return Promise.reject();
        }

        console.log(likes);

        return likes;
    }

    render() {
        this.getFormatedDate();
        const pictures = () => {
            if (this.data.pictures && this.data.pictures.length > 0) {
                return this.data.pictures.map(picture => pictures.push(<Image src={picture}/>));

            }
            return <></>;
        };

        const likeIconClass = () => this.data.likes.includes(this.user_id) ? "indigo-text pr-3 iconButtonClicked" : "indigo-text pr-3 iconButton";

        return (
            <Card className="post" style={{width: '40rem'}}>
                <Card.Body>
                    <Row>
                        <Col>
                            <Image style={{width: '100%'}} src={this.data.profile_pic} roundedCircle/>
                        </Col>
                        <Col className="profileNameAndDateMargin" md="10">
                            <Card.Title className="profileNameMargin">{this.data.name}</Card.Title>
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
                            <p><MDBIcon onClick={() => this.likePost().then((likes) => this.setState({likes}))}
                                        id="likeButton" far icon="thumbs-up" size="2x"
                                        className={likeIconClass()}/>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.likes.length}
                            </p>
                        </Col>
                        <Col sm="4">
                            <p onClick={() => {
                                const that = this;
                                this.setState({
                                    show_div: that.state.collapsed ? <></> : that.state.commentsJsx,
                                    collapsed: !that.state.collapsed
                                })
                            }}><MDBIcon far icon="comment" size="2x"
                                        className="indigo-text pr-3 iconButton"/>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.comments}
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