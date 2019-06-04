import React, {Component} from "react";
import Header from "./Header";
import NewPost from "./NewPost";
import PostList from "./PostList";

import properties from '../../../websiteUtils/properties.json';
import {Row, Col} from "react-bootstrap";
import ProfileCard from "./ProfileCard";


const base_url = properties.base_url;
const routes = properties.routes;

import '@babel/polyfill';

class Home extends Component {
    constructor(props) {
        super(props);
        this.user = props.user;
        this.state = {
            postList: []
        };

        this.getPostList()
            .then(postList => this.setState({postList}))
            .catch(() => console.log("couldn't get postList"));
    }

    async getPostList() {
        const userId = this.user._id;
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
            return Promise.reject();
        }

        let friends = this.user.friendList;
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
                return Promise.reject();
            }

            friend_posts = friend_posts.concat(posts);
        }

        myposts = myposts.concat(friend_posts);

        return myposts;
    }

    render() {
        return (
            <div>
                <Header name={this.user.name}/>
                <div className="posts">
                    <Row>
                        <Col sm="4">
                            <ProfileCard name={this.user.name} profilePic={this.user.profile_pic}/>
                        </Col>
                        <Col sm="4">
                            <NewPost
                                onNewPost={() => this.getPostList().then((postList) => this.setState({postList}))}/>
                            <PostList posts={this.state.postList}/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Home;