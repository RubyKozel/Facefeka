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
        this.state = {
            jsxComments: []
        };

        this.getCommentsForPost()
            .then(jsxComments => this.setState({jsxComments}))
            .catch(() => console.log("couldn't get comments"));

    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.profilePic = nextProps.profilePic;
        this.comments = nextProps.comments;

        this.getCommentsForPost()
            .then(jsxComments => this.setState({jsxComments}))
            .catch(() => console.log("couldn't get comments"));
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

            response = await fetch(`${base_url}${routes.get_user_by_id}`.replace(':id', comment._creator), {
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
                profilePic: user.profile_pic,
                text: comment.text,
                date: comment.date
            };

            jsxComments.push(<Comment data={data}/>);
        }

        return jsxComments;
    }

    render() {
        return (
            <>
                <NewComment profilePic={this.profilePic}/>
                {this.state.jsxComments}
            </>
        )
    }
}

export default CommentList;