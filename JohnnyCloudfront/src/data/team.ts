// Team member data with enhanced profile information
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedinUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Fredy Tapia",
    role: "Project Manager",
    bio: "Leading product strategy and team coordination for JohnnyCloud's mission to simplify AWS operations.",
    email: "neofredy.tapia@gmail.com",
    linkedinUrl: "https://linkedin.com/in/fredy-tapia",
    githubUrl: "https://github.com/fredytapia",
    imageUrl: "/images/about/team-photos/fredy-tapia-project-manager.jpg"
  },
  {
    name: "Roman Canger",
    role: "Business Analyst",
    bio: "Analyzing cloud cost patterns and business requirements to drive data-driven optimization decisions.",
    email: "rcanger@gmail.com",
    linkedinUrl: "https://linkedin.com/in/roman-canger",
    githubUrl: "https://github.com/romancanger",
    imageUrl: "/images/about/team-photos/roman-canger-business-analyst.jpg"
  },
  {
    name: "Hamad Iqbal",
    role: "Cloud Infrastructure Architect",
    bio: "Designing scalable AWS architectures and implementing security best practices across cloud environments.",
    email: "hamadkhan123@gmail.com",
    linkedinUrl: "https://linkedin.com/in/hamad-iqbal",
    githubUrl: "https://github.com/hamadiqbal",
    imageUrl: "/images/about/team-photos/hamad-iqbal-cloud-architect.jpg"
  },
  {
    name: "Chandramati Hiregoudra",
    role: "Cloud Infrastructure Architect / Application Developer",
    bio: "Building robust cloud solutions and developing applications that make AWS management intuitive.",
    email: "cvhiregoudra16@gmail.com",
    linkedinUrl: "https://linkedin.com/in/chandramati-hiregoudra",
    githubUrl: "https://github.com/chandramati",
    imageUrl: "/images/about/team-photos/chandramati-hiregoudra-developer.jpg"
  },
  {
    name: "Eskinder Kassahun",
    role: "Cloud Infrastructure Architect / Application Developer",
    bio: "Creating seamless user experiences and implementing cloud-native solutions for enterprise customers.",
    email: "eskewabe185@gmail.com",
    linkedinUrl: "https://linkedin.com/in/eskinder-kassahun",
    githubUrl: "https://github.com/eskinder",
    imageUrl: "/images/about/team-photos/eskinder-kassahun-developer.jpg"
  }
];
