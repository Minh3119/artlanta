import { useEffect } from "react";
import { useSearchParams,useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");
        if (!token) return;

        fetch(`http://localhost:9999/backend/api/capture-paypal-order?token=${token}`)
            .then(res => res.json())
            .then(data => { 
                if (data.status === "COMPLETED") {
                    navigate("/", { state: { success: "Thanh toán thành công!" } });
                } else {
                    navigate("/", { state: { error: "Thanh toán chưa hoàn tất." } });
                    console.log(data);
                }
            })
            .catch(err => {
                navigate("/", { state: { error: "Có lỗi xảy ra khi xác nhận đơn hàng." } });
            });
    }, []);

    return (
        <div>
            <h1>Đang xử lý đơn hàng...</h1>
        </div>
    );
}
