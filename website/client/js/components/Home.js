import React, {Component} from "react";
import Header from "./Header";
import NewPost from "./NewPost";
import PostList from "./PostList";

import properties from '../../../websiteUtils/properties.json';
import {Row, Col} from "react-bootstrap";
import ProfileCard from "./ProfileCard";


const base_url = properties.base_url;
const routes = properties.routes;

class Home extends Component {
    constructor(props) {
        super(props);
        this.user = props.user;
    }

    render() {
        return (
            <div>
                <Header name={this.user.name}/>
                <div className="posts">
                    <Row>
                        <Col sm="4">
                            <ProfileCard/>
                        </Col>
                        <Col sm="4">
                            <NewPost/>
                            <PostList/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Home;