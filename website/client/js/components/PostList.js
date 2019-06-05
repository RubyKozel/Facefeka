import React, {Component} from 'react';
import Post from "./Post";
import properties from "../../../websiteUtils/properties.json";

const base_url = properties.base_url;
const routes = properties.routes;

import '@babel/polyfill';

class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {posts: PostList.createPosts(props)};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({posts: PostList.createPosts(nextProps)});
    }

    static createPosts(props) {
        return props.posts.map(post => <Post key={post._id} post={post}/>);
    }

    render() {
        return <div>{this.state.posts}</div>;
    }
}

export default PostList;