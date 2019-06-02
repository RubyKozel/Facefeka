import React, {Component} from 'react';
import {Button, Form, FormControl, Nav, Navbar} from 'react-bootstrap';
import properties from '../../../websiteUtils/properties.json';

const base_url = properties.base_url;
const routes = properties.routes;

class Header extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
    }

    logout() {
        fetch(`${base_url}${routes.remove_my_token}`, {
            method: "DELETE",
            body: JSON.stringify({}),
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'x-auth': localStorage.getItem('x-auth')
            }
        }).then(() => {
            localStorage.removeItem('remember');
            localStorage.removeItem('x-auth');
            window.location.href = '/';
        });
    }

    componentDidMount() {
        $(window).on('scroll', () => {
            const navbar = $("#navbar");
            console.log(navbar);
            const sticky = navbar.offset().top;
            console.log(sticky);
            if (window.pageYOffset >= sticky) {
                navbar.addClass("sticky")
            } else {
                navbar.removeClass("sticky");
            }
        });
    }

    render() {
        return (
            <Navbar id="navbar" bg="primary" variant="dark">
                <Navbar.Brand href="home.html">Facefeka</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="profile.html">{this.name}</Nav.Link>
                    <Nav.Link href="home.html">Home</Nav.Link>
                    <Nav.Link href="friends.html">Friends</Nav.Link>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                    <Button variant="outline-light">Search</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="outline-light" onClick={this.logout}>Logout</Button>
                </Form>
            </Navbar>
        )
    }
}

export default Header;