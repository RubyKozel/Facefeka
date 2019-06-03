import React, {Component} from 'react';
import NewPost from './NewPost';
import Post from "./Post";

class PostList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Post/>
            </div>
        )
    }
}

export default PostList;