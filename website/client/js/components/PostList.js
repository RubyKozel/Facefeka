import React, {Component} from 'react';
import Post from "./Post";
import properties from "../../../websiteUtils/properties.json";

const base_url = properties.base_url;
const routes = properties.routes;

import '@babel/polyfill';

class PostList extends Component {
    constructor(props) {
        super(props);
        this.user_id = props.user_id;
        this.state = {posts: this.createPosts(props)};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({posts: this.createPosts(nextProps)});
    }

    createPosts(props) {
        return props.posts.map(post => <Post key={post._id} user_id={this.user_id} post={post}/>);
    }

    render() {
        return <div>{this.state.posts}</div>;
    }
}

export default PostList;