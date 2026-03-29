import React from 'react';
import { Briefcase, Users, Lightbulb, Rocket, ArrowRight, Target } from 'lucide-react';

const CareerMatch = ({ personality, languages }) => {
  // Add safety checks
  if (!personality || !personality.dominant_personality) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <div className="text-gray-400">Career insights not available</div>
      </div>
    );
  }

  const dominantType = personality.dominant_personality.type;
  const score = personality.dominant_personality.score;
  
  // Extract top languages for skills with fallbacks
  const topLanguages = languages && typeof languages === 'object' 
    ? Object.keys(languages).slice(0, 3) 
    : ['JavaScript', 'TypeScript', 'Python'];
  
  // Extract personality traits for skills with fallback
  const personalityTraits = personality.dominant_personality?.traits || [];

  // Career paths based on dominant personality type
  const careerMatches = {
    hustler: [
      {
        title: "Technical Lead",
        description: "Lead development teams while driving project vision and community engagement",
        match: 95,
        icon: Rocket,
        justification: "High match due to strong networking skills and community-focused development approach"
      },
      {
        title: "Developer Relations", 
        description: "Bridge the gap between engineering and community through advocacy and education",
        match: 88,
        icon: Users,
        justification: "Strong match based on prolific project creation and community engagement patterns"
      },
      {
        title: "Solutions Architect",
        description: "Design comprehensive technical solutions that drive business and customer success",
        match: 82,
        icon: Lightbulb,
        justification: "Good match from continuous learning trait and diverse project portfolio"
      }
    ],
    builder: [
      {
        title: "Senior Software Engineer",
        description: "Build robust, scalable systems and mentor other developers",
        match: 94,
        icon: Briefcase,
        justification: "Excellent match due to consistent project creation and technical dedication"
      },
      {
        title: "Engineering Manager",
        description: "Lead engineering teams and drive technical excellence",
        match: 87,
        icon: Users,
        justification: "Strong match from dedicated developer trait and project consistency"
      },
      {
        title: "Principal Engineer",
        description: "Solve complex technical challenges and set technical direction",
        match: 91,
        icon: Rocket,
        justification: "High match based on technical depth and problem-solving abilities"
      }
    ],
    explorer: [
      {
        title: "Full Stack Developer",
        description: "Explore and master diverse technologies across the entire stack",
        match: 92,
        icon: Lightbulb,
        justification: "Perfect match from diverse language stack and exploratory development style"
      },
      {
        title: "Technical Consultant",
        description: "Solve diverse problems across different industries and technologies",
        match: 85,
        icon: Briefcase,
        justification: "Strong match due to technical diversity and continuous learning approach"
      },
      {
        title: "Startup CTO",
        description: "Drive technical vision and build products from the ground up",
        match: 89,
        icon: Rocket,
        justification: "Good match from exploratory mindset and rapid project iteration"
      }
    ],
    debugger: [
      {
        title: "Site Reliability Engineer",
        description: "Ensure system reliability and solve complex operational issues",
        match: 93,
        icon: Lightbulb,
        justification: "High match due to problem-solving focus and systematic approach"
      },
      {
        title: "Security Engineer",
        description: "Identify and fix security vulnerabilities in complex systems",
        match: 88,
        icon: Briefcase,
        justification: "Strong match from analytical mindset and attention to detail"
      },
      {
        title: "Performance Engineer",
        description: "Optimize system performance and solve scalability challenges",
        match: 85,
        icon: Rocket,
        justification: "Good match based on systematic debugging and optimization skills"
      }
    ],
    perfectionist: [
      {
        title: "Quality Assurance Lead",
        description: "Ensure highest code quality and comprehensive testing strategies",
        match: 94,
        icon: Briefcase,
        justification: "Excellent match due to attention to detail and quality-focused approach"
      },
      {
        title: "DevOps Engineer",
        description: "Build and maintain robust, automated development pipelines",
        match: 89,
        icon: Rocket,
        justification: "Strong match from systematic approach and process optimization skills"
      },
      {
        title: "Platform Engineer",
        description: "Create and maintain reliable, scalable development platforms",
        match: 87,
        icon: Lightbulb,
        justification: "Good match based on quality focus and systematic development patterns"
      }
    ]
  };

  const careers = careerMatches[dominantType] || careerMatches.hustler;

  // Generate dynamic skills based on user data
  const generateSkills = (careerTitle) => {
    try {
      const baseSkills = {
        "Technical Lead": ["Leadership", topLanguages[0] || "JavaScript", "System Design"],
        "Developer Relations": ["Communication", topLanguages[1] || "TypeScript", "Community Building"],
        "Solutions Architect": ["Architecture", topLanguages[2] || "Python", "Problem Solving"],
        "Senior Software Engineer": [topLanguages[0] || "JavaScript", "Code Quality", "Mentoring"],
        "Engineering Manager": ["Team Leadership", topLanguages[1] || "TypeScript", "Process Improvement"],
        "Principal Engineer": [topLanguages[2] || "Python", "Technical Strategy", "Innovation"],
        "Full Stack Developer": [topLanguages[0] || "JavaScript", topLanguages[1] || "TypeScript", "System Integration"],
        "Technical Consultant": ["Problem Solving", topLanguages[2] || "Python", "Client Management"],
        "Startup CTO": ["Product Strategy", topLanguages[0] || "JavaScript", "Team Building"],
        "Site Reliability Engineer": ["System Monitoring", topLanguages[1] || "TypeScript", "Automation"],
        "Security Engineer": ["Security Analysis", topLanguages[2] || "Python", "Risk Assessment"],
        "Performance Engineer": ["Performance Tuning", topLanguages[0] || "JavaScript", "Optimization"],
        "Quality Assurance Lead": ["Testing Strategy", topLanguages[1] || "TypeScript", "Quality Standards"],
        "DevOps Engineer": ["Automation", topLanguages[2] || "Python", "Process Optimization"],
        "Platform Engineer": ["Platform Architecture", topLanguages[0] || "JavaScript", "Reliability"]
      };
      
      return baseSkills[careerTitle] || [topLanguages[0] || "JavaScript", "Problem Solving", "Innovation"];
    } catch (error) {
      console.error('Error generating skills:', error);
      return ["Problem Solving", "Innovation", "Technical Skills"];
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Career Matches</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {careers.map((career, index) => {
          const Icon = career.icon;
          return (
            <div
              key={index}
              className="relative group flex flex-col"
              style={{ height: '100%' }}
            >
              {/* Glow effect on hover with purple accent */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-700/50 hover:border-purple-600/50 transition-all duration-300 flex flex-col h-full">
                {/* Career Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                        {career.title}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {career.description}
                    </p>
                  </div>
                </div>

                {/* Match Score - Vertically Centered */}
                <div className="mb-3 flex items-center justify-center">
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">Match Score</span>
                      <span className="text-xs font-semibold text-blue-400 font-mono min-w-[3rem] text-center">
                        {career.match}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${career.match}%`,
                          background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills Section - Flex Grow to Push Content Down */}
                <div className="mb-3 flex-grow">
                  <div className="text-xs text-gray-400 mb-2 text-center">Key Skills</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {generateSkills(career.title).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Justification - Pushed to Bottom */}
                <div className="mt-auto text-center">
                  <div className="text-xs text-blue-400 italic">
                    {career.justification}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Based on your <span className="text-purple-400 font-medium">{personality.dominant_personality.name}</span> personality ({score}/100)
        </div>
      </div>
    </div>
  );
};

export default CareerMatch;
