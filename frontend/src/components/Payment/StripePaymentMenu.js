import { useEffect } from "react";
import { toast } from "react-toastify";

export default function StripePaymentMenu({ amountUSD }) {
  const handleStripePayment = async () => {
    const res = await fetch("http://localhost:9999/backend/api/payment/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ amount: amountUSD }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; 
    } else {
      toast.error("Không thể tạo phiên thanh toán Stripe.");
    }
  };

  useEffect(() => {
    handleStripePayment(); 
  }, []);

  return <p>Đang chuyển đến Stripe...</p>;
}