import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { profileAPI, walletAPI, rolesAPI, cvsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  User, 
  CreditCard, 
  FileText, 
  Target, 
  Brain,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Settings,
  LogOut,
  Wallet,
  Briefcase,
  Upload,
  Play,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
  });

  // Fetch wallet data
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletAPI.getWallet,
  });

  // Fetch user roles
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['userRoles'],
    queryFn: rolesAPI.getUserRoles,
  });

  // Fetch user CVs
  const { data: userCVs, isLoading: cvsLoading } = useQuery({
    queryKey: ['userCVs'],
    queryFn: () => cvsAPI.getUserCVs(0, 5),
  });

  const handleLogout = async () => {
    try {
      await profileAPI.logout();
      localStorage.removeItem('access_token');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      localStorage.removeItem('access_token');
      navigate('/');
    }
  };

  const quickActions = [
    {
      title: 'Choose AI Interviewer',
      description: 'Select from 7 specialized AI interviewers',
      icon: <Brain className="h-5 w-5" />,
      link: '/roles',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    {
      title: 'View AI Persona',
      description: 'See your personalized AI profile',
      icon: <User className="h-5 w-5" />,
      link: '/persona',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    {
      title: 'Upload CV',
      description: 'Upload your CV for role mapping',
      icon: <Upload className="h-5 w-5" />,
      link: '/upload',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      title: 'Buy Credits',
      description: 'Purchase credits for AI interviews',
      icon: <CreditCard className="h-5 w-5" />,
      link: '/wallet',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      title: 'Start AI Interview',
      description: 'Begin specialized AI interview',
      icon: <Play className="h-5 w-5" />,
      link: '/interview',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      title: 'CV Screening',
      description: 'Get AI analysis of your CV',
      icon: <FileText className="h-5 w-5" />,
      link: '/screening',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    }
  ];

  const recentActivities = [
    { type: 'profile_update', message: 'Updated profile information', time: '2 hours ago', icon: <User className="h-4 w-4" /> },
    { type: 'ai_interviewer_selection', message: 'Selected Software Engineer AI Interviewer', time: '1 day ago', icon: <Brain className="h-4 w-4" /> },
    { type: 'cv_upload', message: 'Uploaded CV for AI analysis', time: '2 days ago', icon: <FileText className="h-4 w-4" /> },
    { type: 'credit_purchase', message: 'Purchased 50 credits for AI interviews', time: '3 days ago', icon: <CreditCard className="h-4 w-4" /> },
  ];

  if (profileLoading || walletLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">InterviewPro</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Wallet Balance */}
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">
                  {wallet?.balance_credits || 0} Credits
                </span>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {profile?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {profile?.user?.email || 'user@example.com'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.user?.name || 'User'}!
          </h1>
          <p className="text-slate-600">
            Ready to practice your next interview? Let's get started.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="cvs">CVs</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wallet?.balance_credits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Available for interviews
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Interviewers</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userRoles?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    AI interviewers selected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CVs Uploaded</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userCVs?.cvs?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Documents uploaded
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with these common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <div className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-white">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                          {action.icon}
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest platform activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                          <p className="text-xs text-slate-600">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                  <CardDescription>
                    Your current profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Name</span>
                      <span className="text-sm font-medium">{profile?.user?.name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Email</span>
                      <span className="text-sm font-medium">{profile?.user?.email || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Phone</span>
                      <span className="text-sm font-medium">{profile?.user?.phone || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">City</span>
                      <span className="text-sm font-medium">{profile?.user?.city || 'Not set'}</span>
                    </div>
                    <Link to="/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Selected Roles</CardTitle>
                    <CardDescription>
                      Job roles you've selected for interview practice
                    </CardDescription>
                  </div>
                  <Link to="/roles">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Roles
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {rolesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading roles...</p>
                  </div>
                ) : userRoles && userRoles.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userRoles.map((role: any) => (
                      <div key={role.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">{role.role_title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{role.role_description}</p>
                        <div className="flex flex-wrap gap-1">
                          {role.role_tags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No roles selected</h3>
                    <p className="text-slate-600 mb-4">Select job roles to start practicing interviews</p>
                    <Link to="/roles">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Select Roles
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cvs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Uploaded CVs</CardTitle>
                    <CardDescription>
                      Your uploaded CV documents
                    </CardDescription>
                  </div>
                  <Link to="/upload">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload CV
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {cvsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading CVs...</p>
                  </div>
                ) : Array.isArray(userCVs?.cvs) && userCVs.cvs.length > 0 ? (
                  <div className="space-y-4">
                    {userCVs.cvs.map((cv: any) => (
                      <div key={cv.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-slate-900">{cv.filename}</h3>
                            <p className="text-sm text-slate-600">
                              Uploaded {formatDate(cv.created_at)} • {(cv.size_bytes / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={cv.status === 'uploaded' ? 'default' : 'secondary'}>
                            {cv.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No CVs uploaded</h3>
                    <p className="text-slate-600 mb-4">Upload your CV to get started with role mapping</p>
                    <Link to="/upload">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload CV
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Your complete activity timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                        <p className="text-xs text-slate-600">{activity.time}</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;