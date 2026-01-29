import {getToken} from "../utils/auth";
const BACKEND_URL = process.env.REACT_APP_API_URL;
const token = getToken();
const adminOrderApi = {
    getAllOrders: async (params) => {
        let api = `${BACKEND_URL}/admin/orders`;
        const queryParams = [];

        // Thêm các tham số vào URL
        if (params.page) queryParams.push(`page=${params.page}`);
        if (params.size) queryParams.push(`size=${params.size}`);
        if (params.keyword) queryParams.push(`keywordCustomerName=${params.keyword}`);
        if (params.status) queryParams.push(`status=${params.status}`);

        if (queryParams.length > 0) {
            api += `?${queryParams.join('&')}`;
        }

        console.log(api);

        const res = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        return json;
    },

    acceptOrder: async (orderId) => {
        const res = await fetch(`${BACKEND_URL}/admin/orders/${orderId}/accept`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    rejectOrder: async (orderId, reason) => {
        const res = await fetch(`${BACKEND_URL}/admin/orders/${orderId}/reject?reason=${reason}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    confirmShipping: async (orderId) => {
        const res = await fetch(`${BACKEND_URL}/admin/orders/${orderId}/confirmShipping`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    }


}
export default adminOrderApi;