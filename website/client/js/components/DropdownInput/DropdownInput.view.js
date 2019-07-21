import React from "react";
import GeneralDialog from "../GeneralDialog";
import {Dropdown, FormControl} from "react-bootstrap";
import {model} from "./DropdownInput.model";
import {controller} from "./DropdownInput.controller";

export const view = () => {
    const {error, success, value} = model.state;
    const {errorTitle, errorText, friendAddTitle, friendAddText} = model.generalDialog;
    return (
        <>
            <GeneralDialog show={error} title={errorTitle} text={errorText} onClose={controller.onErrorDialogClose}/>
            <GeneralDialog show={success} title={friendAddTitle} text={friendAddText}
                           onClose={controller.onFriendAddedDialogClose}/>
            <Dropdown>
                <FormControl className="mx-3 my-2 w-auto" placeholder="Search..."
                             onChange={e => controller.handleChange(e, controller)} value={value}/>
                <Dropdown.Menu className="dropdownMenuSizing">
                    <ul className="list-unstyled noMargin">{controller.getFriendListForDropDown(value)}</ul>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
};