import React, {Component} from 'react';
import {Col, Container, Image, Row, Card, Spinner} from "react-bootstrap";
import {MDBIcon, MDBInput} from 'mdbreact';
import properties from "../../../websiteUtils/properties.json";
import GeneralDialog from "./GeneralDialog";
import {POST_AUTH, POST_FORM_DATA_AUTH} from '../utils/requests.js';

const {base_url, routes} = properties;

export default class NewComment extends Component {
    constructor(props) {
        super(props);
        this.profilePic = props.profilePic;
        this.onNewComment = props.onNewComment;
        this.id = props.id;
        this.name = props.name;
        this.profile_pic = props.profilePic;
        this.creator = props.creator;
        this.state = {
            text: "",
            imagePreview: <></>,
            pictures: [],
            error: false,
            publishing: false
        };
    }

    async postNewComment(e) {
        if (e.key === 'Enter') {
            this.setState({publishing: true});
            const data = {
                _creator: this.creator,
                name: this.name,
                profile_pic: this.profile_pic,
                text: this.state.text
            };
            const response = await POST_AUTH(`${base_url}${routes.comment_post_by_id}`.replace(':id', this.id), data);
            if (response.status && response.status === 200) {
                const post = await response.json();
                if (this.state.pictures.length > 0) {
                    const post_id = post._id;
                    const formData = new FormData();
                    this.state.pictures.forEach((file, i) => formData.append(`${i}`, file));

                    const response = await POST_FORM_DATA_AUTH(
                        `${base_url}${routes.upload_images_to_post_by_id}`.replace(':id', post_id), formData);
                    if (!(response.status && response.status === 200)) {
                        this.setState({error: true, publishing: false});
                        return Promise.reject();
                    }
                }

                this.onNewComment(() => this.setState({
                    text: "",
                    imagePreview: <></>,
                    pictures: [],
                    publishing: false
                }));
            } else {
                this.setState({error: true, publishing: false});
                return Promise.reject();
            }
        }
    }

    showImagePreview(e) {
        const files = Array.from(e.target.files);
        console.log(files.length);
        let imagePreview = [];
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = e => {
                imagePreview.push(
                    <Card.Img className="commentImagePreview" tag="a" variant="bottom" src={e.target.result}/>);
                this.setState({imagePreview, pictures: files}, () => this.setState(this.state));
            };
            reader.readAsDataURL(file);
        }
    }

    render() {
        const preview = () => this.state.imagePreview.length > 0 ?
            <Row className="preview">{this.state.imagePreview}</Row> : <></>;

        return (
            <Container>
                <GeneralDialog show={this.state.error} title="Error!"
                               text="Opps! there was an error in your last action..."
                               onClose={() => this.setState({error: false})}/>
                <Row className="smallMarginBottom">
                    <Col>
                        <Image className="newCommentImageSize" src={this.profilePic} roundedCircle/>
                    </Col>
                    <Col md="9">
                        <MDBInput
                            value={this.state.text}
                            className="comment_input"
                            onKeyPress={this.postNewComment.bind(this)}
                            getValue={(text) => this.setState({text})} type="text"
                            placeholder="Write new comment..."/>
                    </Col>
                    <Col>
                        <MDBIcon onClick={this.state.publishing ? null : () => $('#upload_images_comment').click()}
                                 className="uploadImageIconComment"
                                 far icon="image" size="3x"/>
                        <input className="noDisplay" id="upload_images_comment" type="file" alt=""
                               onChange={(e) => this.showImagePreview(e)} multiple/>
                    </Col>
                </Row>
                {this.state.publishing ? <Spinner animation="border"/> : preview()}
            </Container>
        )
    }
}