export const pages = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Vision & Mission", "/vision-mission"],
  ["Principal's Message", "/principal-message"],
  ["Management & Faculty", "/management-faculty"],
  ["Academics & Curriculum", "/academics"],
  ["Infrastructure & Facilities", "/infrastructure"],
  ["Student Activities", "/student-activities"],
  ["Sports & Cultural Activities", "/sports-cultural"],
  ["Student Achievements", "/achievements"],
  ["Robotics & Innovation", "/robotics-innovation"],
  ["News & Announcements", "/news"],
  ["Events & Calendar", "/events"],
  ["Gallery", "/gallery"],
  ["Admissions", "/admissions"],
  ["Contact Us", "/contact"],
];

export const footerExplorePages = pages.slice(0, 5);
export const footerSchoolLifePages = [
  ["Academics & Curriculum", "/academics"],
  ["Infrastructure & Facilities", "/infrastructure"],
  ["Student Activities", "/student-activities"],
  ["Sports & Cultural Activities", "/sports-cultural"],
  ["Student Achievements", "/achievements"],
  ["Robotics & Innovation", "/robotics-innovation"],
  ["News & Announcements", "/news"],
  ["Events & Calendar", "/events"],
  ["Gallery", "/gallery"],
];

export const knownRoutes = new Set(pages.map(([, path]) => path));

