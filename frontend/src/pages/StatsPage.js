import React, { useState, useEffect } from 'react';
import { getStats, getHistory } from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function StatsPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const historyResponse = await getHistory();
      
      setHistory(historyResponse.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter history based on time range
  const filteredHistory = history.filter(item => {
    if (timeRange === 'all') return true;
    
    const now = new Date();
    const itemDate = new Date(item.timestamp);
    const diffHours = (now - itemDate) / (1000 * 60 * 60);
    
    if (timeRange === '24h') return diffHours <= 24;
    if (timeRange === '7d') return diffHours <= 24 * 7;
    if (timeRange === '30d') return diffHours <= 24 * 30;
    
    return true;
  });

  // Prepare chart data
  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Predictions',
        data: [
          filteredHistory.filter(h => h.gender === 'Male').length,
          filteredHistory.filter(h => h.gender === 'Female').length
        ],
        backgroundColor: [
          'rgba(102, 126, 234, 0.7)',
          'rgba(118, 75, 162, 0.7)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const dowryCategoryChartData = {
    labels: ['High Dowry', 'Low/Medium Dowry'],
    datasets: [
      {
        label: 'Categories',
        data: [
          filteredHistory.filter(h => h.prediction.predicted_category === 'High Dowry').length,
          filteredHistory.filter(h => h.prediction.predicted_category === 'Low/Medium Dowry').length
        ],
        backgroundColor: [
          'rgba(78, 205, 196, 0.7)',
          'rgba(255, 107, 107, 0.7)'
        ],
        borderColor: [
          'rgba(78, 205, 196, 1)',
          'rgba(255, 107, 107, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Prepare appearance score distribution
  const scoreRanges = [
    { label: '4-5', min: 4, max: 5 },
    { label: '5-6', min: 5, max: 6 },
    { label: '6-7', min: 6, max: 7 },
    { label: '7-8', min: 7, max: 8 },
    { label: '8-9', min: 8, max: 9 },
    { label: '9-10', min: 9, max: 10 }
  ];

  const scoreDistributionData = {
    labels: scoreRanges.map(r => r.label),
    datasets: [
      {
        label: 'Predictions',
        data: scoreRanges.map(range => 
          filteredHistory.filter(h => 
            h.appearanceScore >= range.min && h.appearanceScore < range.max
          ).length
        ),
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2
      }
    ]
  };

  // Calculate average dowry by gender
  const avgDowryByGender = {
    Male: filteredHistory.filter(h => h.gender === 'Male').length > 0 ?
      filteredHistory.filter(h => h.gender === 'Male').reduce((sum, h) => sum + h.prediction.estimated_dowry_amount, 0) /
      filteredHistory.filter(h => h.gender === 'Male').length : 0,
    Female: filteredHistory.filter(h => h.gender === 'Female').length > 0 ?
      filteredHistory.filter(h => h.gender === 'Female').reduce((sum, h) => sum + h.prediction.estimated_dowry_amount, 0) /
      filteredHistory.filter(h => h.gender === 'Female').length : 0
  };

  const avgDowryChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Average Dowry (INR)',
        data: [avgDowryByGender.Male, avgDowryByGender.Female],
        backgroundColor: [
          'rgba(102, 126, 234, 0.7)',
          'rgba(118, 75, 162, 0.7)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="stats-page">
        <div className="container">
          <div className="text-center mt-5">
            <div className="spinner"></div>
            <p className="mt-3">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="container">
          <div className="alert alert-danger mt-4">
            {error}
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={fetchData}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="container">
        <div className="page-header text-center mb-4">
          <h1 className="page-title">System Statistics</h1>
          <p className="page-subtitle">Comprehensive analytics and insights</p>
        </div>

        {/* Time Range Filter */}
        <div className="time-range-filter mb-4 text-center">
          <div className="filter-buttons">
            <button
              className={`btn ${timeRange === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
            <button
              className={`btn ${timeRange === '24h' ? 'btn-primary' : 'btn-outline'} ml-2`}
              onClick={() => setTimeRange('24h')}
            >
              Last 24 Hours
            </button>
            <button
              className={`btn ${timeRange === '7d' ? 'btn-primary' : 'btn-outline'} ml-2`}
              onClick={() => setTimeRange('7d')}
            >
              Last 7 Days
            </button>
            <button
              className={`btn ${timeRange === '30d' ? 'btn-primary' : 'btn-outline'} ml-2`}
              onClick={() => setTimeRange('30d')}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards mb-4">
          <div className="row">
            <div className="col-md-3 col-6 mb-3">
              <div className="stats-card text-center p-3">
                <div className="stat-value text-primary">
                  {filteredHistory.length}
                </div>
                <div className="stat-label">Total Predictions</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="stats-card text-center p-3">
                <div className="stat-value text-primary">
                  {filteredHistory.filter(h => h.gender === 'Male').length}
                </div>
                <div className="stat-label">Male Predictions</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="stats-card text-center p-3">
                <div className="stat-value text-secondary">
                  {filteredHistory.filter(h => h.gender === 'Female').length}
                </div>
                <div className="stat-label">Female Predictions</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="stats-card text-center p-3">
                <div className="stat-value text-success">
                  {formatCurrency(
                    filteredHistory.reduce((sum, h) => sum + h.prediction.estimated_dowry_amount, 0) /
                    (filteredHistory.length || 1)
                  )}
                </div>
                <div className="stat-label">Avg Dowry Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="charts-row mb-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="chart-card card p-4">
                <h3 className="chart-title mb-3">Gender Distribution</h3>
                <div className="chart-container">
                  <Pie
                    data={genderChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="chart-card card p-4">
                <h3 className="chart-title mb-3">Dowry Categories</h3>
                <div className="chart-container">
                  <Pie
                    data={dowryCategoryChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-row mb-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="chart-card card p-4">
                <h3 className="chart-title mb-3">Appearance Score Distribution</h3>
                <div className="chart-container">
                  <Bar
                    data={scoreDistributionData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="chart-card card p-4">
                <h3 className="chart-title mb-3">Average Dowry by Gender</h3>
                <div className="chart-container">
                  <Bar
                    data={avgDowryChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="detailed-stats mb-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="stats-card p-4">
                <h3 className="mb-3">Gender Statistics</h3>
                <div className="stats-table">
                  <div className="stats-row">
                    <span>Male Predictions:</span>
                    <span>{filteredHistory.filter(h => h.gender === 'Male').length}</span>
                  </div>
                  <div className="stats-row">
                    <span>Female Predictions:</span>
                    <span>{filteredHistory.filter(h => h.gender === 'Female').length}</span>
                  </div>
                  <div className="stats-row">
                    <span>Male Average Dowry:</span>
                    <span>{formatCurrency(avgDowryByGender.Male)}</span>
                  </div>
                  <div className="stats-row">
                    <span>Female Average Dowry:</span>
                    <span>{formatCurrency(avgDowryByGender.Female)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="stats-card p-4">
                <h3 className="mb-3">Dowry Category Statistics</h3>
                <div className="stats-table">
                  <div className="stats-row">
                    <span>High Dowry:</span>
                    <span>{filteredHistory.filter(h => h.prediction.predicted_category === 'High Dowry').length}</span>
                  </div>
                  <div className="stats-row">
                    <span>Low/Medium Dowry:</span>
                    <span>{filteredHistory.filter(h => h.prediction.predicted_category === 'Low/Medium Dowry').length}</span>
                  </div>
                  <div className="stats-row">
                    <span>High Dowry Percentage:</span>
                    <span>{
                      ((filteredHistory.filter(h => h.prediction.predicted_category === 'High Dowry').length / (filteredHistory.length || 1)) * 100).toFixed(2)
                    }%</span>
                  </div>
                  <div className="stats-row">
                    <span>Average Confidence:</span>
                    <span>{
                      (filteredHistory.reduce((sum, h) => sum + (h.prediction.confidence || h.prediction.probability_high_dowry), 0) / (filteredHistory.length || 1) * 100).toFixed(2)
                    }%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
