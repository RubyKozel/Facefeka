import React, {Component} from 'react';
import Header from "./Header";
import {Card, Col, Container, Jumbotron, Row} from "react-bootstrap";
import GeneralDialog from "./GeneralDialog";
import ProfileCard from "./ProfileCard";
import fetchUser from "../utils/fetch_user";
import NewPost from "./NewPost";
import PostList from "./PostList";
import properties from "../../../websiteUtils/properties.json";
import Spinner from "react-bootstrap/Spinner";
import FriendList from "./FriendList";

const base_url = properties.base_url;
const routes = properties.routes;

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.allPosts = [];
        this.state = {
            user: props.user,
            user_profile: props.user_profile,
            currIndex: 0,
            postList: [],
            loading: false,
            uploading: false,
            error: false
        };
        this.canChange = this.state.user._id === this.state.user_profile._id;
        this.refreshPosts();
    }

    async getPostList(id) {
        this.setState({loading: true});
        let response = await fetch(`${base_url}${routes.get_all_posts_by_id}`.replace(':id', id), {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });

        let postList = [];
        if (response.status && response.status === 200) {
            postList = (await response.json()).filter(post => !post.is_comment);
        } else {
            this.setState({error: true});
            return Promise.reject();
        }

        this.allPosts = postList;
        const currIndex = this.state.currIndex + 8;
        this.setState({currIndex, postList: postList.slice(0, currIndex)});
    }

    componentDidMount() {
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight) {
                const currIndex = this.state.currIndex + 8;
                const postList = this.allPosts;
                this.setState({currIndex, postList: postList.slice(0, currIndex)});
            }
        }
    }

    refreshPosts(callback) {
        this.setState({currIndex: 0, loading: true});
        this.getPostList(this.state.user_profile._id)
            .then(() => this.setState({loading: false}))
            .catch(e => console.log(e));
        if (callback) callback();
    }

    async uploadImage(e) {
        const files = Array.from(e.target.files);
        this.setState({uploading: true});

        const formData = new FormData();

        formData.append('file', files[0]);

        const response = await fetch(`${base_url}${routes.upload_theme_pic}`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                'x-auth': localStorage.getItem('x-auth')
            }
        });


        let profilePic = null;
        if (response.status && response.status === 200) {
            profilePic = (await response.json()).picture;
        } else {
            this.setState({error: true});
            return Promise.reject();
        }

        this.setState({
            uploading: false,
            profilePic
        });
    }

    render() {
        const error = () => this.state.error ?
            <GeneralDialog title="Error!" text="Opps! there was an error in your last action..."
                           onClose={() => this.setState({error: false})}/> : <></>;
        const spinner = () => this.state.uploading ?
            <Spinner style={{marginLeft: '31.6%', position: 'absolute'}} animation="border" variant="primary"/> : <></>;

        return (
            <>
                {error()}
                <Container>
                    <Header user_id={this.state.user._id} name={this.state.user.name}
                            friends={this.state.user.friendList}/>
                    <Jumbotron
                        onClick={this.canChange ? () => $('#theme_upload').click() : null}
                        style={{
                            cursor: 'pointer',
                            display: 'block',
                            height: '250px',
                            backgroundImage: `url("${this.state.user_profile.theme_pic}")`,
                            backgroundSize: 'cover'
                        }} fluid>
                        {spinner()}
                        <input id="theme_upload" type="file" style={{display: "none"}} alt=""
                               onChange={(e) => this.uploadImage(e)
                                   .then(fetchUser)
                                   .then(user => this.setState({user, user_profile: user}))}/>
                        <Container>
                            <ProfileCard
                                titleClassName={"profileCustomTitle"}
                                imageClassName={"profileCustomImage rounded-circle"}
                                cardClassName={"profileCustomCard"}
                                noFooter={true}
                                canChange={this.canChange}
                                name={this.state.user_profile.name}
                                profilePic={this.state.user_profile.profile_pic}
                                onPictureUploaded={() => fetchUser().then(user => this.setState({user}))}/>
                        </Container>
                    </Jumbotron>
                    <Container className="profileCustomContainer">
                        <Row>
                            <Col>
                                <NewPost
                                    name={this.state.user.name}
                                    profile_pic={this.state.user.profile_pic}
                                    creator={this.state.user._id}
                                    onNewPost={(c) => this.refreshPosts(c)}/>
                                {this.state.loading ?
                                    <Spinner animation="border" style={{
                                        width: '10rem',
                                        height: '10rem',
                                        margin: '5rem'
                                    }}/> : <></>}
                                <PostList
                                    onDeletePost={this.refreshPosts.bind(this)}
                                    user_id={this.state.user._id}
                                    user_name={this.state.user.name}
                                    user_profile_pic={this.state.user.profile_pic}
                                    posts={this.state.postList}/>
                            </Col>
                            <Col>
                                <FriendList cardStyle={{'margin-top': '1rem'}}
                                            friends={this.state.user_profile.friendList}/>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </>
        )
    }

}

export default ProfilePage