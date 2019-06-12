import React, {Component} from 'react';
import properties from "../../../websiteUtils/properties.json";
import GeneralDialog from "./GeneralDialog";
import {Card, Image, Media, NavDropdown} from "react-bootstrap";
import {MDBIcon} from "mdbreact";

const base_url = properties.base_url;
const routes = properties.routes;

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.friendList = props.friends;
        this.cardStyle = props.cardStyle;
        this.state = {
            users: [],
            error: <></>
        };
        this.getAllFriends()
            .then((users) => {
                console.log(users);
                this.setState({users})
            })
            .catch(() =>
                <GeneralDialog
                    title="Error!"
                    text="Oops! We couldn't get your friends..."
                    onClose={() => this.setState({error: <></>})}
                />);

    }

    async getAllFriends() {
        return await Promise.all(this.friendList.map(async friend => {
            const response = await fetch(`${base_url}${routes.get_user_by_id}`.replace(':id', friend));
            return response.status && response.status === 200 ? await response.json() : null;
        }));
    }

    render() {
        const friendList = () =>
            this.state.users
                .sort((a, b) => a.connected && b.connected ? 0 : a.connected ? -1 : 1)
                .map(user =>
                    <>
                        <NavDropdown.Divider style={{margin: 'unset'}}/>
                        <Media style={{padding: '1rem'}}>
                            <Image style={{width: '15%', margin: "0.5rem 0 0 0"}} src={user.profile_pic} roundedCircle/>
                            <Media.Body style={{margin: '0.8rem'}}>
                                <h5>{user.name}</h5>
                                <MDBIcon icon="circle" style={{
                                    color: user.connected ? "green" : "red",
                                    position: 'absolute',
                                    margin: '-1.6rem 0 0 11rem'
                                }}/>
                            </Media.Body>
                        </Media>

                    </>);

        return (
            <>
                {this.state.error}
                {this.state.users.length > 0 ?
                    <Card style={this.cardStyle}>
                        <Card.Title style={{margin: '1rem'}}>Invite your friends</Card.Title>
                        {friendList()}
                    </Card> : <></>}
            </>
        )
    }
}

export default FriendList;