import React, {Component} from "react";
import Header from "./Header";
import NewPost from "./NewPost";
import properties from '../../../websiteUtils/properties.json';
import ProfileCard from "./ProfileCard";
import GeneralDialog from "./GeneralDialog";
import FriendList from "./FriendList";
import Spinner from "react-bootstrap/Spinner";
import {fetchUser} from '../utils/fetch_user.js';
import {LeftPane, Page} from "./ViewComponents";
import {GET_AUTH} from '../utils/requests.js';
import Post from "./Post";

const {base_url, routes} = properties;

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.allPosts = [];
        this.state = {
            currIndex: 0,
            postList: [],
            error: false,
            user: props.user,
            loading: true
        };

        this.getPostList()
            .then(() => this.setState({loading: false}))
            .catch(console.log);
    }

    componentDidMount() {
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight) {
                const currIndex = this.state.currIndex + 8;
                const postList = this.allPosts;
                this.setState({currIndex, postList: postList.slice(0, currIndex)});
            }
        }
    }

    async getPostList() {
        let response = await GET_AUTH(`${base_url}${routes.get_all_posts_by_id}`.replace(':id', this.state.user._id)),
            myposts = [],
            friends = this.state.user.friendList,
            friend_posts = [],
            that = this;
        if (response.status && response.status === 200) {
            myposts = (await response.json()).filter(post => !post.is_comment);

            for (const friend of friends) {
                let response = await GET_AUTH(`${base_url}${routes.get_all_posts_by_id}`.replace(':id', friend)),
                    posts = [];

                if (response.status && response.status === 200) {
                    posts = (await response.json()).filter(post => !post.is_comment && !post.privacy);
                } else {
                    this.setState({error: true});
                    return Promise.reject();
                }

                friend_posts = friend_posts.concat(posts);
            }

            this.allPosts = myposts.concat(friend_posts).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
            const currIndex = this.state.currIndex + 8;
            this.setState({currIndex, postList: that.allPosts.slice(0, currIndex)});
        } else {
            this.setState({error: true});
            return Promise.reject();
        }
    }

    refreshPosts(callback) {
        this.setState({currIndex: 0, loading: true});
        this.getPostList().then(() => this.setState({loading: false})).catch(console.log);
        if (callback) callback();
    }

    render() {
        const buildPostListJSX = () => {
            const {_id, name, profile_pic} = this.state.user;
            return this.state.postList.map(post =>
                <Post
                    onDeletePost={this.refreshPosts.bind(this)}
                    post_id={post._id}
                    key={post._id}
                    current_user={{_id, name, profile_pic}}
                    post={post}/>)
        };

        return (
            <Page>
                <GeneralDialog show={this.state.error} title="Error!"
                               text="Opps! there was an error in your last action..."
                               onClose={() => this.setState({error: false})}/>
                <Header user_id={this.state.user._id} name={this.state.user.name}
                        friends={this.state.user.friendList}/>
                <LeftPane>
                    <ProfileCard canChange={true}
                                 cardClassName="profileCardMargin"
                                 name={this.state.user.name}
                                 profilePic={this.state.user.profile_pic}
                                 onPictureUploaded={() => fetchUser().then(user => this.setState({user}))}/>
                    <FriendList user={this.state.user}
                                cardStyle="friendListCard friendListCardHome"
                                friends={this.state.user.friendList}/>
                </LeftPane>
                <div id="PostList">
                    <NewPost
                        name={this.state.user.name}
                        profile_pic={this.state.user.profile_pic}
                        creator={this.state.user._id}
                        onNewPost={(c) => this.refreshPosts(c)}/>
                    {this.state.loading ? <Spinner animation="border" className="homeSpinner"/> : <></>}
                    {buildPostListJSX()}
                </div>
            </Page>
        )
    }
}