import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function PayPalPaymentMenu({ amountUSD }) {
  const containerRef = useRef(null);
  const renderedRef = useRef(false); 

  useEffect(() => {
    const loadPayPalScript = () => {
      if (document.querySelector("script[src*='paypal.com/sdk/js']")) {
        renderButton();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=ARg3hiud5WjasqAbfCkmud6ur7jI-_B-iN4Ku_8ryrEXNZXYf7v6WaRGPRzns70OZFn68cd33teu1tuQ&currency=USD`;
      script.onload = renderButton;
      script.onerror = () => toast.error("Không thể tải PayPal SDK.");
      document.body.appendChild(script);
    };

    const renderButton = () => {
      if (!window.paypal || renderedRef.current || !containerRef.current) return;

      renderedRef.current = true;
      window.paypal.Buttons({
        createOrder: (_, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amountUSD } }],
          });
        },
        onApprove: async (_, actions) => {
          const details = await actions.order.capture();
          const orderId = details.id;

          const res = await fetch("http://localhost:9999/backend/api/payment/paypal/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ amount: amountUSD, orderID: orderId }),
          });

          const data = await res.json();
          if (data.success) {
            toast.success("Thanh toán thành công! Ví của bạn đã được cập nhật.");
          } else {
            toast.error("Thanh toán thất bại hoặc hết phiên đăng nhập.");
          }
        },
        onError: (err) => {
          toast.error("Lỗi khi xử lý PayPal: " + err.message);
        },
      }).render(containerRef.current);
    };

    loadPayPalScript();
  }, [amountUSD]); 

  return <div ref={containerRef}></div>;
}