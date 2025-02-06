import React, { useEffect, useState } from "react";
import { getAllOders } from "../service/orderService";
import { getAllProducts } from "../service/productService";
import { Link } from "react-router-dom";

function OrderListComponent() {
    const [orderList, setOrderList] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [productName, setProductName] = useState('');
    const [productNames, setProductNames] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await getAllOders();
                orders.sort((a, b) => a.totalAmount - b.totalAmount);
                setOrderList(orders);
                setFilteredOrders(orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                const names = products.map(product => product.name);
                setProductNames(names);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchOrders();
        fetchProducts();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

  const handleSearch = () => {
    const filtered = orderList.filter(order => 
        order.products && order.products.some(product => 
            product.product.toLowerCase() === productName.toLowerCase()
        )
    );
    setFilteredOrders(filtered);
};

    return (
        <div className="container">
            <h1 className="text-center mb-4">Danh sách đơn hàng</h1>
            <p className="text-center mb-4">
                <Link to="/order/add" className="btn btn-success">
                    Thêm mới sản phẩm
                </Link>
            </p>

            <div className="mb-4">
                <div className="row">
                    <div className="col">
                        <select
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Chọn tên sản phẩm</option>
                            {productNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <button onClick={handleSearch} className="btn btn-primary">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Ngày mua</th>
                        <th>Tổng số tiền</th>
                        <th>Số lượng</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng sản phẩm</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        order.products && order.products.map((product, idx) => (
                            <tr key={`${order.id}-${idx}`}>
                                <td>{index + 1}</td>
                                <td>{order.code}</td>
                                <td>{formatDate(order.startDate)}</td>
                                <td>{order.totalAmount}</td>
                                <td>{order.quantity}</td>
                                <td>{product.product}</td>
                                <td>{product.quantity}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderListComponent;