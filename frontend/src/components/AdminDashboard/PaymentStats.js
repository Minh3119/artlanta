import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter } from 'recharts';

const PaymentStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9999/backend/api/admin/payment", {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch dashboard data", err));
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  // Calculate meaningful metrics from raw data
  const calculateMetrics = () => {
    const transactions = stats.recentTransactions || [];
    const users = stats.topUsersByBalance || [];
    
    // Transaction timing analysis
    const transactionsByYear = transactions.reduce((acc, tx) => {
      const year = new Date(tx.CreatedAt).getFullYear();
      acc[year] = (acc[year] || 0) + tx.Amount;
      return acc;
    }, {});

    // User segmentation by balance
    const userSegments = {
      whale: users.filter(u => u.Balance >= 500000).length,
      premium: users.filter(u => u.Balance >= 100000 && u.Balance < 500000).length,
      standard: users.filter(u => u.Balance >= 10000 && u.Balance < 100000).length,
      basic: users.filter(u => u.Balance < 10000).length
    };

    // Payment method analysis
    const methodAnalysis = transactions.reduce((acc, tx) => {
      acc[tx.Method] = (acc[tx.Method] || 0) + tx.Amount;
      return acc;
    }, {});

    // Transaction size distribution
    const sizeDistribution = transactions.reduce((acc, tx) => {
      if (tx.Amount < 100) acc.micro++;
      else if (tx.Amount < 1000) acc.small++;
      else if (tx.Amount < 10000) acc.medium++;
      else acc.large++;
      return acc;
    }, { micro: 0, small: 0, medium: 0, large: 0 });

    // User concentration (Gini coefficient approximation)
    const totalBalance = users.reduce((sum, u) => sum + u.Balance, 0);
    const balanceConcentration = users.length > 0 ? 
      (users[0]?.Balance || 0) / totalBalance * 100 : 0;

    // Average transaction per user
    const avgTransactionPerUser = transactions.length / users.length;

    // Revenue velocity (transactions per day)
    const oldestTx = new Date(Math.min(...transactions.map(tx => new Date(tx.CreatedAt))));
    const newestTx = new Date(Math.max(...transactions.map(tx => new Date(tx.CreatedAt))));
    const daysDiff = Math.ceil((newestTx - oldestTx) / (1000 * 60 * 60 * 24)) || 1;
    const transactionVelocity = transactions.length / daysDiff;

    return {
      transactionsByYear,
      userSegments,
      methodAnalysis,
      sizeDistribution,
      balanceConcentration,
      avgTransactionPerUser,
      transactionVelocity,
      totalRevenue: transactions.reduce((sum, tx) => sum + tx.Amount, 0)
    };
  };

  const metrics = calculateMetrics();

  // Chart Components
  const UserSegmentChart = () => {
    const data = [
      { name: 'Whale (>$500K)', value: metrics.userSegments.whale, color: '#8B5CF6' },
      { name: 'Premium ($100K-$500K)', value: metrics.userSegments.premium, color: '#06B6D4' },
      { name: 'Standard ($10K-$100K)', value: metrics.userSegments.standard, color: '#10B981' },
      { name: 'Basic (<$10K)', value: metrics.userSegments.basic, color: '#F59E0B' }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} users`, name]} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const PaymentMethodRevenueChart = () => {
    const data = Object.entries(metrics.methodAnalysis).map(([method, amount]) => ({
      method: method.toUpperCase(),
      amount,
      percentage: ((amount / metrics.totalRevenue) * 100).toFixed(1)
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="method" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            formatter={(value, name) => [`$${value.toLocaleString()}`, 'Revenue']}
            labelFormatter={(label) => `Payment Method: ${label}`}
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
          />
          <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const TransactionSizeDistributionChart = () => {
    const data = [
      { size: 'Micro (<$100)', count: metrics.sizeDistribution.micro, color: '#EF4444' },
      { size: 'Small ($100-$1K)', count: metrics.sizeDistribution.small, color: '#F59E0B' },
      { size: 'Medium ($1K-$10K)', count: metrics.sizeDistribution.medium, color: '#10B981' },
      { size: 'Large (>$10K)', count: metrics.sizeDistribution.large, color: '#8B5CF6' }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="size" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            formatter={(value) => [`${value} transactions`, 'Count']}
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
          />
          <Area type="monotone" dataKey="count" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const BalanceConcentrationChart = () => {
    const data = stats.topUsersByBalance.slice(0, 8).map((user, index) => ({
      rank: index + 1,
      username: user.Username,
      balance: user.Balance,
      percentage: ((user.Balance / stats.totalBalance) * 100).toFixed(1)
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="rank" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            formatter={(value, name, props) => [
              name === 'balance' ? `$${value.toLocaleString()}` : value,
              name === 'balance' ? 'Balance' : 'Rank'
            ]}
            labelFormatter={(value) => `User: ${data[value-1]?.username}`}
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
          />
          <Scatter dataKey="balance" fill="#8B5CF6" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  // Enhanced metrics with business insights
  const enhancedMetrics = [
    {
      title: "Balance Concentration Risk",
      value: `${metrics.balanceConcentration.toFixed(1)}%`,
      subtitle: "Top user holds",
      icon: "⚠️",
      color: "from-red-500 to-red-600",
      insight: metrics.balanceConcentration > 30 ? "High risk" : "Healthy distribution"
    },
    {
      title: "Transaction Velocity",
      value: `${metrics.transactionVelocity.toFixed(1)}/day`,
      subtitle: "Average transactions",
      icon: "⚡",
      color: "from-blue-500 to-blue-600",
      insight: metrics.transactionVelocity > 1 ? "Active" : "Low activity"
    },
    {
      title: "User Engagement Rate",
      value: `${metrics.avgTransactionPerUser.toFixed(1)}`,
      subtitle: "Transactions per user",
      icon: "📊",
      color: "from-green-500 to-green-600",
      insight: metrics.avgTransactionPerUser > 1 ? "Engaged" : "Needs improvement"
    },
    {
      title: "Whale Users Impact",
      value: `${metrics.userSegments.whale}`,
      subtitle: "Users with >$500K",
      icon: "🐋",
      color: "from-purple-500 to-purple-600",
      insight: `${((metrics.userSegments.whale / stats.topUsersByBalance.length) * 100).toFixed(1)}% of user base`
    },
    {
      title: "Revenue Diversification",
      value: `${Object.keys(metrics.methodAnalysis).length}`,
      subtitle: "Payment methods",
      icon: "💳",
      color: "from-indigo-500 to-indigo-600",
      insight: Object.keys(metrics.methodAnalysis).length > 2 ? "Well diversified" : "Limited options"
    },
    {
      title: "Large Transaction Ratio",
      value: `${((metrics.sizeDistribution.large / stats.recentTransactions.length) * 100).toFixed(1)}%`,
      subtitle: "Transactions >$10K",
      icon: "💎",
      color: "from-yellow-500 to-yellow-600",
      insight: metrics.sizeDistribution.large > 0 ? "High-value users present" : "No large transactions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payment Analytics Dashboard</h1>
          <p className="text-gray-400">Advanced insights and business intelligence</p>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {enhancedMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center text-2xl`}>
                  {metric.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.subtitle}</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
              <div className={`text-sm px-3 py-1 rounded-full inline-block ${
                metric.insight.includes('High risk') || metric.insight.includes('Low') || metric.insight.includes('Needs') ? 
                'bg-red-900 text-red-200' : 
                metric.insight.includes('Healthy') || metric.insight.includes('Active') || metric.insight.includes('Well') ?
                'bg-green-900 text-green-200' :
                'bg-blue-900 text-blue-200'
              }`}>
                {metric.insight}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">User Segmentation by Balance</h3>
            <UserSegmentChart />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Revenue by Payment Method</h3>
            <PaymentMethodRevenueChart />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Transaction Size Distribution</h3>
            <TransactionSizeDistributionChart />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Balance Concentration Analysis</h3>
            <BalanceConcentrationChart />
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Recent High-Value Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-300">User</th>
                    <th className="text-right py-3 px-2 text-gray-300">Amount</th>
                    <th className="text-center py-3 px-2 text-gray-300">Method</th>
                    <th className="text-right py-3 px-2 text-gray-300">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions
                    .sort((a, b) => b.Amount - a.Amount)
                    .slice(0, 8)
                    .map((tx) => (
                    <tr key={tx.TransactionID} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-2 text-white">{tx.Username}</td>
                      <td className="py-3 px-2 text-right font-mono text-green-400">
                        ${tx.Amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.Method === 'vnpay' ? 'bg-blue-900 text-blue-200' :
                          tx.Method === 'stripe' ? 'bg-purple-900 text-purple-200' :
                          'bg-yellow-900 text-yellow-200'
                        }`}>
                          {tx.Method.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-gray-400">
                        {((tx.Amount / metrics.totalRevenue) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">User Wealth Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-300">Rank</th>
                    <th className="text-left py-3 px-2 text-gray-300">User</th>
                    <th className="text-right py-3 px-2 text-gray-300">Balance</th>
                    <th className="text-right py-3 px-2 text-gray-300">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topUsersByBalance.slice(0, 8).map((user, index) => (
                    <tr key={user.UserID} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-2 text-gray-400">#{index + 1}</td>
                      <td className="py-3 px-2 text-white">{user.Username}</td>
                      <td className="py-3 px-2 text-right font-mono text-blue-400">
                        ${user.Balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ((user.Balance / stats.totalBalance) * 100) > 20 ? 'bg-red-900 text-red-200' :
                          ((user.Balance / stats.totalBalance) * 100) > 10 ? 'bg-yellow-900 text-yellow-200' :
                          'bg-green-900 text-green-200'
                        }`}>
                          {((user.Balance / stats.totalBalance) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;