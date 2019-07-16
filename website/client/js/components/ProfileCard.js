import React, {Component} from 'react';
import {Button, Card, Spinner} from "react-bootstrap";
import GeneralDialog from "./GeneralDialog";
import properties from "../../../websiteUtils/properties.json";
import uploadImage from '../utils/uploadImage.js';

const {routes} = properties;

export default class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.onPictureUploaded = props.onPictureUploaded;
        this.canChange = props.canChange;
        this.noFooter = props.noFooter || false;
        this.imageClassName = props.imageClassName || "";
        this.cardClassName = props.cardClassName || "";
        this.titleClassName = props.titleClassName || "";
        this.state = {
            uploading: false,
            profilePic: this.props.profilePic,
            error: false
        }
    }

    render() {
        return (
            <>
                <GeneralDialog show={this.state.error} title="Error!"
                               text="Opps! there was an error in your last action..."
                               onClose={() => this.setState({error: false})}/>
                <Card className={`text-center ${this.cardClassName}`}>
                    {this.state.uploading ?
                        <Spinner className="homeProfileCardUploadSpinner" animation="border" variant="primary"/> :
                        <Card.Img className={`${this.imageClassName} clickable`}
                                  tag="a" onClick={this.canChange ? () => $('#image_upload').click() : null}
                                  variant="top"
                                  src={this.state.profilePic}/>}
                    <input className="noDisplay" id="image_upload" type="file" alt=""
                           onChange={e => {
                               this.setState({uploading: true});
                               uploadImage(e, routes.upload_profile_pic)
                                   .then(profilePic => this.setState({uploading: false, profilePic}))
                                   .catch(() => this.setState({uploading: false, error: true}))
                                   .then(this.onPictureUploaded)
                           }}/>
                    <Card.Body className={`${this.titleClassName}`}><Card.Title>{this.name}</Card.Title></Card.Body>
                    {this.noFooter ?
                        <></> :
                        <Card.Footer>
                            <Button onClick={() => window.location.href = 'profile.html'} variant="outline-primary"
                                    size="sm">Go To Profile</Button>
                        </Card.Footer>}
                </Card>
            </>
        )
    }
}