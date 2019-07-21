import React, {Component} from 'react';
import {model} from './Comment/Comment.model.js'
import {controller} from './Comment/Comment.controller.js';
import {view} from './Comment/Comment.view.js';

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = model.state;
        controller.setState = (object, callback = () => null) => {
            model.state = {...model.state, ...object};
            this.setState(model.state, callback);
        };
        controller.init(props);
    }

    render() {
        return view();
    }
}