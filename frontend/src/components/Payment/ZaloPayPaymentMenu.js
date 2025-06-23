import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ZaloPayPaymentMenu({ amountVND }) {
  useEffect(() => {
    const initiateZaloPayPayment = async () => {
      try {
        const response = await fetch("http://localhost:9999/backend/api/payment/zalopay/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ amount: amountVND }),
        });

        const data = await response.json();

        if (data.paymentUrl) {
          window.location.href = data.paymentUrl; 
        } else {
          toast.error(data.error || "Không tạo được link thanh toán ZaloPay.");
        }
      } catch (error) {
        toast.error("Lỗi kết nối đến máy chủ ZaloPay.");
        console.error("ZaloPay error:", error);
      }
    };

    initiateZaloPayPayment();
  }, [amountVND]);

  return (
    <div>
      <p>Đang chuyển hướng sang ZaloPay...</p>
    </div>
  );
}