import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Fetch analytics data from the backend
  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.get();
      // The response contains pre-calculated stats: booksPerMonth, genreDistribution, etc.
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) return <div>Error loading data</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Reading Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Books Read</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalRead}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Average Rating</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.averageRating.toFixed(1)} / 5</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Reviews</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalReviews}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Books per Month Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Books Read per Month</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.booksPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis allowDecimals={false} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                  itemStyle={{ color: '#F9FAFB' }}
                />
                <Legend />
                <Bar dataKey="count" name="Books Read" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Genre Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.genreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} 
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {data.genreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                  itemStyle={{ color: '#F9FAFB' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
