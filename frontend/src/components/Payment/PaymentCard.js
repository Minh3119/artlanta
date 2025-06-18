import { useState, useEffect } from "react";
import "../../styles/payment.css";
import { Link } from "react-router-dom";
import PaymentAmountStep from "./PaymentAmountStep";
import PaymentMethodStep from "./PaymentMethodStep";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentCard() {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState("");

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.classList.add("log-root");
    return () => root?.classList.remove("log-root");
  }, []);

  return (
    <div className="payment-card">
      <div className="header-payment">
        <div className="payment-logo">
          <Link to="/"><img src="./artlanta.svg" alt="Logo" /></Link>
        </div>
        <div className="payment-title__container">
          <p className="payment-title">Nạp tiền vào tài khoản của bạn</p>
        </div>
        <div className="payment-back">
          <Link to="/">Back</Link>
        </div>
      </div>

      {step === 1 && (
        <PaymentMethodStep
          onSelectMethod={(method) => {
            setSelectedMethod(method);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <PaymentAmountStep
          method={selectedMethod}
          onBack={() => setStep(1)}
        />
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}