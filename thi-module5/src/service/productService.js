import axios from "axios";
const URL = "http://localhost:3000/products";

export const getAllProducts = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};