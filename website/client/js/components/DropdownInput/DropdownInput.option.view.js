import React from 'react';
import {Col, DropdownItem, Image, Row, Card} from "react-bootstrap";
import NavDropdown from "react-bootstrap/es/NavDropdown";
import {model} from "./DropdownInput.model";
import {controller} from "./DropdownInput.controller";

export const optionView = (value) => {
    return model.state.options
        .filter(user => value === "*" ? true : user.name.toLowerCase().includes(value.toLowerCase()))
        .map(user =>
            <>
                <DropdownItem>
                    <Card.Body className="noMargin noPadding" onClick={() => controller.onFriendClicked(user)}>
                        <Row>
                            <Col>
                                <Image className="dropDownMenuProfileImage" src={user.profile_pic} roundedCircle/>
                            </Col>
                            <Col md="5">
                                <Card.Subtitle className="customFriendSearchSubtitle">{user.name}</Card.Subtitle>
                            </Col>
                            {controller.addFriendIcon(user)}
                        </Row>
                    </Card.Body>
                </DropdownItem>
                <NavDropdown.Divider className="noMargin"/>
            </>
        )
};