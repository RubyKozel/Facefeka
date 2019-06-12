import React, {Component} from 'react';
import {Button, Image, Modal} from "react-bootstrap";

class ImagePopup extends Component {
    constructor(props) {
        super(props);
        this.src = props.src;
        this.close = props.close;
        this.state = {
            show: true
        }
    }

    render() {
        return (
            <>
                <Modal centered autoFocus={true} show={this.state.show} onHide={() => {
                    this.setState({show: false});
                    this.close();
                }}>
                    <Modal.Body><Image src={this.src} style={{width: "100%"}}/></Modal.Body>
                </Modal>
            </>
        );
    }
}

export default ImagePopup;