import {invite, socket, setErrorFunction, setUpdateFunction} from "../../utils/invitationSockets";
import {GET} from "../../utils/requests";
import {model} from "./FriendList.model";

export const controller = {
    init(props) {
        this.initProps(props);
        this.getAllFriends().then((users) => this.setState({users})).catch(() => this.setState({error: true}));
        setUpdateFunction(() => this.setState({invitePopUp: true}));
        setErrorFunction(() => this.setState({error: true}))
    },

    initProps(props) {
        this.friendList = props.friends;
        this.cardStyle = props.cardStyle;
        this.user = props.user;
        this.fromProfile = props.fromProfile;
    },

    async getAllFriends() {
        return await Promise.all(this.friendList.map(async friend => {
            const response = await GET(model.routes.getUserById.replace(':id', friend));
            return response.status && response.status === 200 ? await response.json() : Promise.reject();
        }));
    },

    onFriendClicked(user) {
        if (user.connected && !this.fromProfile) {
            invite(user._id);
            localStorage.setItem('name', this.user.name);
            localStorage.setItem('action', 'create');
            window.open(model.routes.gameUrl);
        }
    },

    onErrorDialogClose() {
        this.setState({error: false})
    },

    onInvitePopupClosed() {
        localStorage.setItem('name', this.user.name);
        localStorage.setItem('action', 'subscribe');
        window.open(model.routes.gameUrl);
        this.setState({invitePopUp: false});
    }
};