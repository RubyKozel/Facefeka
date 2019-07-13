import React from 'react'
import {Col, Row, Container, Card} from 'react-bootstrap';

export const Page = (props) => {
    return (
        <Container>
            {props.children[0]}
            {props.children[1]}
            <Row>
                {props.children.slice(2).map(child => <Col sm="4">{child}</Col>)}
            </Row>
        </Container>
    );
};

export const LeftPane = (props) => {
    return props.children.map(child => <Row>{child}</Row>)
};

export const PicturesPane = (props) => {
    return props.data && props.data.length > 0 ? (
        <Card.Body>
            {props.data.map(picture =>
                <Card.Img
                    onClick={() => props.that.setState({popUp: picture})}
                    className={props.className}
                    tag="a"
                    style={props.width ? {width: props.width} : {}}
                    variant="bottom"
                    src={picture}
                />
            )}
        </Card.Body>
    ) : <></>
};