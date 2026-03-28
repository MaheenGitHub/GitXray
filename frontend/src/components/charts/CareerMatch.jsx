import React from 'react';
import { Briefcase, Users, Lightbulb, Rocket, ArrowRight } from 'lucide-react';

const CareerMatch = ({ personality }) => {
  if (!personality || !personality.dominant_personality) {
    return null;
  }

  const dominantType = personality.dominant_personality.type;
  const score = personality.dominant_personality.score;

  // Career paths based on dominant personality type
  const careerMatches = {
    hustler: [
      {
        title: "Technical Lead",
        description: "Lead development teams while driving project vision and community engagement",
        match: 95,
        icon: Rocket,
        skills: ["Leadership", "Technical Strategy", "Team Building"],
        salary: "$120K - $180K",
        growth: "High"
      },
      {
        title: "Developer Relations", 
        description: "Bridge the gap between engineering and community through advocacy and education",
        match: 88,
        icon: Users,
        skills: ["Communication", "Public Speaking", "Technical Writing"],
        salary: "$90K - $140K",
        growth: "Very High"
      },
      {
        title: "Solutions Architect",
        description: "Design comprehensive technical solutions that drive business and customer success",
        match: 82,
        icon: Lightbulb,
        skills: ["System Design", "Client Communication", "Problem Solving"],
        salary: "$130K - $190K",
        growth: "High"
      }
    ],
    builder: [
      {
        title: "Senior Software Engineer",
        description: "Build robust, scalable systems and mentor other developers",
        match: 94,
        icon: Briefcase,
        skills: ["System Architecture", "Code Quality", "Mentoring"],
        salary: "$110K - $160K",
        growth: "High"
      },
      {
        title: "Engineering Manager",
        description: "Lead engineering teams and drive technical excellence",
        match: 87,
        icon: Users,
        skills: ["Team Management", "Technical Leadership", "Process Improvement"],
        salary: "$130K - $180K",
        growth: "High"
      },
      {
        title: "Principal Engineer",
        description: "Solve complex technical challenges and set technical direction",
        match: 91,
        icon: Rocket,
        skills: ["Technical Strategy", "Problem Solving", "Innovation"],
        salary: "$150K - $220K",
        growth: "Very High"
      }
    ],
    explorer: [
      {
        title: "Full Stack Developer",
        description: "Explore and master diverse technologies across the entire stack",
        match: 92,
        icon: Lightbulb,
        skills: ["Multi-language", "System Integration", "Rapid Learning"],
        salary: "$100K - $150K",
        growth: "High"
      },
      {
        title: "Technical Consultant",
        description: "Solve diverse problems across different industries and technologies",
        match: 85,
        icon: Briefcase,
        skills: ["Problem Solving", "Client Management", "Technical Breadth"],
        salary: "$120K - $170K",
        growth: "High"
      },
      {
        title: "Startup CTO",
        description: "Drive technical vision and build products from the ground up",
        match: 89,
        icon: Rocket,
        skills: ["Product Strategy", "Team Building", "Technical Leadership"],
        salary: "$140K - $200K+",
        growth: "Very High"
      }
    ],
    debugger: [
      {
        title: "Site Reliability Engineer",
        description: "Ensure system reliability and solve complex operational issues",
        match: 93,
        icon: Lightbulb,
        skills: ["System Monitoring", "Problem Solving", "Automation"],
        salary: "$110K - $160K",
        growth: "Very High"
      },
      {
        title: "Security Engineer",
        description: "Identify and fix security vulnerabilities in complex systems",
        match: 88,
        icon: Briefcase,
        skills: ["Security Analysis", "Risk Assessment", "Incident Response"],
        salary: "$120K - $180K",
        growth: "Very High"
      },
      {
        title: "Performance Engineer",
        description: "Optimize system performance and solve scalability challenges",
        match: 85,
        icon: Rocket,
        skills: ["Performance Tuning", "System Analysis", "Optimization"],
        salary: "$115K - $165K",
        growth: "High"
      }
    ],
    perfectionist: [
      {
        title: "Quality Assurance Lead",
        description: "Ensure highest code quality and comprehensive testing strategies",
        match: 94,
        icon: Briefcase,
        skills: ["Testing Strategy", "Quality Standards", "Process Improvement"],
        salary: "$90K - $130K",
        growth: "High"
      },
      {
        title: "DevOps Engineer",
        description: "Build and maintain robust, automated development pipelines",
        match: 89,
        icon: Rocket,
        skills: ["Automation", "System Design", "Process Optimization"],
        salary: "$110K - $160K",
        growth: "Very High"
      },
      {
        title: "Platform Engineer",
        description: "Create and maintain reliable, scalable development platforms",
        match: 87,
        icon: Lightbulb,
        skills: ["Platform Architecture", "System Design", "Reliability"],
        salary: "$120K - $170K",
        growth: "Very High"
      }
    ]
  };

  const careers = careerMatches[dominantType] || careerMatches.hustler;

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Career Matches</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {careers.map((career, index) => {
          const Icon = career.icon;
          return (
            <div
              key={index}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
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

                {/* Match Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Match Score</span>
                    <span className="text-xs font-semibold text-green-400">{career.match}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${career.match}%` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">Key Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.slice(0, 2).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {career.skills.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
                        +{career.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400">Salary: </span>
                    <span className="text-green-400 font-medium">{career.salary}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Growth: </span>
                    <span className="text-blue-400 font-medium">{career.growth}</span>
                  </div>
                </div>

                {/* Rank Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Based on your <span className="text-blue-400 font-medium">{personality.dominant_personality.name}</span> personality ({score}/100)
        </div>
      </div>
    </div>
  );
};

export default CareerMatch;
