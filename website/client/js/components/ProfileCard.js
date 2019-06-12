import React, {Component} from 'react';
import {Button, Card} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import properties from "../../../websiteUtils/properties.json";

const {base_url, routes} = properties;

import GeneralDialog from "./GeneralDialog";

class ProfileCard extends Component {
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

    async uploadImage(e) {
        const files = Array.from(e.target.files);
        this.setState({uploading: true});

        const formData = new FormData();

        formData.append('file', files[0]);

        const response = await fetch(`${base_url}${routes.upload_profile_pic}`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                'x-auth': localStorage.getItem('x-auth')
            }
        });


        let profilePic = null;
        if (response.status && response.status === 200) {
            profilePic = (await response.json()).picture;
        } else {
            this.setState({error: true});
            return Promise.reject();
        }

        this.setState({
            uploading: false,
            profilePic
        });
    }

    render() {
        const {uploading, profilePic} = this.state;
        const content = () => {
            if (uploading) {
                return <Spinner style={{margin: '7.3rem'}} animation="border" variant="primary"/>;
            } else {
                return <Card.Img className={`${this.imageClassName}`}
                                 tag="a" onClick={this.canChange ? () => $('#image_upload').click() : null}
                                 style={{cursor: "pointer"}}
                                 variant="top"
                                 src={profilePic}/>
            }
        };

        const error = () => this.state.error ?
            <GeneralDialog title="Error!" text="Opps! there was an error in your last action..."
                           onClose={() => this.setState({error: false})}/> : <></>;

        return (
            <>
                {error()}
                <Card className={`text-center ${this.cardClassName}`}>
                    {content()}
                    <input id="image_upload" type="file" style={{display: "none"}} alt=""
                           onChange={(e) => this.uploadImage(e).then(() => this.onPictureUploaded())}/>
                    <Card.Body className={`${this.titleClassName}`}>
                        <Card.Title>{this.name}</Card.Title>
                    </Card.Body>
                    {!this.noFooter ?
                        <Card.Footer>
                            <Button onClick={() => window.location.href = 'profile.html'} variant="outline-primary"
                                    size="sm">Go To Profile</Button>
                        </Card.Footer> : <></>}
                </Card>
            </>
        )
    }
}

export default ProfileCard;