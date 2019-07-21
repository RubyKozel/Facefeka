import React, {Component} from 'react';
import {model} from "./FriendList/FriendList.model";
import {view} from "./FriendList/FriendList.view";
import {controller} from "./FriendList/FriendList.controller";

export default class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = model.state;
        controller.init(props);
        controller.setState = (object, callback = () => null) => {
            model.state = {...model.state, ...object};
            this.setState(model.state, callback);
        };
    }

    render() {
        return view();
    }
}