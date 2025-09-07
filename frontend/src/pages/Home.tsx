import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Brain, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Target,
  TrendingUp,
  Code,
  BarChart3
} from 'lucide-react';
import AIInterviewerShowcase from '@/components/AIInterviewerShowcase';

const Home = () => {
  const aiInterviewers = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Software Engineer AI",
      description: "Master coding interviews with our AI interviewer specialized in algorithms, system design, and software engineering.",
      color: "bg-blue-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Cybersecurity AI",
      description: "Prepare for security roles with AI interviewer trained in threat analysis, compliance, and security protocols.",
      color: "bg-red-500"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Finance AI",
      description: "Excel in finance interviews with AI expert in financial modeling, risk assessment, and market analysis.",
      color: "bg-green-500"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Product Engineer AI",
      description: "Ace product interviews with AI focused on product development, user experience, and technical strategy.",
      color: "bg-purple-500"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Business Analyst AI",
      description: "Succeed in BA interviews with AI specialized in data analysis, process improvement, and stakeholder management.",
      color: "bg-orange-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Human Resources AI",
      description: "Prepare for HR interviews with AI trained in talent acquisition, employee relations, and organizational development.",
      color: "bg-pink-500"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI/ML Specialist",
      description: "Master AI/ML interviews with AI expert in machine learning, deep learning, and artificial intelligence concepts.",
      color: "bg-indigo-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Helped" },
    { number: "7", label: "AI Interviewers" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Available" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      content: "The Software Engineer AI interviewer was incredibly realistic. It asked the exact same questions I faced at Google. The feedback was detailed and helped me identify my weak areas.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager at Microsoft",
      content: "The Product Engineer AI interviewer prepared me perfectly for my Microsoft interview. The AI understood product strategy questions better than any human interviewer I've practiced with.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Cybersecurity Analyst at IBM",
      content: "The Cybersecurity AI interviewer was phenomenal. It covered threat analysis, compliance frameworks, and security protocols exactly like real industry interviews.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">InterviewPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Trusted by 10,000+ Students
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Master Your Next
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> AI Interview</span>
        </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Practice with our specialized AI interviewers trained in 7 different domains. 
            Get expert-level feedback and realistic interview experiences tailored to your field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* AI Interviewer Showcase */}
      <AIInterviewerShowcase />

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get started in minutes with our simple 4-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Profile", desc: "Sign up and complete your profile with your experience and skills", icon: <Users className="h-6 w-6" /> },
              { step: "2", title: "Choose AI Interviewer", desc: "Select from 7 specialized AI interviewers trained in different domains", icon: <Brain className="h-6 w-6" /> },
              { step: "3", title: "Upload CV", desc: "Upload your CV and get it analyzed by our AI for role mapping", icon: <FileText className="h-6 w-6" /> },
              { step: "4", title: "Start AI Interview", desc: "Purchase credits and begin your specialized AI interview practice", icon: <Play className="h-6 w-6" /> }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands of successful students who landed their dream jobs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-slate-600 italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-600 text-sm">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Brain className="h-5 w-5 text-white" />
            <span className="font-semibold text-white">AI-Powered Interview Preparation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have successfully prepared with our specialized AI interviewers. 
            Get expert-level feedback and realistic interview experiences tailored to your field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50">
                Choose Your AI Interviewer
                <Brain className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">InterviewPro</span>
              </div>
              <p className="text-slate-400">
                Empowering students to succeed in their career journey through AI-powered interview preparation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 InterviewPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;