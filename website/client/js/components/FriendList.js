import React, {Component} from 'react';
import properties from "../../../websiteUtils/properties.json";
import GeneralDialog from "./GeneralDialog";
import {Card, Image, Media, NavDropdown} from "react-bootstrap";
import {MDBIcon} from "mdbreact";
import {GET} from '../utils/requests.js';
import {invite, socket, setUpdateFunction, setErrorFunction} from '../utils/invitationSockets'

const {base_url, routes} = properties;


export default class FriendList extends Component {
    constructor(props) {
        super(props);
        this.friendList = props.friends;
        this.cardStyle = props.cardStyle;
        this.user = props.user;
        this.fromProfile = props.fromProfile;
        this.state = {
            users: [],
            error: <></>,
            invitePopUp: <></>
        };
        this.getAllFriends()
            .then((users) => this.setState({users}))
            .catch(() => this.setState({
                error: <GeneralDialog title="Error!"
                                      text="Oops! We couldn't get your friends..."
                                      onClose={() => this.setState({error: <></>})}/>
            }));

        setUpdateFunction(() => {
            const onInvitePopupClosed = () => {
                localStorage.setItem('name', this.user.name);
                localStorage.setItem('action', 'subscribe');
                window.open('http://localhost:3000/facefeka/game/Game.html');
                this.setState({invitePopUp: <></>});
            };

            this.setState({
                invitePopUp: <GeneralDialog title="Join a game"
                                            text="Your friend has invited you to a game!"
                                            onClose={onInvitePopupClosed}/>
            });
        });

        setErrorFunction(() => {
            this.setState({
                error: <GeneralDialog title="Error!"
                                      text="Oops! We couldn't get you into the game..."
                                      onClose={() => this.setState({error: <></>})}/>
            })
        })
    }

    async getAllFriends() {
        return await Promise.all(this.friendList.map(async friend => {
            const response = await GET(`${base_url}${routes.get_user_by_id}`.replace(':id', friend));
            return response.status && response.status === 200 ? await response.json() : Promise.reject();
        }));
    }

    onFriendClicked(user) {
        if (user.connected) {
            invite(user._id);
            localStorage.setItem('name', this.user.name);
            localStorage.setItem('action', 'create');
            window.open('http://localhost:3000/facefeka/game/Game.html');
        }
    }

    render() {
        const friendList = () =>
            this.state.users
                .sort((a, b) => a.connected && b.connected ? 0 : a.connected ? -1 : 1)
                .map(user =>
                    <>
                        <NavDropdown.Divider className="noMargin"/>
                        <Media className="smallPadding"
                               onClick={() => this.fromProfile ? null : this.onFriendClicked(user)}>
                            <Image className="friendListProfileImage" src={user.profile_pic} roundedCircle/>
                            <Media.Body className="smallMargin">
                                <h5>{user.name}</h5>
                                <MDBIcon icon="circle"
                                         className={user.connected ? "friendConnected" : "friendDisconnected"}/>
                            </Media.Body>
                        </Media>
                    </>);

        return (
            <>
                {this.state.invitePopUp}
                {this.state.error}
                {this.state.users.length > 0 ?
                    <Card className={this.cardStyle}>
                        <Card.Title className="smallMargin">Friend List</Card.Title>
                        {friendList()}
                    </Card> : <></>}
            </>
        )
    }
}