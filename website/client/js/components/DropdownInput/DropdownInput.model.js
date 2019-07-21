import properties from '../../../../websiteUtils/properties.json';

const {base_url, routes} = properties;

export const model = {
    state: {
        options: "",
        value: '',
        error: false,
        success: false
    },
    generalDialog: {
        errorTitle: "Error!",
        errorText: "Oops! Adding your friend didn't quite work...",
        friendAddTitle: "Friend was added",
        friendAddText: "You've added a friend successfully!"
    },
    routes: {
        addFriendById: `${base_url}${routes.add_friend_by_id}`,
        getUserById: `${base_url}${routes.get_user_by_id}`
    }
};