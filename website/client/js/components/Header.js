import React, {Component} from 'react';
import {Button, Form, Nav, Navbar} from 'react-bootstrap';
import properties from '../../../websiteUtils/properties.json';
import DropdownInput from './DropdownInput';
import GeneralDialog from "./GeneralDialog";

const base_url = properties.base_url;
const routes = properties.routes;

class Header extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.user_id = props.user_id;
        this.friends = props.friends;
        this.state = {
            users: [],
            searchBar: <></>,
            showDialog: false
        };
        this.getAllUsers().then(() => this.setState({
            searchBar: <DropdownInput friends={this.friends} options={this.state.users}/>
        })).catch(console.log);
    }

    static async logout(redirect = true) {
        await fetch(`${base_url}${routes.remove_my_token}`, {
            method: "DELETE",
            body: JSON.stringify({}),
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        });

        localStorage.removeItem('remember');
        localStorage.removeItem('x-auth');
        if (redirect)
            window.location.href = '/facefeka';
    }

    componentDidMount() {
        $(window).on('scroll', () => {
            const navbar = $("#navbar");
            const sticky = navbar.offset().top;
            if (window.pageYOffset >= sticky) {
                navbar.addClass("sticky")
            } else {
                navbar.removeClass("sticky");
            }
        });
    }

    async getAllUsers() {
        const response = await fetch(`${base_url}${routes.get_all_users}`, {mode: 'cors'});
        if (response.status && response.status === 200) {
            let users = await response.json();
            users = users.filter(otherUser => otherUser._id !== this.user_id);
            this.setState({users});
        }
    }

    setTimeOut() {
        const timeout = JSON.parse(localStorage.getItem('timeout'));
        if (timeout) {
            clearTimeout(timeout.timeout);
        }
        const new_timeout = setTimeout(() =>
                Header.logout(false).then(() => {
                    localStorage.removeItem('timeout');
                    this.setState({showDialog: true})
                }),
            3600000 * 3); // logout every 3 hours of not being active
        localStorage.setItem('timeout', JSON.stringify({timeout: new_timeout}));
    }

    render() {
        this.setTimeOut();
        return (
            <>
                {this.state.showDialog ?
                    <GeneralDialog title="Token expired" text="Your token has expired, you should log in again"
                                   onClose={() => window.location.href = '/facefeka'}/> : <></>}
                <Navbar id="navbar" bg="primary" variant="dark">
                    <Navbar.Brand href="front.html">Facefeka</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="profile.html">{this.name}</Nav.Link>
                        <Nav.Link href="front.html">Home</Nav.Link>
                    </Nav>
                    <Form inline>
                        {this.state.searchBar}
                        &nbsp;&nbsp;&nbsp;
                        <Button variant="outline-light" onClick={Header.logout}>Logout</Button>
                    </Form>
                </Navbar>
            </>
        )
    }
}

export default Header;