import React, {Component} from 'react';
import NewComment from "./NewComment";
import Comment from "./Comment";
import properties from "../../../websiteUtils/properties.json";
import GeneralDialog from './GeneralDialog';
import {GET_AUTH} from '../utils/requests.js';

const {base_url, routes} = properties;

export default class CommentList extends Component {
    constructor(props) {
        super(props);
        this.profilePic = props.profilePic;
        this.comments = props.comments;
        this.id = props.id;
        this.name = props.name;
        this._creator = props.creator;
        this.onNewComment = props.onNewComment;
        this.state = {
            jsxComments: [],
            error: false
        };

        this.getCommentsForPost().catch(() => console.log("couldn't get comments"));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.profilePic = nextProps.profilePic;
        this.comments = nextProps.comments;
        this.getCommentsForPost().catch(() => console.log("couldn't get comments"));
    }

    async fetchPostAndUpdateCommentList() {
        let response = await GET_AUTH(`${base_url}${routes.get_post_by_id}`.replace(':id', this.id));
        let post = null;
        if (response.status && response.status === 200) {
            post = await response.json();
        } else {
            this.setState({error: true});
            return Promise.reject();
        }

        this.comments = post.comments;
    }

    async getCommentsForPost() {
        let jsxComments = [];
        for (const comment_id of this.comments) {
            let response = await GET_AUTH(`${base_url}${routes.get_post_by_id}`.replace(':id', comment_id));
            let comment = null;
            if (response.status && response.status === 200) {
                comment = await response.json();
                jsxComments.push(<Comment data={comment}/>);
            } else {
                this.setState({error: true});
                return Promise.reject();
            }
        }
        const that = this;
        this.setState({jsxComments}, () => that.onNewComment(that.state.jsxComments.length));
    }

    render() {
        return (
            <>
                <GeneralDialog show={this.state.error} title="Error!"
                               text="Opps! there was an error in your last action..."
                               onClose={() => this.setState({error: false})}/>
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