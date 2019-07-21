import React, {Component} from 'react';
import {model} from './DropdownInput/DropdownInput.model.js'
import {controller} from './DropdownInput/DropdownInput.controller.js';
import {view} from './DropdownInput/DropdownInput.view.js';


export default class DropdownInput extends Component {
    constructor(props) {
        super(props);
        controller.init(props);
        model.state.options = props.options;
        this.state = model.state;
        controller.setState = (object, callback = () => null) => {
            model.state = {...model.state, ...object};
            this.setState(model.state, callback);
        };
    }

    render() {
        return view();
    }
}