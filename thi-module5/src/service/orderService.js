import axios from 'axios';
const API_URL = 'http://localhost:3000/order';

export async function getAllOders() {
    try {
        const response = await axios.get(API_URL);
        const orders = response.data;
        orders.sort((a, b) => a.totalAmount - b.totalAmount);
        return orders;
    } catch (error) {
        console.error('ko tìm thấy đơn hàng ', error);
        return [];
    }
}

export async function addOrder(orderData) {
    try {
        const response = await axios.post(API_URL, orderData);
        return response.data;
    } catch (error) {
        console.error('Không thể thêm đơn hàng ', error);
        return [];
    }
}