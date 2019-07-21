import properties from '../../../../websiteUtils/properties.json';

const {base_url, routes} = properties;

export const model = {
    state: {
        users: [],
        error: false,
        invitePopUp: false
    },
    generalDialog: {
        errorTitle: "Error!",
        errorText: "Oops! There was an error in your last action...",
        gameInviteTitle: "Join a game",
        gameInviteText: "Your friend has invited you to a game!"
    },
    routes: {
        getUserById: `${base_url}${routes.get_user_by_id}`,
        gameUrl: `${base_url}/facefeka/game/Game.html`
    }
};