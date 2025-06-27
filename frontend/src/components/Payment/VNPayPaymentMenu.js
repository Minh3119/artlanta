import { useEffect } from "react";
import { toast } from "react-toastify";

export default function VNPayPaymentMenu({ amountVND }) {
  useEffect(() => {
    const initiateVNPayPayment = async () => {
      try {
        const response = await fetch("http://localhost:9999/backend/api/payment/vnpay/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ amount: amountVND }),
        });

        const data = await response.json();

        if (data.paymentUrl) {
          console.log("Redirecting to:", data.paymentUrl);
          window.location.href = data.paymentUrl;
        } else if (data.error) {
          toast.error("Lỗi: " + data.error);
        } else {
          toast.error("Không tạo được link thanh toán VNPAY.");
        }
      } catch (error) {
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