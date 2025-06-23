import { useEffect } from "react";
import { toast } from "react-toastify";

export default function VNPayPaymentMenu({ amountVND }) {
  useEffect(() => {
    const initiateVNPayPayment = async () => {
      console.log("=== DEBUG FRONTEND ===");
      console.log("Amount VND:", amountVND);
      
      try {
        const response = await fetch("http://localhost:9999/backend/api/payment/vnpay/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ amount: amountVND }),
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (data.paymentUrl) {
          console.log("Redirecting to:", data.paymentUrl);
          window.location.href = data.paymentUrl;
        } else if (data.error) {
          console.log("Server error:", data.error);
          toast.error("Lỗi: " + data.error);
        } else {
          console.log("No paymentUrl in response:", data);
          toast.error("Không tạo được link thanh toán VNPAY.");
        }
      } catch (error) {
        toast.error("Lỗi kết nối đến máy chủ VNPAY.");
        console.error("VNPay Error:", error);
      }
    };

    initiateVNPayPayment();
  }, [amountVND]);

  return (
    <div>
      <p>Đang chuyển hướng sang VNPAY...</p>
    </div>
  );
}