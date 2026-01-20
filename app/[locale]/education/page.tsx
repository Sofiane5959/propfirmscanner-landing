'use client';

import Link from 'next/link';
import { 
  Home, ChevronRight, BookOpen, GraduationCap, Trophy, 
  CheckCircle2, Play, Clock, Users, Star, Lock,
  TrendingUp, Target, Shield, Brain, Zap, Award
} from 'lucide-react';

// =============================================================================
// COURSE DATA
// =============================================================================

const courses = [
  {
    id: 'beginner',
    title: 'Prop Firm Fundamentals',
    subtitle: 'For Beginners',
    price: 19.99,
    originalPrice: 49.99,
    badge: 'Best Value',
    badgeColor: 'bg-emerald-500',
    description: 'Everything you need to know to start your prop firm journey. Perfect for traders who are new to funded accounts.',
    duration: '4+ hours',
    lessons: 12,
    students: '2,400+',
    rating: 4.8,
    features: [
      'What are prop firms & how they work',
      'Understanding challenge rules',
      'Basic risk management',
      'Choosing your first prop firm',
      'Account setup walkthrough',
      'Common beginner mistakes to avoid',
      'Introduction to trading psychology',
      'Payout process explained',
    ],
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    icon: BookOpen,
  },
  {
    id: 'advanced',
    title: 'Prop Firm Mastery',
    subtitle: 'Advanced Strategies',
    price: 99.99,
    originalPrice: 199.99,
    badge: 'Most Popular',
    badgeColor: 'bg-yellow-500',
    description: 'Advanced strategies and techniques used by consistently funded traders. Take your prop firm trading to the next level.',
    duration: '12+ hours',
    lessons: 36,
    students: '890+',
    rating: 4.9,
    features: [
      'Advanced risk management systems',
      'Multi-account strategies',
      'Scaling funded accounts',
      'Drawdown optimization techniques',
      'Psychology of funded trading',
      'Building consistent edge',
      'News trading strategies',
      'EA & automation integration',
      'Tax optimization for traders',
      'Building a trading business',
    ],
    gradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    icon: Trophy,
  },
];

const benefits = [
  {
    icon: Play,
    title: 'Video Lessons',
    description: 'High-quality video content you can watch anytime',
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Join our private Discord with fellow traders',
  },
  {
    icon: Award,
    title: 'Certificate',
    description: 'Get certified upon course completion',
  },
  {
    icon: Zap,
    title: 'Lifetime Access',
    description: 'Access all updates and new content forever',
  },
];

const testimonials = [
  {
    name: 'Alex M.',
    role: 'Funded Trader',
    content: 'The beginner course gave me all the foundation I needed. Passed my first challenge within 2 weeks!',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'Full-time Trader',
    content: 'The advanced course transformed my approach to risk management. Now managing 3 funded accounts.',
    rating: 5,
  },
  {
    name: 'David R.',
    role: 'Part-time Trader',
    content: 'Worth every penny. The psychology module alone saved me from blowing multiple accounts.',
    rating: 5,
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <Link href="/" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
        <Home className="w-4 h-4" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-white">Education</span>
    </nav>
  );
}

function ComingSoonBadge() {
  return (
    <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-white font-bold text-lg mb-3 animate-pulse">
          <Lock className="w-5 h-5" />
          Coming Soon
        </div>
        <p className="text-gray-400 text-sm">Course launching soon. Join waitlist!</p>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  const Icon = course.icon;
  
  return (
    <div className={`relative bg-gradient-to-br ${course.gradient} rounded-2xl border ${course.borderColor} overflow-hidden`}>
      {/* Coming Soon Overlay */}
      <ComingSoonBadge />
      
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 ${course.badgeColor} text-white text-xs font-bold rounded-full`}>
          {course.badge}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-emerald-400 text-sm font-medium mb-1">{course.subtitle}</p>
            <h3 className="text-2xl font-bold text-white">{course.title}</h3>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-400 mb-6">{course.description}</p>
        
        {/* Stats */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-4 h-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Play className="w-4 h-4" />
            {course.lessons} lessons
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Users className="w-4 h-4" />
            {course.students}
          </div>
          <div className="flex items-center gap-1.5 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            {course.rating}
          </div>
        </div>
        
        {/* Features */}
        <div className="space-y-3 mb-8">
          {course.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">${course.price}</span>
              <span className="text-gray-500 line-through">${course.originalPrice}</span>
            </div>
            <p className="text-emerald-400 text-sm">Save {Math.round((1 - course.price / course.originalPrice) * 100)}%</p>
          </div>
          <button 
            disabled
            className="px-6 py-3 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-16">
          <Breadcrumb />
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              PropFirmScanner Academy
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Learn to Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Funded</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Master prop firm trading with our comprehensive courses. From beginner basics to advanced strategies used by consistently funded traders.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>3,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>4.8 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span>78% Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Path</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Whether you&apos;re just starting out or looking to scale your funded accounts, we have the right course for you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What&apos;s Included</h2>
            <p className="text-gray-400">Every course comes with these premium features</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Student Success Stories</h2>
          <p className="text-gray-400">Join thousands of traders who transformed their journey</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">&quot;{testimonial.content}&quot;</p>
              <div>
                <p className="text-white font-medium">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-emerald-500/30 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Join our waitlist to be the first to know when courses launch. Early subscribers get exclusive discounts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button disabled className="px-8 py-3 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed">
              Coming Soon
            </button>
            <Link 
              href="/blog"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Read Free Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
