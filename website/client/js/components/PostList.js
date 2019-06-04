import React, {Component} from 'react';
import Post from "./Post";
import properties from "../../../websiteUtils/properties.json";

const base_url = properties.base_url;
const routes = properties.routes;

import '@babel/polyfill';

class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
        PostList.createPosts(props)
            .then(posts => {
                this.setState({posts})
            })
            .catch(() => console.log("unable to load posts"));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        PostList.createPosts(nextProps)
            .then(posts => {
                this.setState({posts})
            })
            .catch(() => console.log("unable to load posts"));
    }

    static async createPosts(props) {
        let posts = [];

        for (const post of props.posts) {
            let response = await fetch(`${base_url}${routes.get_user_by_id}`.replace(':id', post._creator), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    'x-auth': localStorage.getItem('x-auth')
                }
            });

            let user = null;
            if (response.status && response.status === 200) {
                user = await response.json();
            } else {
                return Promise.reject();
            }

            const data = {
                userName: user.name,
                userProfilePic: user.profile_pic,
                comments: post.comments,
                likes: post.likes,
                text: post.text,
                _id: post._id,
                date: post.date
            };

            if (post.pictures && post.pictures.length > 0)
                data.pictures = post.pictures;

            posts.push(<Post key={post._id} data={data}/>);
        }

        return posts;
    }

    render() {
        return (
            <div>
                {this.state.posts}
            </div>
        )
    }
}

export default PostList;