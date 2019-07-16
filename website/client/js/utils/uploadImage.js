import {POST_FORM_DATA_AUTH} from "./requests";
import properties from "../../../websiteUtils/properties.json";
const {base_url, routes} = properties;

const uploadImage = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    formData.append('file', files[0]);
    const response = await POST_FORM_DATA_AUTH(`${base_url}${routes.upload_theme_pic}`, formData);

    let profilePic = null;
    if (response.status && response.status === 200) {
        profilePic = (await response.json()).picture;
    } else {
        return Promise.reject();
    }
    return profilePic;
};

export default uploadImage;