import getFormattedDate from "../../utils/timeFormatter";

export const controller = {
    init: function (props) {
        let {profile_pic, name, date, text, pictures} = props.data;
        console.log("received", text);
        date = getFormattedDate(date);
        this.setState({profile_pic, name, date, text, pictures});
    },

    onImagePopupClosed: function () {
        this.setState({popUp: null});
    }
};