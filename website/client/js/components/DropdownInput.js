import React, {Component} from 'react';
import {Card, Col, Dropdown, DropdownItem, FormControl, Image, NavDropdown, Row} from 'react-bootstrap';
import {MDBIcon} from "mdbreact";
import {POST_AUTH, GET_AUTH} from '../utils/requests.js';
import properties from "../../../websiteUtils/properties.json";
import GeneralDialog from "./GeneralDialog";

const {base_url, routes} = properties;

export default class DropdownInput extends Component {
    constructor(props) {
        super(props);
        this.friends = props.friends;
        this.state = {
            options: props.options,
            value: '',
            error: false,
            success: false
        };
    }

    handleChange(e) {
        const menu = $('.dropdown-menu');
        this.setState({value: e.target.value},
            () => {
                this.state.value.length > 0 ? menu.addClass('show') : menu.removeClass('show')
            });
    }

    async addFriend(id) {
        const response = await POST_AUTH(`${base_url}${routes.add_friend_by_id}`.replace(':id', id));
        if (response.status && response.status === 200) {
            this.friends.push(id);
            this.setState({success: true})
        } else {
            this.setState({error: true})
        }
        $('.dropdown-menu').removeClass('show');
    }

    static async getUser(id) {
        const response = await GET_AUTH(`${base_url}${routes.get_user_by_id}`.replace(':id', id));
        return response.status && response.status === 200 ? await response.json() : Promise.reject();
    }

    getFriendListForDropDown(value) {
        const onFriendClicked = (user) => {
            DropdownInput.getUser(user._id).then((user) => {
                localStorage.setItem('user_profile', JSON.stringify({user_profile: user}));
                window.location.href = 'profile.html';
            });
        };

        const onAddFriendClicked = (user) => {
            this.addFriend(user._id).then(() => {
                $('.dropdown-menu').removeClass('show');
                this.setState({value: ""});
            })
        };

        const addFriendIcon = (user) => {
            return !this.friends.includes(user._id) ?
                <MDBIcon className="addFriendIcon" onClick={() => onAddFriendClicked(user)} icon="user-plus"/> :
                <></>;
        };

        return this.state.options
            .filter(user => value === "*" ? true : user.name.toLowerCase().startsWith(value.toLowerCase()))
            .map(user =>
                <>
                    <DropdownItem>
                        <Card.Body className="noMargin noPadding" onClick={() => onFriendClicked(user)}>
                            <Row>
                                <Col>
                                    <Image className="dropDownMenuProfileImage" src={user.profile_pic} roundedCircle/>
                                </Col>
                                <Col md="5">
                                    <Card.Subtitle className="customFriendSearchSubtitle">{user.name}</Card.Subtitle>
                                </Col>
                                {addFriendIcon(user)}
                            </Row>
                        </Card.Body>
                    </DropdownItem>
                    <NavDropdown.Divider className="noMargin"/>
                </>
            )
    }

    render() {
        return (
            <>
                <GeneralDialog show={this.state.error} title="Error!"
                               text="Oops! Adding your friend didn't quite work..."
                               onClose={() => this.setState({error: false})}/>
                <GeneralDialog show={this.state.success} title="Friend was added"
                               text="You've added a friend successfully!"
                               onClose={() => this.setState({success: false})}/>
                <Dropdown>
                    <FormControl
                        className="mx-3 my-2 w-auto"
                        placeholder="Search..."
                        onChange={this.handleChange.bind(this)}
                        value={this.state.value}
                    />
                    <Dropdown.Menu className="dropdownMenuSizing">
                        <ul className="list-unstyled noMargin">
                            {this.getFriendListForDropDown(this.state.value)}
                        </ul>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}