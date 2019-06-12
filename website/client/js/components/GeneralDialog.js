import React, {Component} from 'react';
import {Button, Modal} from "react-bootstrap";

class GeneralDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.text = props.text;
        this.title = props.title;
        this.onClose = props.onClose;
        this.state = {
            show: true,
        };
    }

    render() {
        return (
            <>
                <Modal show={this.state.show} onHide={() => {
                    this.setState({show: false});
                    this.onClose();
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.text}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            this.setState({show: false});
                            this.onClose();
                        }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default GeneralDialog;