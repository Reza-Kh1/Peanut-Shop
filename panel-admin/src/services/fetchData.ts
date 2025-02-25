import axios from "axios";
const getAllUser = async (query: string) => {
  const url = new URLSearchParams(query);
  const { data } = await axios.get(`user?${url}`);
  return data;
};
const getAllCategory = async () => {
  const { data } = await axios.get("category?admin=true");
  return data;
};
const getAllDiscount = async () => {
  const { data } = await axios.get("discount");
  return data;
};
const getAllDiscountProduct = async () => {
  const { data } = await axios.get("discount?product=true");
  return data;
};
const getAllImage = async (query: string) => {
  const url = new URLSearchParams(query);
  const { data } = await axios.get(`upload?${url}`);
  return data;
};
const getAllProduct = async (query: string) => {
  const url = new URLSearchParams(query);
  const { data } = await axios.get(`product?${url}`);
  return data;
};
const getSingleProduct = async (slug: string) => {
  const { data } = await axios.get(`product/${slug}`);
  return data;
}
const getAllComment = async (query: string) => {
  const url = new URLSearchParams(query);
  const { data } = await axios.get(`comment?${url}`);
  return data;
}
const getSupport = async (query: string) => {
  const url = new URLSearchParams(query);
  const { data } = await axios.get(`support?${url}`);
  return data;
}
const getSingleChat = async (id: string) => {
  const { data } = await axios.get(`support?chatId=${id}`);
  return data;
}
export {
  getAllUser,
  getAllProduct,
  getAllCategory,
  getAllDiscount,
  getAllDiscountProduct,
  getAllImage,
  getSingleProduct,
  getAllComment,
  getSupport,
  getSingleChat
};
