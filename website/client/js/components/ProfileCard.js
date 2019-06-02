import React, {Component} from 'react';
import {Button, Card} from "react-bootstrap";

class ProfileCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className="text-center smallMarginTop largeMarginLeft">
                <Card.Img variant="top" src="../resources/temp.jpg"/>
                <Card.Body>
                    <Card.Title>Ruby Kozel</Card.Title>
                </Card.Body>
                <Card.Footer>
                    <Button variant="outline-primary" size="sm">Go To Profile</Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default ProfileCard;