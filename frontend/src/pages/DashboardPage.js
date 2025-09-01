import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const DashboardPage = () => {
  const navigate = useNavigate();

  // Mock data for demonstration
  const recentDownloads = [
    {
      id: 1,
      title: 'Amazing TikTok Video',
      platform: 'TikTok',
      quality: '720p',
      format: 'mp4',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      title: 'YouTube Tutorial',
      platform: 'YouTube',
      quality: '1080p',
      format: 'mp4',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Instagram Reel',
      platform: 'Instagram',
      quality: '720p',
      format: 'mp3',
      date: '2024-01-13',
      status: 'failed',
    },
  ];

  const stats = {
    totalDownloads: 47,
    thisMonth: 12,
    successRate: 94,
  };

  const getStatusBadge = status => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlatformIcon = platform => {
    const icons = {
      YouTube: '🎥',
      TikTok: '🎵',
      Instagram: '📷',
      Facebook: '👥',
    };
    return icons[platform] || '📱';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your download activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalDownloads}
            </div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.thisMonth}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.successRate}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6 sm:mb-8" padding="medium">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Quick Actions
              </h2>
              <p className="text-gray-600">
                Start a new download or manage your account
              </p>
            </div>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Button variant="primary" onClick={() => navigate('/')}>
                New Download
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Downloads */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Downloads
            </h2>
            <Button variant="ghost" size="small">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Video
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Platform
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Quality
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentDownloads.map(download => (
                  <tr
                    key={download.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {download.title}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {getPlatformIcon(download.platform)}
                        </span>
                        {download.platform}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {download.quality} {download.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(download.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(download.status)}
                    </td>
                    <td className="py-4 px-4">
                      {download.status === 'completed' ? (
                        <Button variant="ghost" size="small">
                          Download
                        </Button>
                      ) : download.status === 'failed' ? (
                        <Button variant="ghost" size="small">
                          Retry
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
