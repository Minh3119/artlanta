import { useState } from "react";
import { toast } from "react-toastify";
import PayPalPaymentMenu from "./PayPalPaymentMenu";
import StripePaymentMenu from "./StripePaymentMenu";
import VNPayPaymentMenu from "./VNPayPaymentMenu";

export default function PaymentAmountStep({ method, onBack }) {
  const [amount, setAmount] = useState("");
  const [validated, setValidated] = useState(false);

  const isUSD = method === "paypal" || method === "stripe";
  const currency = isUSD ? "USD" : "VNĐ";

  const validateAndSubmit = () => {
    const num = parseFloat(amount);

    if (isNaN(num)) {
      toast.error("Vui lòng nhập một số hợp lệ.");
      return;
    }
    if (isUSD && num < 5) {
      toast.warn("Số tiền phải lớn hơn 5 USD.");
      return;
    }
    if (!isUSD && num < 10000) {
      toast.warn("Số tiền phải lớn hơn 10,000 VNĐ.");
      return;
    }

    toast.success("Xác thực thành công. Đang xử lý thanh toán...");
    setValidated(true);
  };

  return (
    <div className="payment-amount-step">
      <p>Nhập số tiền muốn nạp ({currency}):</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setValidated(false); // reset lại nếu người dùng sửa
        }}
        placeholder={isUSD ? "Lớn hơn 5 USD" : "Lớn hơn 10,000 VNĐ"}
      />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={onBack}>Quay lại</button>
        <button onClick={validateAndSubmit}>Xác thực</button>
      </div>

      {method === "paypal" && validated && (
        <div style={{ marginTop: "20px" }}>
          <PayPalPaymentMenu amountUSD={parseFloat(amount)} />
        </div>
      )}

      {method === "stripe" && validated && (
        <div style={{ marginTop: "20px" }}>
          <StripePaymentMenu amountUSD={parseFloat(amount)} />
        </div>
      )}

      {method === "vnpay" && validated && (
        <div style={{ marginTop: "20px" }}>
          <VNPayPaymentMenu amountVND={parseInt(amount)} />
        </div>
      )}
    </div>
  );
}
