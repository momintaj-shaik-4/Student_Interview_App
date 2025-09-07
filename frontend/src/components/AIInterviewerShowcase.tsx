import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Code, 
  Shield, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  Brain,
  Zap,
  Star,
  Clock
} from 'lucide-react';

interface AIInterviewer {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  skills: string[];
  duration: string;
  credits: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
}

const AIInterviewerShowcase: React.FC = () => {
  const aiInterviewers: AIInterviewer[] = [
    {
      id: 'software-engineer',
      title: 'AiRo AI Interviewer - Software Engineer',
      shortTitle: 'Software Engineer AI',
      description: 'Master coding interviews with our AI interviewer specialized in algorithms, system design, and software engineering principles.',
      icon: <Code className="h-6 w-6" />,
      color: 'bg-blue-500',
      skills: ['Algorithms', 'Data Structures', 'System Design', 'OOP', 'Database Design'],
      duration: '30-45 min',
      credits: 5,
      difficulty: 'Expert'
    },
    {
      id: 'cybersecurity',
      title: 'AiRo AI Interviewer - Cybersecurity',
      shortTitle: 'Cybersecurity AI',
      description: 'Prepare for security roles with AI interviewer trained in threat analysis, compliance frameworks, and security protocols.',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-red-500',
      skills: ['Threat Analysis', 'Security Protocols', 'Compliance', 'Risk Assessment', 'Incident Response'],
      duration: '35-50 min',
      credits: 5,
      difficulty: 'Expert'
    },
    {
      id: 'finance',
      title: 'AiRo AI Interviewer - Finance',
      shortTitle: 'Finance AI',
      description: 'Excel in finance interviews with AI expert in financial modeling, risk assessment, and market analysis.',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-green-500',
      skills: ['Financial Modeling', 'Risk Assessment', 'Market Analysis', 'Valuation', 'Portfolio Management'],
      duration: '40-55 min',
      credits: 5,
      difficulty: 'Expert'
    },
    {
      id: 'product-engineer',
      title: 'AiRo AI Interviewer - Product Engineer',
      shortTitle: 'Product Engineer AI',
      description: 'Ace product engineering interviews with AI focused on product development, user experience, and technical strategy.',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-purple-500',
      skills: ['Product Strategy', 'User Experience', 'Technical Architecture', 'Agile Methodology', 'Stakeholder Management'],
      duration: '35-50 min',
      credits: 5,
      difficulty: 'Expert'
    },
    {
      id: 'business-analyst',
      title: 'AiRo AI Interviewer - Business Analyst',
      shortTitle: 'Business Analyst AI',
      description: 'Succeed in business analyst interviews with AI specialized in data analysis, process improvement, and stakeholder management.',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-orange-500',
      skills: ['Data Analysis', 'Process Improvement', 'Requirements Gathering', 'Stakeholder Management', 'Business Intelligence'],
      duration: '30-45 min',
      credits: 5,
      difficulty: 'Expert'
    },
    {
      id: 'human-resources',
      title: 'AiRo AI Interviewer - Human Resources',
      shortTitle: 'Human Resources AI',
      description: 'Prepare for HR interviews with AI trained in talent acquisition, employee relations, and organizational development.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-pink-500',
      skills: ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'HR Policies', 'Organizational Development'],
      duration: '25-40 min',
      credits: 5,
      difficulty: 'Expert'
    },
    {
      id: 'ai-ml',
      title: 'AiRo AI Interviewer - AI/ML',
      shortTitle: 'AI/ML Specialist',
      description: 'Master AI/ML interviews with AI expert in machine learning, deep learning, and artificial intelligence concepts.',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-indigo-500',
      skills: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Data Science', 'AI Ethics'],
      duration: '45-60 min',
      credits: 5,
      difficulty: 'Expert'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Brain className="h-6 w-6" />
            <span className="font-bold text-lg">Meet Your AI Interview Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Specialized AI Interviewers
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Our AI interviewers are domain experts trained specifically for each field. 
            Each interviewer provides realistic, challenging questions tailored to industry standards and best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {aiInterviewers.map((interviewer) => (
            <Card key={interviewer.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 ${interviewer.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                    {interviewer.icon}
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Expert
                    </Badge>
                    <CardTitle className="text-lg leading-tight text-slate-900">
                      {interviewer.shortTitle}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-slate-600 leading-relaxed">
                  {interviewer.description}
                </CardDescription>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Skills Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {interviewer.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{interviewer.credits} credits</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{interviewer.duration}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(interviewer.difficulty)}`}>
                    <Star className="h-3 w-3 mr-1" />
                    {interviewer.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Start Your AI Interview Journey?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Choose your specialized AI interviewer and get expert-level preparation for your next interview.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                Choose AI Interviewer
              </button>
              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewerShowcase;
