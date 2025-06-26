import React, { useEffect, useState } from 'react';
import "../../styles/Infobox.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';

const PaymentStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9999/backend/api/admin/payment" , {
    credentials: "include"
  })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch dashboard data", err));
  }, []);

  if (!stats) return <div>Loading...</div>;
  

const WeeklyRevenueChart = ({ data }) => {
  const weeklyData = Object.entries(data).map(([week, value]) => ({
    name: week,
    revenue: value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={weeklyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const MonthlyRevenueChart = ({ data }) => {
  const monthlyData = Object.entries(data).map(([month, value]) => ({
    name: month,
    revenue: value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
 

  


  const metrics = [
    {
      title: "Total Balance ($)",
      value: stats.totalBalance,
      icon: "💸",
      color: "bg-cyan",
      position: { left: '7.5px', top: '32px' }
    },
    {
      title: "Total Transaction Amount ($)",
      value: stats.totalTransactionAmount,
      icon: "💰",
      color: "bg-green",
      position: { left: '421px', top: '32px' }
    },
    {
      title: "Successful Transaction Count",
      value: stats.successfulTransactionCount,
      icon: "✅",
      color: "bg-yellow",
      position: { left: '834.5px', top: '32px' }
    },
    {
      title: "User Conversion Rate",
      value: `${(stats.userConversionRate * 100).toFixed(2)}%`,
      icon: "📈",
      color: "bg-red",
      position: { left: '1248px', top: '32px' }
    },
    {
      title: "ARPU (Average Revenue P/User) ($)",
      value: stats.arpu,
      icon: "📨",
      color: "bg-cyan",
      position: { left: '7.5px', top: '160px' }
    },
    {
      title: "Paying Users",
      value: stats.usersWithPayment,
      icon: "🧾",
      color: "bg-yellow",
      position: { left: '834.5px', top: '160px' }
    },
    {
      title: "LTV (Lifetime Value)($)",
      value: stats.ltv,
      icon: "📊",
      color: "bg-red",
      position: { left: '1248px', top: '160px' }
    },
    {
      title: "Avg Transaction per Paying User",
      value: 1,
      icon: "📂",
      color: "bg-green",
      position: { left: '421px', top: '160px' }
    },
     {
      title: "Top 1 User By Total Amount",
      value: stats.topUserByTotalAmount.Username,
      icon: "📨",
      color: "bg-cyan",
      position: { left: '7.5px', top: '288px' }
    },
    {
      title: "Top 1 Payment Method,",
      value: stats.topPaymentMethod,
      icon: "🧾",
      color: "bg-yellow",
      position: { left: '834.5px', top: '288px' }
    },
    {
      title: "Top 1 Transaction Month",
      value: stats.topTransactionMonth,
      icon: "📊",
      color: "bg-red",
      position: { left: '1248px', top: '288px' }
    },
    {
      title: "Top 1 Transaction",
      value: stats.topTransaction.Method +  ' - ' + stats.topTransaction.Username + ' - ' + stats.topTransaction.Amount, 
      icon: "📂",
      color: "bg-green",
      position: { left: '421px', top: '288px' }
    }
    
  ];

  return (
    <div className="section">
      <div className="heading5-info-box">Payment Statistics</div>

      {metrics.map((metric, index) => (
        <div
          key={index}
          className="background-shadow"
          style={{ position: 'absolute', ...metric.position }}
        >
          <div className={`background ${metric.color}`}>
            <div className="symbol">{metric.icon}</div>
          </div>
          <div className="container">
            <div className="info-title">{metric.title}</div>
            <div className="info-value">{metric.value}</div>
          </div>
        </div>
        
      ))}
      <div className="dashboard-row" style={{marginTop:'398px'}}>
      <section className="card visitors" >
                        <header className="card__header">
                            <h3>Weekly Revenue($)</h3>
                        </header>
                        <div className="card__content">
                            <div className="stat total">
                            </div>
                            <div className="stat stat--percent">
                            
                            </div>
                             <WeeklyRevenueChart data={stats.weeklyRevenue} />
                        </div>    
                    </section>
                    <section className="card visitors">
                        <header className="card__header">
                            <h3>Monthly Revenue($)</h3>
                        </header>
                        <div className="card__content">
                            <div className="stat total">
                                <div className="stat__number"></div>
                            </div>
                            <div className="stat stat--percent">
                                <i className="fas fa-arrow-up"></i>
                                
                            </div>
                            <MonthlyRevenueChart data={stats.monthlyRevenue} />
                        </div>    
                    </section>
                    </div>
                    
                    <div className="dashboard-row" style={{marginTop:''}}>
      <section className="card visitors">
  <header className="card__header">
    <h3>Recent Transactions</h3>
  </header>
  <div className="card__content">
    <table className="styled-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Amount($)</th>
          <th>Method</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {stats.recentTransactions.map((tx) => (
          <tr key={tx.TransactionID}>
            <td>{tx.Username}</td>
            <td>{tx.Amount.toLocaleString()}</td>
            <td style={{ textTransform: 'capitalize' }}>{tx.Method}</td>
            <td>{new Date(tx.CreatedAt).toLocaleString('vi-VN')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

                    <section className="card visitors">
  <header className="card__header">
    <h3>Top Users By Balance</h3>
  </header>
  <div className="card__content">
    <table className="styled-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Balance($)</th>
        </tr>
      </thead>
      <tbody>
        {stats.topUsersByBalance.map((user) => (
          <tr key={user.UserID}>
            <td>{user.Username}</td>
            <td>{user.Balance.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

                    </div>
    </div>
  );
};

export default PaymentStats;
