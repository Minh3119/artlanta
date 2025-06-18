import paypalImg from "../../assets/images/paypal.webp";
import stripeImg from "../../assets/images/stripe.jpg";
import vnpayImg from "../../assets/images/vnpay.png";
import zaloImg from "../../assets/images/zalopay.webp";

export default function PaymentMethodStep({ onSelectMethod }) {
  const methods = [
    { id: "zalo", name: "ZaloPay", img: zaloImg },
    { id: "vnpay", name: "VNPay", img: vnpayImg },
    { id: "paypal", name: "PayPal", img: paypalImg },
    { id: "stripe", name: "Stripe", img: stripeImg },
  ];

  return (
    <>
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
