import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { interviewAPI, rolesAPI, cvsAPI, walletAPI } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  ArrowLeft, 
  Brain, 
  Play, 
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  FileText,
  User,
  CreditCard,
  Star,
  Shield,
  DollarSign,
  Briefcase,
  TrendingUp,
  Users,
  Code,
  GraduationCap,
  Award,
  Timer,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Interview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedCV, setSelectedCV] = useState<string>('');
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('name');
    navigate('/login');
  }

  // Fetch user's selected roles
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['userRoles'],
    queryFn: () => rolesAPI.getUserRoles(),
  });

  // Fetch user's CVs
  const { data: userCVs, isLoading: cvsLoading } = useQuery({
    queryKey: ['userCVs'],
    queryFn: () => cvsAPI.getUserCVs(),
  });

  // Fetch wallet balance
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletAPI.getWallet(),
  });

  // Start interview mutation
  const startInterviewMutation = useMutation({
    mutationFn: (data: { role_id: number; cv_id?: number }) => interviewAPI.startInterview(data),
    onSuccess: (response) => {
      toast.success('AI Interview started successfully!');
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setShowStartDialog(false);
      setIsStarting(false);
      // Navigate to interview session
      navigate(`/interview/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to start interview');
      setIsStarting(false);
    }
  });

  const handleStartInterview = () => {
    if (!selectedRole) {
      toast.error('Please select an AI interviewer');
      return;
    }

    if ((wallet?.balance_credits || 0) < 5) {
      toast.error('Insufficient credits. You need at least 5 credits to start an interview.');
      return;
    }

    setShowStartDialog(true);
  };

  const confirmStartInterview = () => {
    setIsStarting(true);
    startInterviewMutation.mutate({
      role_id: parseInt(selectedRole),
      cv_id: selectedCV ? parseInt(selectedCV) : undefined
    });
  };

  const getRoleIcon = (roleName: string) => {
    const roleLower = roleName.toLowerCase();
    if (roleLower.includes('software') || roleLower.includes('engineer')) {
      return <Code className="h-5 w-5" />;
    } else if (roleLower.includes('cybersecurity') || roleLower.includes('security')) {
      return <Shield className="h-5 w-5" />;
    } else if (roleLower.includes('finance')) {
      return <DollarSign className="h-5 w-5" />;
    } else if (roleLower.includes('product')) {
      return <Briefcase className="h-5 w-5" />;
    } else if (roleLower.includes('business') || roleLower.includes('analyst')) {
      return <TrendingUp className="h-5 w-5" />;
    } else if (roleLower.includes('hr') || roleLower.includes('human')) {
      return <Users className="h-5 w-5" />;
    } else if (roleLower.includes('ai') || roleLower.includes('ml')) {
      return <Brain className="h-5 w-5" />;
    }
    return <Target className="h-5 w-5" />;
  };

  const getRoleColor = (roleName: string) => {
    const roleLower = roleName.toLowerCase();
    if (roleLower.includes('software') || roleLower.includes('engineer')) {
      return 'from-blue-500 to-blue-600';
    } else if (roleLower.includes('cybersecurity') || roleLower.includes('security')) {
      return 'from-red-500 to-red-600';
    } else if (roleLower.includes('finance')) {
      return 'from-green-500 to-green-600';
    } else if (roleLower.includes('product')) {
      return 'from-purple-500 to-purple-600';
    } else if (roleLower.includes('business') || roleLower.includes('analyst')) {
      return 'from-orange-500 to-orange-600';
    } else if (roleLower.includes('hr') || roleLower.includes('human')) {
      return 'from-pink-500 to-pink-600';
    } else if (roleLower.includes('ai') || roleLower.includes('ml')) {
      return 'from-indigo-500 to-indigo-600';
    }
    return 'from-gray-500 to-gray-600';
  };

  const availableRoles = userRoles?.roles || [];
  const availableCVs = userCVs?.cvs || [];
  const credits = wallet?.balance_credits || 0;

  if (rolesLoading || cvsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-center text-gray-600 mt-4">Loading AI interviewers...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Start AI Interview</h1>
              <p className="text-gray-600">Choose your AI interviewer and begin your specialized interview</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Interviewer Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Select AI Interviewer
                </CardTitle>
                <CardDescription>
                  Choose from your selected AI interviewers to begin your interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableRoles.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You haven't selected any AI interviewers yet. Please select AI interviewers first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableRoles.map((role: any) => (
                      <div
                        key={role.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedRole === role.id.toString()
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedRole(role.id.toString())}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(role.name)} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                            {getRoleIcon(role.name)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{role.name}</h3>
                            <p className="text-sm text-gray-600">AI Interviewer</p>
                          </div>
                          {selectedRole === role.id.toString() && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Cost: 5 credits</span>
                          <Badge variant="outline" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Expert Level
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CV Selection */}
            {availableCVs.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Select CV (Optional)
                  </CardTitle>
                  <CardDescription>
                    Choose a CV to provide context to your AI interviewer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedCV} onValueChange={setSelectedCV}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a CV or skip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No CV (Skip)</SelectItem>
                      {availableCVs.map((cv: any) => (
                        <SelectItem key={cv.id} value={cv.id.toString()}>
                          {cv.filename} - {formatDate(cv.created_at)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Interview Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="mr-2 h-5 w-5" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">30-45 minutes</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost</span>
                  <span className="text-sm font-medium">5 Credits</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Format</span>
                  <span className="text-sm font-medium">Video + Audio</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <span className="text-sm font-medium">8-12 Questions</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Webcam required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mic className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Microphone required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Stable internet connection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Quiet environment</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Detailed feedback report</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Skill assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Improvement suggestions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Interview recording</span>
                </div>
              </CardContent>
            </Card>

            {/* Start Interview Button */}
            <div className="space-y-4">
              <Button 
                onClick={handleStartInterview}
                disabled={!selectedRole || credits < 5 || isStarting}
                className="w-full"
                size="lg"
              >
                {isStarting ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start AI Interview
                  </>
                )}
              </Button>

              {credits < 5 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need at least 5 credits to start an interview. 
                    <Link to="/wallet" className="text-blue-600 hover:underline ml-1">
                      Buy credits
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/roles')} className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  Select More AI Interviewers
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Start Interview Confirmation Dialog */}
        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Confirm AI Interview Start
              </DialogTitle>
              <DialogDescription>
                You're about to start an AI interview. This will consume 5 credits from your wallet.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Interview Details:</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>• AI Interviewer: {availableRoles.find((r: any) => r.id.toString() === selectedRole)?.name}</div>
                  <div>• Duration: 30-45 minutes</div>
                  <div>• Cost: 5 credits</div>
                  <div>• Format: Video + Audio interview</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowStartDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmStartInterview}
                  disabled={isStarting}
                  className="flex-1"
                >
                  {isStarting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Interview;
