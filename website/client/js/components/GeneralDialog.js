import React, {Component} from 'react';
import {Button, Modal} from "react-bootstrap";

export default class GeneralDialog extends Component {
    constructor(props) {
        super(props);
        this.text = props.text;
        this.title = props.title;
        this.onClose = props.onClose;
        this.state = {show: true};
    }

    onHideClicked() {
        this.setState({show: false});
        this.onClose();
    }

    render() {
        return (
            <>
                <Modal show={this.state.show} onHide={this.onHideClicked.bind(this)}>
                    <Modal.Header closeButton><Modal.Title>{this.title}</Modal.Title></Modal.Header>
                    <Modal.Body>{this.text}</Modal.Body>
                    <Modal.Footer><Button variant="secondary"
                                          onClick={this.onHideClicked.bind(this)}>Close</Button></Modal.Footer>
                </Modal>
            </>
        );
    }
}