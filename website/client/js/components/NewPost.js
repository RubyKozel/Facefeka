import React, {Component} from 'react';
import {Button, ButtonToolbar, Card, Row, ToggleButton, ToggleButtonGroup, Col} from "react-bootstrap";
import {MDBInput} from "mdbreact";

class NewPost extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className="smallMarginTop" style={{width: '40rem'}}>
                <Card.Header> Write new post </Card.Header>
                <Card.Body>
                    <MDBInput className="text-area" type="textarea" rows="5"/>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col>
                            <Button variant="outline-primary" size="md">Upload Images</Button>
                        </Col>
                        <Col className="extraSmallRightMargin" sm="3">
                            <ButtonToolbar>
                                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                                    <ToggleButton value={1}>Public</ToggleButton>
                                    <ToggleButton value={2}>Private</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                        </Col>
                    </Row>


                </Card.Footer>
            </Card>
        )
    }
}

export default NewPost;