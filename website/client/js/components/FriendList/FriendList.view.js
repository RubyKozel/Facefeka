import GeneralDialog from "../GeneralDialog";
import {Card, Image, Media, NavDropdown} from "react-bootstrap";
import React from "react";
import {model} from "./FriendList.model";
import {controller} from "./FriendList.controller";
import {MDBIcon} from "mdbreact";

export const view = () => {
    const {invitePopUp, error} = model.state;
    const {errorTitle, errorText, gameInviteTitle, gameInviteText} = model.generalDialog;
    return (
        <>
            <GeneralDialog show={invitePopUp} title={gameInviteTitle} text={gameInviteText}
                           onClose={controller.onInvitePopupClosed}/>
            <GeneralDialog show={error} title={errorTitle} text={errorText} onClose={controller.onErrorDialogClose}/>
            <Card className={controller.cardStyle}>
                <Card.Title className="smallMargin">Friend List</Card.Title>
                {model.state.users
                    .sort((a, b) => a.connected && b.connected ? 0 : a.connected ? -1 : 1)
                    .map(user =>
                        <>
                            <NavDropdown.Divider className="noMargin"/>
                            <Media className="smallPadding"
                                   onClick={() => controller.onFriendClicked(user)}>
                                <Image className="friendListProfileImage" src={user.profile_pic} roundedCircle/>
                                <Media.Body className="smallMargin">
                                    <h5>{user.name}</h5>
                                    <MDBIcon icon="circle"
                                             className={user.connected ? "friendConnected" : "friendDisconnected"}/>
                                </Media.Body>
                            </Media>
                        </>)}
            </Card>
        </>
    )
};