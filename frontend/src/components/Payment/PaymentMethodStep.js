import paypalImg from "../../assets/images/paypal.webp";
import stripeImg from "../../assets/images/stripe.jpg";
import vnpayImg from "../../assets/images/vnpay.png";
import zaloImg from "../../assets/images/zalopay.webp";
import React, { useState, useEffect } from "react";

export default function PaymentMethodStep({ onSelectMethod }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:9999/backend/api/wallet", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.balance) {
          setBalance(parseInt(data.balance));
        } else {
          setBalance(0);
        }
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
        setBalance(0);
      }
    };
    fetchBalance();
  }, []);

  const methods = [
    { id: "zalo", name: "ZaloPay", img: zaloImg },
    { id: "vnpay", name: "VNPay", img: vnpayImg },
    { id: "paypal", name: "PayPal", img: paypalImg },
    { id: "stripe", name: "Stripe", img: stripeImg },
  ];

  return (
    <>
      <div className="balance-container">
        <p className="balance-title">Số dư tài khoản của bạn</p>
        <p className="balance-desc">{balance} VND</p>
      </div>
      <p className="payment-methods__desc">
        Chọn hình thức thanh toán vào tài khoản của bạn.
      </p>
      <div className="payment-methods">
        {methods.map((method) => (
          <div
            key={method.id}
            className="method-item"
            onClick={() => onSelectMethod(method.id)}
          >
            <img src={method.img} alt={method.name} />
            <p>{method.name}</p>
          </div>
        ))}
      </div>
    </>
  );
}
