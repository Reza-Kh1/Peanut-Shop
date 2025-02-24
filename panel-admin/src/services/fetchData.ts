import axios from "axios"
const getAllUser = async (query: string) => {
    const url = new URLSearchParams(query);
    const { data } = await axios.get(`user?${url}`);
    return data;
};
const getAllCategory = async () => {
    const { data } = await axios.get("category?admin=true");
    return data;
};
const getAllProduct = async (query: string) => {
    const url = new URLSearchParams(query);
    const { data } = await axios.get(`product?${url}`);
    return data;
};
export {
    getAllUser,
    getAllProduct,
    getAllCategory
}
