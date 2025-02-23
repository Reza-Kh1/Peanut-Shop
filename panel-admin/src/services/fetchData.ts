import axios from "axios"
const getAllUser = async (query: string) => {
    const url = new URLSearchParams(query);
    const { data } = await axios.get(`user?${url}`);
    return data;
};
export default getAllUser