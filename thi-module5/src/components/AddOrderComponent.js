import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addOrder } from "../service/orderService";
import { getAllProducts } from "../service/productService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddOrderComponent({ onOrderAdded }) { 

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productData = await getAllProducts();
                setProducts(productData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const formik = useFormik({
        initialValues: {
            code: '',
            startDate: '',
            totalAmount: 0,
            quantity: '',
            products: [{ product: '', quantity: '' }]
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Mã đơn hàng không được để trống."),
            startDate: Yup.date().required("Ngày bắt đầu không được để trống."),
            totalAmount: Yup.number().min(100, "Tổng số tiền phải lớn hơn hoặc bằng 100").required("Tổng số tiền không được để trống."),
            quantity: Yup.number().integer("Số lượng phải là số nguyên.").required("Số lượng không được để trống."),
            products: Yup.array().of(
                Yup.object({
                    product: Yup.string().required("Tên sản phẩm không được để trống."),
                    quantity: Yup.number().integer("Số lượng sản phẩm phải là số nguyên dương.").min(1, "Số lượng sản phẩm phải lớn hơn 0").required("Số lượng sản phẩm không được để trống.")
                })
            )
        })
    });

    const handleAddOrder = async () => {
        if (!formik.isValid) {
            toast.error("Vui lòng kiểm tra lại thông tin đơn hàng.");
            return;
        }
        try {
            const addedOrder = await addOrder(formik.values);
            if (onOrderAdded) {
                onOrderAdded(addedOrder);
            }
            toast.success("Đơn hàng đã được thêm thành công!");
            navigate("/order");
        } catch (error) {
            console.error("Error adding order:", error);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Thêm đơn hàng mới</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrder(); }}>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">Mã đơn hàng:</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control"
                    />
                    {formik.touched.code && formik.errors.code ? (
                        <div className="text-danger">{formik.errors.code}</div>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Ngày bắt đầu:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control"
                    />
                    {formik.touched.startDate && formik.errors.startDate ? (
                        <div className="text-danger">{formik.errors.startDate}</div>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="totalAmount" className="form-label">Tổng số tiền:</label>
                    <input
                        type="number"
                        id="totalAmount"
                        name="totalAmount"
                        value={formik.values.totalAmount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control"
                    />
                    {formik.touched.totalAmount && formik.errors.totalAmount ? (
                        <div className="text-danger">{formik.errors.totalAmount}</div>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Số lượng:</label>
                    <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control"
                    />
                    {formik.touched.quantity && formik.errors.quantity ? (
                        <div className="text-danger">{formik.errors.quantity}</div>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label className="form-label">Sản phẩm:</label>
                    {formik.values.products.map((product, index) => (
                        <div key={index} className="mb-2">
                            <select
                                name={`products[${index}].product`}
                                value={product.product}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-control mb-1"
                            >
                                <option value="">Chọn sản phẩm</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.name}>
                                        {prod.name}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.products && formik.touched.products[index] && formik.errors.products && formik.errors.products[index] && formik.errors.products[index].product ? (
                                <div className="text-danger">{formik.errors.products[index].product}</div>
                            ) : null}
                            <input
                                type="text"
                                name={`products[${index}].quantity`}
                                placeholder="Số lượng"
                                value={product.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-control mb-1"
                            />
                            {formik.touched.products && formik.touched.products[index] && formik.errors.products && formik.errors.products[index] && formik.errors.products[index].quantity ? (
                                <div className="text-danger">{formik.errors.products[index].quantity}</div>
                            ) : null}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary">
                    Thêm đơn hàng
                </button>
            </form>
        </div>
    );
}

export default AddOrderComponent;