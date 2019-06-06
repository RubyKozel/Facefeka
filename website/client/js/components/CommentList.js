import React, {Component} from 'react';
import NewComment from "./NewComment";
import Comment from "./Comment";
import properties from "../../../websiteUtils/properties.json";

const base_url = properties.base_url;
const routes = properties.routes;

import '@babel/polyfill';

class CommentList extends Component {
    constructor(props) {
        super(props);
        this.profilePic = props.profilePic;
        this.comments = props.comments;
        this.id = props.id;
        this.name = props.name;
        this._creator = props.creator;
        this.onNewComment = props.onNewComment;
        this.state = {
            jsxComments: []
        };

        this.getCommentsForPost().catch(() => console.log("couldn't get comments"));

    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.profilePic = nextProps.profilePic;
        this.comments = nextProps.comments;

        this.getCommentsForPost().catch(() => console.log("couldn't get comments"));
    }

    async fetchPostAndUpdateCommentList() {
        let response = await fetch(`${base_url}${routes.get_post_by_id}`.replace(':id', this.id), {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });

        let post = null;

        if (response.status && response.status === 200) {
            post = await response.json();
        } else {
            return Promise.reject();
        }

        this.comments = post.comments;
    }

    async getCommentsForPost() {
        let jsxComments = [];
        for (const comment_id of this.comments) {
            let response = await fetch(`${base_url}${routes.get_post_by_id}`.replace(':id', comment_id), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    'x-auth': localStorage.getItem('x-auth')
                }
            });

            let comment = null;

            if (response.status && response.status === 200) {
                comment = await response.json();
            } else {
                return Promise.reject();
            }

            const data = {
                userName: comment.name,
                profilePic: comment.profile_pic,
                text: comment.text,
                date: comment.date
            };

            jsxComments.push(<Comment data={data}/>);
        }
        const that = this;
        this.setState({jsxComments}, () => {
            that.onNewComment(that.state.jsxComments.length);
        });
    }

    render() {
        return (
            <>
                <NewComment
                    creator={this._creator}
                    id={this.id}
                    name={this.name}
                    onNewComment={(callback) => {
                        this.fetchPostAndUpdateCommentList().then(() => this.getCommentsForPost());
                        callback();

                    }}
                    profilePic={this.profilePic}/>
                {this.state.jsxComments}
            </>
        )
    }
}

export default CommentList;