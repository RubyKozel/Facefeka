import {GET_AUTH, POST_AUTH} from "../../utils/requests";
import {model} from "./DropdownInput.model";
import {MDBIcon} from "mdbreact";
import React from "react";
import {optionView} from './DropdownInput.option.view.js'

export const controller = {
    init(props) {
        this.friends = props.friends;
    },

    handleChange(e, controller) {
        const menu = $('.dropdown-menu');
        controller.setState({value: e.target.value},
            () => model.state.value.length > 0 ? menu.addClass('show') : menu.removeClass('show'));
    },

    async addFriend(id) {
        const response = await POST_AUTH(model.routes.addFriendById.replace(':id', id));
        if (response.status && response.status === 200) {
            this.friends.push(id);
            this.setState({success: true})
        } else {
            this.setState({error: true})
        }
        $('.dropdown-menu').removeClass('show');
    },

    async getUser(id) {
        const response = await GET_AUTH(model.routes.getUserById.replace(':id', id));
        return response.status && response.status === 200 ? await response.json() : Promise.reject();
    },

    onFriendClicked(user) {
        this.getUser(user._id).then((user) => {
            localStorage.setItem('user_profile', JSON.stringify({user_profile: user}));
            window.location.href = 'profile.html';
        });
    },

    onAddFriendClicked(user) {
        this.addFriend(user._id).then(() => {
            $('.dropdown-menu').removeClass('show');
            this.setState({value: ""});
        })
    },

    addFriendIcon(user) {
        return !this.friends.includes(user._id) ?
            <MDBIcon className="addFriendIcon" onClick={() => this.onAddFriendClicked(user)} icon="user-plus"/> :
            <></>;
    },

    getFriendListForDropDown(value) {
        return optionView(value);
    },

    onErrorDialogClose() {
        this.setState({error: false})
    },

    onFriendAddedDialogClose() {
        this.setState({success: false})
    }
};