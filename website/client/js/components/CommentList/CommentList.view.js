import React from 'react';
import GeneralDialog from "../GeneralDialog";
import NewComment from "../NewComment";

import {model} from './CommentList.model.js'
import {controller} from './CommentList.controller.js';

export const view = () => {
    const {text, title} = model.generalDialog;
    const {_creator, id, name, profilePic} = controller;
    return (
        <>
            <GeneralDialog show={model.state.error} title={title} text={text}
                           onClose={controller.onGeneralDialogClose}/>
            <NewComment creator={_creator} id={id} name={name} profilePic={profilePic}
                        onNewComment={(callback) => controller.onNewCommentPublished(callback)}/>
            {model.state.jsxComments}
        </>
    );
};