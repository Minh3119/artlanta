import React, { useEffect, useState } from "react";

export default function HistoryPayment() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/paymentHistory",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-4">
      <div className="history-container">
        <h2 className="text-xl font-bold mb-4">Biến động số dư</h2>
        
      </div>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Currency</th>
            <th className="border px-4 py-2">Method</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="border px-4 py-2">{tx.id}</td>
              <td className="border px-4 py-2">{tx.amount}</td>
              <td className="border px-4 py-2">{tx.currency}</td>
              <td className="border px-4 py-2">{tx.paymentMethod}</td>
              <td className="border px-4 py-2">{tx.status}</td>
              <td className="border px-4 py-2">
                {tx.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
