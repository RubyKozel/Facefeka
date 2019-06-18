import React, {Component} from "react";
import Header from "./Header";
import NewPost from "./NewPost";
import PostList from "./PostList";

import properties from '../../../websiteUtils/properties.json';
import {Col, Container, Row} from "react-bootstrap";
import ProfileCard from "./ProfileCard";
import GeneralDialog from "./GeneralDialog";
import FriendList from "./FriendList";
import fetchUser from '../utils/fetch_user.js';
import Spinner from "react-bootstrap/Spinner";

const base_url = properties.base_url;
const routes = properties.routes;

class Home extends Component {
    constructor(props) {
        super(props);
        this.allPosts = [];
        this.state = {
            currIndex: 0,
            postList: [],
            error: false,
            user: props.user,
            loading: true
        };

        this.getPostList()
            .then(() => this.setState({loading: false}))
            .catch(e => console.log(e));
    }

    componentDidMount() {
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight) {
                console.log("Bottom");
                const currIndex = this.state.currIndex + 8;
                const postList = this.allPosts;
                this.setState({currIndex, postList: postList.slice(0, currIndex)});
            }
        }
    }

    async getPostList() {
        const userId = this.state.user._id;
        let response = await fetch(`${base_url}${routes.get_all_posts_by_id}`.replace(':id', userId), {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });


        let myposts = [];

        if (response.status && response.status === 200) {
            myposts = (await response.json()).filter(post => !post.is_comment);
        } else {
            this.setState({error: true});
            return Promise.reject();
        }

        let friends = this.state.user.friendList;
        let friend_posts = [];

        for (const friend of friends) {
            let response = await fetch(`${base_url}${routes.get_all_posts_by_id}`.replace(':id', friend), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    'x-auth': localStorage.getItem('x-auth')
                }
            });

            let posts = [];
            if (response.status && response.status === 200) {
                posts = (await response.json()).filter(post => !post.is_comment && !post.privacy);
            } else {
                this.setState({error: true});
                return Promise.reject();
            }

            friend_posts = friend_posts.concat(posts);
        }

        const postList = myposts.concat(friend_posts).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        this.allPosts = postList;
        const currIndex = this.state.currIndex + 8;
        this.setState({currIndex, postList: postList.slice(0, currIndex)});
    }

    refreshPosts(callback) {
        this.setState({currIndex: 0, loading: true});
        this.getPostList()
            .then(() => this.setState({loading: false}))
            .catch(e => console.log(e));
        if (callback) callback();
    }

    render() {
        const error = () => this.state.error ?
            <GeneralDialog title="Error!" text="Opps! there was an error in your last action..."
                           onClose={() => this.setState({error: false})}/> : <></>;
        return (
            <Container>
                {error()}
                <Header user_id={this.state.user._id} name={this.state.user.name} friends={this.state.user.friendList}/>
                <Row>
                    <Col sm="4">
                        <Row>
                            <ProfileCard canChange={true}
                                         cardClassName={"profileCardMargin"}
                                         name={this.state.user.name}
                                         profilePic={this.state.user.profile_pic}
                                         onPictureUploaded={() => fetchUser().then(user => this.setState({user}))}/>
                        </Row>
                        <Row>
                            <FriendList user={this.state.user}
                                        cardStyle={{'margin-left': '80px', 'margin-top': '1rem'}}
                                        friends={this.state.user.friendList}/>
                        </Row>
                    </Col>
                    <Col sm="4">
                        <NewPost
                            name={this.state.user.name}
                            profile_pic={this.state.user.profile_pic}
                            creator={this.state.user._id}
                            onNewPost={(c) => this.refreshPosts(c)}/>
                        {this.state.loading ? <Spinner animation="border" style={{
                            width: '20rem',
                            height: '20rem',
                            margin: '10rem'
                        }}/> : <></>}
                        <PostList
                            onDeletePost={this.refreshPosts.bind(this)}
                            user_id={this.state.user._id}
                            user_name={this.state.user.name}
                            user_profile_pic={this.state.user.profile_pic}
                            posts={this.state.postList}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Home;