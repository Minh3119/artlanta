import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [moneyLimit, setMoneyLimit] = useState("");
  const [activeQuickAmount, setActiveQuickAmount] = useState(null);
  const [eKYC, setEKYC] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/checkMoneyLimit",
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!data.isLogin) {
          navigate("/");
        } else {
          setMoneyLimit(data.limitMoney);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const checkEKYC = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/check/eKYC",
          {
            credentials: "include",
            method: "POST",
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        if (data.isKYC) {
          setEKYC(true);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkEKYC();
  }, []);

  const handleWithdrawSubmit = async () => {
    try {
      if (!eKYC) {
        toast.error("Bạn cần xác minh eKYC trước khi rút tiền.");
        return;
      }

      const withdrawAmount = parseInt(amount);
      if (isNaN(withdrawAmount) || withdrawAmount < 100000) {
        toast.error("Số tiền rút tối thiểu là 100.000 VND.");
        return;
      }

      const res = await fetch("http://localhost:9999/backend/api/withdraw", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: withdrawAmount }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.info(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  };

  const handleSendLink = async () => {
    try {
      const res = await fetch(
        "http://localhost:9999/backend/api/stripe/onboardinglink",
        {
            credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.info(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const quickAmounts = [
    { label: "100K", value: 100000 },
    { label: "200K", value: 200000 },
    { label: "500K", value: 500000 },
    { label: "1M", value: 1000000 },
  ];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setActiveQuickAmount(value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setActiveQuickAmount(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💰 Rút Tiền</h1>
          <p className="text-gray-600">Nhập số tiền bạn muốn rút</p>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8 text-center">
          <div className="text-sm text-gray-600 mb-2">
            Hạn mức còn lại hôm nay
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {moneyLimit} VND
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số tiền muốn rút (VNĐ)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Nhập số tiền..."
              min="1000"
              step="1000"
              className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              Số tiền tối thiểu: 100.000 VNĐ
            </div>
            <button
              className="text-xs text-indigo-500 mt-1 hover:underline"
              onClick={handleSendLink}
            >
              🔗 Lấy tài khoản nhận tiền Stripe của bạn
            </button>

            <div className="flex gap-2 mt-4 flex-wrap">
              {quickAmounts.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleQuickAmount(value)}
                  className={`flex-1 min-w-20 py-2 px-3 text-sm border-2 rounded-lg transition-all duration-300 hover:-translate-y-1 ${
                    activeQuickAmount === value
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-indigo-500 hover:text-indigo-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleWithdrawSubmit}
            className="w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:-translate-y-1 hover:shadow-lg"
          >
            🚀 Rút Tiền Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
