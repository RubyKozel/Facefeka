import {POST_FORM_DATA_AUTH} from "./requests";
import properties from "../../../websiteUtils/properties.json";
const {base_url} = properties;

const uploadImage = async (e, route) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    formData.append('file', files[0]);
    const response = await POST_FORM_DATA_AUTH(`${base_url}${route}`, formData);

    let picture = null;
    if (response.status && response.status === 200) {
        picture = (await response.json()).picture;
    } else {
        return Promise.reject();
    }
    return picture;
};

export default uploadImage;