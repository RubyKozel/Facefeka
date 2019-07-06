import React, {Component} from 'react';
import {Image, Modal} from "react-bootstrap";

export default class ImagePopup extends Component {
    constructor(props) {
        super(props);
        this.src = props.src;
        this.close = props.close;
        this.state = {show: true};
    }

    onHideClicked() {
        this.setState({show: false});
        this.close();
    }

    render() {
        return (
            <Modal centered autoFocus={true} show={this.state.show} onHide={this.onHideClicked.bind(this)}>
                <Modal.Body><Image src={this.src} className="imagePopup"/></Modal.Body>
            </Modal>
        );
    }
}