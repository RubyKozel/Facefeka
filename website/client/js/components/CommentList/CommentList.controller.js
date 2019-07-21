import {GET_AUTH} from "../../utils/requests";
import Comment from "../Comment";
import React from 'react';
import {model} from './CommentList.model.js'

export const controller = {
    init: function (props) {
        this.initProps(props);
        this.getCommentsForPost().catch(() => console.log("couldn't get comments"));
    },

    initProps: function (props) {
        this.profilePic = props.profilePic;
        this.comments = props.comments;
        this.id = props.id;
        this.name = props.name;
        this._creator = props.creator;
        this.onNewComment = props.onNewComment;
    },

    getCommentsForPost: async function () {
        let jsxComments = [];
        for (const comment_id of this.comments) {
            let response = await GET_AUTH(model.routes.getPostByIdURL.replace(':id', comment_id));
            if (response.status && response.status === 200) {
                const comment = await response.json();
                jsxComments.push(<Comment data={comment}/>);
            } else {
                this.setState({error: true});
                return Promise.reject();
            }
        }
        console.log("after method", jsxComments);
        this.setState({jsxComments}, () => this.onNewComment(jsxComments.length));
    },

    fetchPostAndUpdateCommentList: async function () {
        let response = await GET_AUTH(model.routes.getPostByIdURL.replace(':id', this.id));
        let post = null;
        if (response.status && response.status === 200) {
            post = await response.json();
            this.comments = post.comments;
        } else {
            this.setState({error: true});
            return Promise.reject();
        }
    },

    onGeneralDialogClose: function () {
        this.setState({error: false});
    },

    onNewCommentPublished: function (callback) {
        this.fetchPostAndUpdateCommentList().then(() => this.getCommentsForPost());
        callback();
    }
};