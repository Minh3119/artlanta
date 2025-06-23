import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VNPayPaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVNPayReturn = async () => {
      const params = new URLSearchParams(location.search);
      const txnRef = params.get("vnp_TxnRef");
      const amount = params.get("vnp_Amount");
      const responseCode = params.get("vnp_ResponseCode");

      if (!txnRef || !amount || !responseCode) {
        toast.error("Thiếu thông tin giao dịch.");
        navigate("/payment");
        return;
      }

      try {
        const res = await fetch(`http://localhost:9999/backend/api/payment/vnpay/return?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.status === "PAID") {
          toast.success("Nạp tiền thành công!");
        } else {
          toast.error(data.message || "Thanh toán thất bại.");
        }
      } catch (error) {
        toast.error("Không thể xác nhận thanh toán.");
      } finally {
        navigate("/payment");
      }
    };

    handleVNPayReturn();
  }, [location.search, navigate]);

  return <p>Đang xác nhận thanh toán với VNPAY...</p>;
}