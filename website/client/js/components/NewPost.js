import React, {Component} from 'react';
import {Button, ButtonToolbar, Card, Row, ToggleButton, ToggleButtonGroup, Col} from "react-bootstrap";
import {MDBInput} from "mdbreact";
import properties from "../../../websiteUtils/properties.json";
import GeneralDialog from "./GeneralDialog";
import {POST_AUTH, POST_FORM_DATA_AUTH} from '../utils/requests.js';

const {base_url, routes} = properties;

export default class NewPost extends Component {
    constructor(props) {
        super(props);
        this.onNewPost = props.onNewPost;
        this.name = props.name;
        this.creator = props.creator;
        this.state = {
            text: "",
            imagePreview: <></>,
            profile_pic: props.profile_pic,
            pictures: [],
            privacy: false,
            publishing: false,
            error: false
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({profile_pic: nextProps.profile_pic});
    }

    async publishNewPost() {
        this.setState({publishing: true});
        const data = {
            text: this.state.text,
            privacy: this.state.privacy,
            _creator: this.creator,
            name: this.name,
            profile_pic: this.state.profile_pic
        };

        let response = await POST_AUTH(`${base_url}${routes.new_post}`, data);

        if (response.status && response.status === 200) {
            const post = await response.json();
            if (this.state.pictures.length > 0) {
                const post_id = post._id;
                const formData = new FormData();
                this.state.pictures.forEach((file, i) => formData.append(`${i}`, file));

                const response = await POST_FORM_DATA_AUTH(
                    `${base_url}${routes.upload_images_to_post_by_id}`.replace(':id', post_id), formData);

                if (!(response.status && response.status === 200)) {
                    this.setState({error: true});
                    return Promise.reject();
                }
            }
            this.onNewPost(() => this.setState({text: "", imagePreview: <></>, pictures: [], publishing: false}));
        } else {
            this.setState({error: true, publishing: false});
            return Promise.reject();
        }
    }

    showImagePreview(e) {
        const files = Array.from(e.target.files);
        const width = files.length === 1 ? '100%' : files.length === 2 || files.length === 4 ? '50%' : '33.3333%';
        let imagePreview = [];
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = e => {
                imagePreview.push(<Card.Img style={{width}} tag="a" variant="bottom" src={e.target.result}/>);
                this.setState({imagePreview, pictures: files}, () => this.setState(this.state));
            };
            reader.readAsDataURL(file);
        }
    }

    render() {
        const preview = () => this.state.imagePreview.length > 0 ?
            <Card.Body className="preview">{this.state.imagePreview}</Card.Body> : <></>;
        const error = () => this.state.error ?
            <GeneralDialog title="Error!"
                           text="Opps! there was an error in your last action..."
                           onClose={() => this.setState({error: false})}/> : <></>;
        return (
            <>
                {error()}
                <Card className="post">
                    <Card.Header> Write new post </Card.Header>
                    <Card.Body>
                        <MDBInput value={this.state.text}
                                  getValue={(text) => this.setState({text})}
                                  id="new-post"
                                  className="text-area"
                                  type="textarea" rows="5"/>
                    </Card.Body>
                    {preview()}
                    <Card.Footer>
                        <Row>
                            <Col md="3">
                                <Button onClick={this.state.publishing ? null : () => $('#upload_images').click()}
                                        className="uploadImageButtonPadding"
                                        variant="outline-primary" size="md">Upload Images</Button>
                                <input id="upload_images" type="file" className="noDisplay" alt=""
                                       onChange={(e) => this.showImagePreview(e)} multiple/>
                            </Col>
                            <Col md="5">
                                <Button className="largeMarginRight" onClick={this.publishNewPost.bind(this)}
                                        variant="outline-primary"
                                        disabled={this.state.publishing}
                                        size="md">{this.state.publishing ? 'Publishing...' : 'Publish'}</Button>
                            </Col>
                            <Col className="extraSmallRightMargin" sm="3">
                                <ButtonToolbar>
                                    <ToggleButtonGroup className="largeMarginLeft"
                                                       onChange={value => this.setState({privacy: value === 2})}
                                                       type="radio"
                                                       name="options"
                                                       defaultValue={1}>
                                        <ToggleButton value={1}>Public</ToggleButton>
                                        <ToggleButton value={2}>Private</ToggleButton>
                                    </ToggleButtonGroup>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </>
        )
    }
}