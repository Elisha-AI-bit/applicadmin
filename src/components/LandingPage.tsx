import { useState } from 'react'
import { 
  GraduationCap, 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const LandingPage = () => {
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Student Management',
      description: 'Comprehensive student database with enrollment tracking, academic records, and profile management.'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Application Processing',
      description: 'Streamlined application workflow with automated document verification and status tracking.'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Academic Records',
      description: 'Digital transcript management with secure access and real-time grade updates.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into enrollment trends, academic performance, and institutional metrics.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security with role-based access control and data encryption.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Accessibility',
      description: 'Cloud-based solution ensuring uninterrupted access from anywhere, anytime.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Students Managed' },
    { number: '500+', label: 'Institutions' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Academic Director',
      institution: 'Tech University',
      content: 'This platform has revolutionized how we manage student applications. The efficiency gains have been remarkable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'IT Administrator',
      institution: 'State College',
      content: 'The most robust and user-friendly academic administration system we\'ve ever implemented.',
      rating: 5
    },
    {
      name: 'Prof. Emily Williams',
      role: 'Department Head',
      institution: 'Business School',
      content: 'Streamlined our entire workflow. From admissions to graduation, everything is now seamless.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container">
          <div className="flex-between py-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary animate-pulse" />
              <span className="text-xl font-bold text-foreground">ApplicAdmin</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">Sign In</button>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative">
          <div className="grid grid-2 items-center gap-12">
            <div className="animate-in slide-in-from-left duration-700">
              <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                Transform Academic Administration with
                <span className="gradient-text"> Smart Technology</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Streamline student management, automate application processing, and gain valuable insights 
                with our comprehensive academic administration platform.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="btn btn-primary btn-lg group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn btn-secondary btn-lg">
                  Book Demo
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block animate-in slide-in-from-right duration-700 delay-200">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500 rounded-2xl transform rotate-3 animate-pulse"></div>
                <div className="relative bg-card rounded-2xl shadow-2xl p-8 border">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 hover-lift">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Active Students</p>
                        <p className="text-2xl font-bold text-foreground">2,847</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 hover-lift">
                      <div className="w-12 h-12 bg-green-500/10 rounded-full flex-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Applications</p>
                        <p className="text-2xl font-bold text-foreground">1,234</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 hover-lift">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex-center">
                        <TrendingUp className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Success Rate</p>
                        <p className="text-2xl font-bold text-foreground">94.2%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Institution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to streamline academic administration 
              and enhance the educational experience.
            </p>
          </div>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex-center mx-auto mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Educational Institutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience with EduAdmin Pro.
            </p>
          </div>
          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-cyan-500 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Academic Administration?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions that have already streamlined their operations 
            with our innovative platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-3 rounded-lg text-gray-900 min-w-[300px]"
            />
            <button className="btn bg-white text-primary hover:bg-gray-100 btn-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-sm opacity-90">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8" />
                <span className="text-xl font-bold">EduAdmin Pro</span>
              </div>
              <p className="text-gray-400">
                Empowering educational institutions with innovative technology solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduAdmin Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
