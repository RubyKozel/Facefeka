import properties from '../../../../websiteUtils/properties.json';

const {base_url, routes} = properties;

export const model = {
    state: {
        jsxComments: [],
        error: false
    },
    generalDialog: {
        title: "Error!",
        text: "Opps! there was an error in your last action..."
    },
    routes: {
        getPostByIdURL: `${base_url}${routes.get_post_by_id}`
    }
};