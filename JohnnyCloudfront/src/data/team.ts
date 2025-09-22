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
    linkedinUrl: "https://www.linkedin.com/in/fredytapia/",
    githubUrl: "https://github.com/fredy3k",
    imageUrl: "/images/fredy-tapia-project-manager.jpg"
  },
  {
    name: "Roman Canger",
    role: "Business Analyst",
    bio: "Analyzing cloud cost patterns and business requirements to drive data-driven optimization decisions.",
    email: "rcanger@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/romancanger/",
    githubUrl: "https://github.com/romancanger",
    imageUrl: "/images/roman.jpg"
  },
  {
    name: "Hamad Iqbal",
    role: "Cloud Infrastructure Architect",
    bio: "Designing scalable AWS architectures and implementing security best practices across cloud environments.",
    email: "hamadkhan123@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/hamad-iqbal-236172211/",
    githubUrl: "https://github.com/Hamad12422",
    imageUrl: "/images/hamad.jpg"
  },
  {
    name: "Chandramati Hiregoudra",
    role: "Cloud Infrastructure Architect / Application Developer",
    bio: "Building robust cloud solutions and developing applications that make AWS management intuitive.",
    email: "cvhiregoudra16@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/chandramatihiregoudra/",
    githubUrl: "https://github.com/ChandramatiH",
    imageUrl: "/images/chandramati-hiregoudra-developer.jpg"
  },
  {
    name: "Eskinder Kassahun",
    role: "Cloud Infrastructure Architect / Application Developer",
    bio: "Creating seamless user experiences and implementing cloud-native solutions for enterprise customers.",
    email: "eskewabe185@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/eskinder-kassahun/",
    githubUrl: "https://github.com/Eskinder185",
    imageUrl: "/images/eskinder-kassahun-developer.jpg"
  }
];
