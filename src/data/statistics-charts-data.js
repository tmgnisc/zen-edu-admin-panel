import { chartsConfig } from "@/configs";

const jobViewsChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Job Views",
      data: [150, 200, 170, 220, 280, 300, 250],
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#4caf50",
    plotOptions: {
      bar: {
        columnWidth: "16%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
};

const applicationTrendsChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Applications",
      data: [80, 100, 120, 150, 200, 180, 220, 240, 260],
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#0288d1"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },
};

const interviewsChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Interviews",
      data: [30, 40, 60, 80, 120, 90, 110, 130, 160],
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#ff9800"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Job Views",
    description: "Weekly views of job listings",
    footer: "updated 2 hours ago",
    chart: jobViewsChart,
  },
  {
    color: "white",
    title: "Application Trends",
    description: "Applications submitted over the year",
    footer: "updated 5 minutes ago",
    chart: applicationTrendsChart,
  },
  {
    color: "white",
    title: "Interviews Scheduled",
    description: "Monthly interview trends",
    footer: "updated just now",
    chart: interviewsChart,
  },
];

export default statisticsChartsData;
