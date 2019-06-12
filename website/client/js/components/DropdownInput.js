import React, {Component} from 'react';
import {Card, Col, Dropdown, DropdownItem, FormControl, Image, NavDropdown, Row} from 'react-bootstrap';
import {MDBIcon} from "mdbreact";
import properties from "../../../websiteUtils/properties.json";

const base_url = properties.base_url;
const routes = properties.routes;

import GeneralDialog from "./GeneralDialog";

class DropdownInput extends Component {
    constructor(props) {
        super(props);
        this.friends = props.friends;
        this.state = {
            options: props.options,
            value: '',
            error: <></>,
            success: <></>
        };
    }

    handleChange(e) {
        const menu = $('.dropdown-menu');
        this.setState({value: e.target.value},
            () => {
                this.state.value.length > 0 ?
                    menu.addClass('show') :
                    menu.removeClass('show')
            });
    }

    async addFriend(id) {
        const response = await fetch(`${base_url}${routes.add_friend_by_id}`.replace(':id', id), {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });

        if (response.status && response.status === 200) {
            this.friends.push(id);
            this.setState({
                success: <GeneralDialog title="Friend was added" text="You've added a friend successfully!"
                                        onClose={() => this.setState({success: <></>})}/>
            })
        } else {
            this.setState({
                error: <GeneralDialog title="Error!" text="Oops! Adding your friend didn't quite work..."
                                      onClose={() => this.setState({error: <></>})}/>
            })
        }
        $('.dropdown-menu').removeClass('show');
    }

    static async getUser(id) {
        const response = await fetch(`${base_url}${routes.get_user_by_id}`.replace(':id', id), {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });

        if (response.status && response.status === 200) {
            return await response.json();
        } else {
            return Promise.reject();
        }
    }

    render() {
        const {value} = this.state;

        return (
            <>
                {this.state.error}
                {this.state.success}
                <Dropdown>
                    <FormControl
                        className="mx-3 my-2 w-auto"
                        placeholder="Search..."
                        onChange={this.handleChange.bind(this)}
                        value={value}
                    />
                    <Dropdown.Menu style={{width: '200%', margin: '0 0 0 -16.4rem'}}>
                        <ul className="list-unstyled" style={{margin: "unset"}}>{
                            this.state.options.filter(user => value === "*" ? true : user.name.toLowerCase().startsWith(value.toLowerCase())).map(user =>
                                <>
                                    <DropdownItem>
                                        <Card.Body onClick={() => {
                                            DropdownInput.getUser(user._id).then((user) => {
                                                localStorage.setItem('user_profile', JSON.stringify({user_profile: user}));
                                                window.location.href = 'profile.html';
                                            });
                                        }} style={{margin: 'unset', padding: 'unset'}}>
                                            <Row>
                                                <Col>
                                                    <Image style={{padding: '0.5rem', width: '20%'}}
                                                           src={user.profile_pic}
                                                           roundedCircle/>
                                                </Col>
                                                <Col md="5">
                                                    <Card.Subtitle
                                                        className="customFriendSearchSubtitle">{user.name}</Card.Subtitle>
                                                </Col>
                                                {!this.friends.includes(user._id) ?
                                                    <MDBIcon
                                                        onClick={() => this.addFriend(user._id).then(() => {
                                                            $('.dropdown-menu').removeClass('show');
                                                            this.setState({value: ""});
                                                        })}
                                                        icon="user-plus"
                                                        style={{cursor: 'pointer', margin: "15px 10px 0 0"}}/> : <></>}
                                            </Row>
                                        </Card.Body>
                                    </DropdownItem>
                                    <NavDropdown.Divider style={{margin: 'unset'}}/>
                                </>
                            )}
                        </ul>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}

export default DropdownInput;