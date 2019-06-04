import React, {Component} from 'react';
import {Button, Card} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import properties from "../../../websiteUtils/properties.json";

const {base_url, routes} = properties;


import '@babel/polyfill';

const nopic = '../resources/nopic.png';

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.state = {
            uploading: false,
            profilePic: this.props.profilePic
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
                return <Card.Img tag="a" onClick={() => $('#image_upload').click()}
                                 style={{cursor: "pointer"}}
                                 variant="top"
                                 src={profilePic}/>
            }
        };

        return (
            <Card className="text-center smallMarginTop largeMarginLeft">
                {content()}
                <input id="image_upload" type="file" style={{visibility: "hidden"}} alt=""
                       onChange={(e) => this.uploadImage(e)}/>
                <Card.Body>
                    <Card.Title>{this.name}</Card.Title>
                </Card.Body>
                <Card.Footer>
                    <Button variant="outline-primary" size="sm">Go To Profile</Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default ProfileCard;