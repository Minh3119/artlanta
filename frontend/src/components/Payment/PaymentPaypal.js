import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PaymentPaypal() {
    const handlePaypalClick = async () => {
        try {
            const response = await fetch("http://localhost:9999/backend/api/create-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: "10.00", 
                    currency: "USD"
                })
            });

            const data = await response.json();

            if (data.approvalUrl) {
                window.location.href = data.approvalUrl;
            } else {
                toast.error("Không lấy được approval URL từ PayPal.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng PayPal:", error);
            toast.error("Có lỗi xảy ra khi kết nối PayPal.");
        }
    };

    return (
        <div className="payment-social">
            <button className="payment-button paypal" onClick={handlePaypalClick}>
                Pay with PayPal
            </button>
            <ToastContainer />
        </div>
    );
}