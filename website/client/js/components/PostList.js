import React, {Component} from 'react';
import Post from "./Post";

export default class PostList extends Component {
    constructor(props) {
        super(props);
        this.onDeletePost = props.onDeletePost;
        this.state = {
            posts: this.createPosts(props),
            user: {
                _id: props.user_id,
                name: props.user_name,
                profile_pic: props.user_profile_pic
            }
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({posts: this.createPosts(nextProps)});
    }

    createPosts(props) {
        return props.posts.map(post =>
            <Post
                onDeletePost={this.onDeletePost}
                post_id={post._id}
                key={post._id}
                current_user={this.state.user}
                post={post}/>);
    }

    render() {
        return <div>{this.state.posts}</div>;
    }
}