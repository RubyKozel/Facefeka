import React, {Component} from 'react';
import {Card, Col, Image, Row, NavDropdown, Dropdown, Overlay, OverlayTrigger, Tooltip} from "react-bootstrap";
import CommentList from './CommentList'
import {MDBIcon} from 'mdbreact'
import GeneralDialog from './GeneralDialog';
import ImagePopup from './ImagePopup';
import getFormattedDate from '../utils/timeFormatter.js';
import properties from "../../../websiteUtils/properties.json";
import {POST_AUTH, DELETE} from '../utils/requests.js';

const {base_url, routes} = properties;

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.data = props.post;
        this.data.date = getFormattedDate(this.data.date);
        this.current_user = props.current_user;
        this.post_id = props.post_id;
        this.onDeletePost = props.onDeletePost;
        this.state = {
            commentsJsx: this.getComments(),
            comments: props.post.comments.length,
            likes: props.post.likes,
            show_div: <></>,
            collapsed: false,
            error: false,
            popUp: null,
            privacy: props.post.privacy,
            postDeleteDialog: <></>
        }
    }

    getComments() {
        const that = this;
        return (
            <>
                <NavDropdown.Divider/>
                <Card.Body>
                    <CommentList
                        onNewComment={(commentsLength) => this.setState({comments: commentsLength})}
                        creator={that.current_user._id}
                        id={that.post_id}
                        name={that.current_user.name}
                        profilePic={that.current_user.profile_pic}
                        comments={that.data.comments}/>
                </Card.Body>
            </>
        )
    };

    async likePost() {
        const likeButton = $(`.${this.post_id}`);
        let like;
        if (likeButton.hasClass('iconButtonClicked')) {
            like = false;
            likeButton.removeClass('iconButtonClicked');
        } else {
            like = true;
            likeButton.addClass('iconButtonClicked');
        }
        const response = await POST_AUTH(`${base_url}${routes.like_post_by_id}`.replace(':id', this.data._id),
            {like, _id: this.current_user._id});

        if (response.status && response.status === 200) {
            return await response.json();
        } else {
            this.setState({error: true});
            return Promise.reject();
        }
    }

    async deletePost() {
        const response = await DELETE(`${base_url}${routes.delete_post_by_id}`.replace(':id', this.data._id));

        if (response.status && response.status === 200) {
            this.setState({
                postDeleteDialog:
                    <GeneralDialog title="Post deleted"
                                   text="Your post has been deleted successfully"
                                   onClose={() => this.setState({postDeleteDialog: <></>}, this.onDeletePost)}/>
            });
        } else {
            return Promise.reject();
        }
    }

    async changePrivacy() {
        const response = await POST_AUTH(`${base_url}${routes.toggle_privacy}`.replace(':id', this.data._id), {privacy: !this.state.privacy});
        if (response.status && response.status === 200) {
            return await response.json();
        } else {
            this.setState({error: true});
            return Promise.reject();
        }
    }

    render() {
        const pictures = () => {
            if (this.data.pictures && this.data.pictures.length > 0) {
                const length = this.data.pictures.length;
                const width = length === 1 ? '100%' : length === 2 || length === 4 ? '50%' : '33.3333%';
                return (
                    <Card.Body>{this.data.pictures.map(picture =>
                        <Card.Img onClick={() => this.setState({popUp: picture})}
                                  style={{width}}
                                  className="clickable"
                                  tag="a"
                                  variant="bottom"
                                  src={picture}
                        />)}
                    </Card.Body>
                )
            }
            return <></>;
        };
        const likeIconClass = () => this.data.likes.includes(this.current_user._id) ?
            `indigo-text pr-3 iconButtonClicked ${this.post_id}` :
            `indigo-text pr-3 iconButton ${this.post_id}`;
        const dropDownMenu = () => this.data._creator === this.current_user._id ?
            <div className="customHamburgerIcon">
                <Dropdown>
                    <Dropdown.Toggle className="customIconToggle">
                        <MDBIcon icon="bars"
                                 className="clickable smallMarginBottom"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="post_menu">
                        <ul className="list-unstyled noMargin">
                            <Dropdown.Item
                                onSelect={() => this.deletePost().catch(() => this.setState({error: true}))}>
                                Delete Post</Dropdown.Item>
                            <Dropdown.Item
                                onSelect={() => this.changePrivacy().then(privacy => this.setState({privacy})).catch(() => this.setState({error: true}))}>
                                Change Privacy
                            </Dropdown.Item>
                        </ul>
                    </Dropdown.Menu>
                </Dropdown>
            </div> : <></>;

        return (
            <>
                {this.state.error ? <GeneralDialog title="Error!"
                                                   text="Opps! there was an error in your last action..."
                                                   onClose={() => this.setState({error: false})}/> : <></>}
                {this.state.popUp ?
                    <ImagePopup src={this.state.popUp} close={() => this.setState({popUp: null})}/> : <></>}
                {this.state.postDeleteDialog}
                <Card className="post">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Image className="postProfileImage" src={this.data.profile_pic} roundedCircle/>
                            </Col>
                            <Col className="profileNameAndDateMargin" md="10">
                                <Card.Title className="profileNameMargin">{this.data.name}</Card.Title>
                                {this.data.date}
                            </Col>
                            <div className="customLockIcon">
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="tooltip_lock">
                                            {this.state.privacy ?
                                                "This is a private post, only you can see it." :
                                                "This is a public post, anyone can see it."}
                                        </Tooltip>
                                    }>
                                    {this.state.privacy ? <MDBIcon icon="lock"/> : <MDBIcon icon="globe-asia"/>}
                                </OverlayTrigger>
                            </div>
                            {dropDownMenu()}
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
                                            far icon="thumbs-up" size="2x"
                                            className={likeIconClass()}/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {this.state.likes.length}
                                </p>
                            </Col>
                            <Col sm="4">
                                <p onClick={() => {
                                    const that = this;
                                    this.setState({
                                        show_div: that.state.collapsed ? <></> : that.state.commentsJsx,
                                        collapsed: !that.state.collapsed
                                    })
                                }}><MDBIcon
                                    far icon="comment" size="2x"
                                    className="indigo-text pr-3 iconButton"/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {this.state.comments}
                                </p>
                            </Col>
                        </Row>
                    </Card.Body>
                    {this.state.show_div}
                </Card>
            </>
        )
    }
}