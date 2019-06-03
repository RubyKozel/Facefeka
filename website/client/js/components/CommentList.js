import React, {Component} from 'react';
import NewComment from "./NewComment";
import Comment from "./Comment";

class CommentList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <NewComment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
            </>
        )
    }
}

export default CommentList;