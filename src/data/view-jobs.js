const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechVision",
    salary: "$5000",
    applications: 25,
    status: "Open", 
    recruiters: [
      { img: "/img/team-1.jpeg", name: "Romina Hadid" },
      { img: "/img/team-2.jpeg", name: "Ryan Tompson" },
    ],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeBase",
    salary: "$4000",
    applications: 42,
    status: "Closed", 
    recruiters: [{ img: "/img/team-3.jpeg", name: "Jessica Doe" }],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignPro",
    salary: "$3000",
    applications: 30,
    status: "Open", 
    recruiters: [{ img: "/img/team-4.jpeg", name: "Alexander Smith" }],
  },
];

export default jobs;
