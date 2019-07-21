import React, {Component} from 'react';
import {model} from './CommentList/CommentList.model.js'
import {controller} from './CommentList/CommentList.controller.js';
import {view} from './CommentList/CommentList.view.js';

export default class CommentList extends Component {
    constructor(props) {
        super(props);
        this.state = model.state;
        controller.setState = (object, callback = () => null) => {
            model.state = {...model.state, ...object};
            console.log("model.state", model.state.jsxComments);
            this.setState(model.state, callback);
        };
        controller.init(props);
    }

    /*componentWillReceiveProps(nextProps, nextContext) {
        //controller.init(nextProps);
    }*/

    render() {
        return view();
    }
}