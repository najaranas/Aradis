import usa from "../assets/images/languages/usa.png";
import tunisia from "../assets/images/languages/tunisia.png";
import france from "../assets/images/languages/france.png";
import { tagIcon } from "./dataImage";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const PROFILEMENUDATA = [
  {
    iconName: "person-outline",
    optionName: "My Profile",
    route: "MyProfile",
    type: "default", // Default type: icon + text
    translationKey: "profile.my_profile",
  },
  {
    iconName: "globe-outline",
    optionName: "Language",
    route: "Languages",
    type: "language", // Custom type: icon + text + language selector
    translationKey: "profile.language",
  },
  {
    iconName: "moon-outline",
    optionName: "Dark Mode",
    route: null,
    type: "switch", // Custom type: icon + text + switch
    translationKey: "profile.dark_mode",
  },
  {
    iconName: "information-circle-outline",
    optionName: "About App",
    route: "AboutApp",
    type: "default",
    translationKey: "profile.about_app",
  },
  {
    iconName: "log-out-outline",
    optionName: "Logout",
    route: null,
    type: "logout", // Custom type: logout button
    translationKey: "profile.logout",
  },
];

export const getMYPROFILEDATA = (userData) => [
  {
    key: "name",
    label: "Full Name",
    value: `${userData?.firstName} ${userData?.lastName}` || "Worker",
    editable: false,
    translationKey: "myProfile.full_name",
  },
  {
    key: "email",
    label: "Email Address",
    value: userData?.email || "user@example.com",
    keyboardType: "email-address",
    editable: false,
    translationKey: "myProfile.email_address",
  },
  {
    key: "phone",
    label: "Phone Number",
    value: `${userData?.phone}` || "123456789",
    keyboardType: "phone-pad",
    editable: false,
    translationKey: "myProfile.phone_number",
  },
  {
    key: "role",
    label: "Role/Job Title",
    value: userData?.userCategory || "Role",
    keyboardType: "default",
    editable: false,
    translationKey: "myProfile.role_job_title",
  },
  {
    key: "id",
    label: "ID",
    value: `#${userData?.mat}` || "#12345678",
    keyboardType: "default",
    editable: false,
    translationKey: "myProfile.id",
  },
];

export const LANGUAGES = [
  {
    id: 1,
    logo: usa,
    text: "English",
    langCode: "en",
  },
  {
    id: 2,

    logo: tunisia,
    text: "العربية",
    langCode: "ar",
  },
  {
    id: 3,

    logo: france,
    text: "Français",
    langCode: "fr",
  },
];

export const ABOUTAPPDATA = {
  ourApp: [
    "ARA Solutions is a smart platform designed to streamline manufacturing operations. It helps teams diagnose failures, report anomalies, and resolve issues quickly. With real-time alerts, data analysis, and easy integration with systems like SAP, our app boosts efficiency and supports continuous improvement — all through a user-friendly interface.",
  ],
  keyFeatures: [
    {
      id: "1_1",
      text: "Failure Diagnosis - Quickly identify and resolve machine failures with advanced diagnostic tools.",
    },
    {
      id: "1_2",
      text: "Anomaly Reporting - Report and track anomalies in real-time to prevent production disruptions.",
    },
    {
      id: "1_3",
      text: "Quick Problem Resolution - Manage QRAPs (Quick Response Action Plans) for fast and effective issue resolution.",
    },
    {
      id: "1_4",
      text: "Historical Data Analysis - Access detailed reports and analytics to drive continuous improvement.",
    },
    {
      id: "1_5",
      text: "Real-Time Notifications - Stay informed with instant alerts for critical issues and task updates.",
    },
    {
      id: "1_6",
      text: "User-Friendly Interface - Intuitive design for easy navigation and seamless user experience.",
    },
    {
      id: "1_7",
      text: "Integration with SAP & GED - Connect with existing systems for streamlined operations and data management.",
    },
  ],
  whyChooseUs: [
    {
      id: "1_1",
      text: "Proven Expertise - Developed by industry leaders with decades of experience in manufacturing and digital transformation.",
    },
    {
      id: "1_2",
      text: "Scalable Solutions - Designed to meet the needs of small teams and large enterprises alike.",
    },
    {
      id: "1_3",
      text: "Continuous Support - Dedicated customer support to ensure your success at every step.",
    },
    {
      id: "1_4",
      text: "Innovative Technology - Leveraging the latest advancements in AI and IoT for smarter operations.",
    },
  ],
  ourMission: [
    {
      id: "1_1",
      text: "Empower Teams - Providing innovative tools that help manufacturing teams boost productivity and streamline workflows.",
    },
    {
      id: "1_2",
      text: "Enhance Quality - Driving improvements in product quality through smart, data-driven solutions.",
    },
    {
      id: "1_3",
      text: "Reduce Downtime - Minimizing production delays with predictive insights and real-time monitoring.",
    },
    {
      id: "1_4",
      text: "Foster Growth - Turning operational challenges into opportunities for sustainable business growth.",
    },
    {
      id: "1_5",
      text: "Client-Centered - Building strong partnerships by aligning our solutions with your unique goals.",
    },
  ],
  contactUs: {
    email: "support@www.ara-co.tn",
    phone: "+123 456 7890",
    website: "http://www.ara-co.tn",
  },
};

export const TAGFILTERDATA = {
  CATEGORIES: {
    sectionName: "Category",
    data: [
      {
        name: "security",
        color: "#FF0000",
        bgColor: "#FF000030",
        id: 1,
      },
      {
        name: "production",
        color: "#0000FF",
        bgColor: "#0070C030",
        id: 2,
      },
      {
        name: "maintenance",
        color: "#ffaa00",
        bgColor: "#ffaa0030",
        id: 3,
      },
      {
        name: "quality",
        color: "#00B050",
        bgColor: "#00B05030",
        id: 4,
      },
    ],
  },

  PRIORITY: {
    sectionName: "Priority",
    data: [
      {
        name: "Normal",
        id: 1,
      },
      {
        name: "Urgent",
        id: 2,
      },
      {
        name: "T_Urgent",
        id: 3,
      },
    ],
  },

  STATUS: {
    sectionName: "Status",
    data: [
      {
        name: "Open",
        id: 1,
      },
      {
        name: "In Progress",
        id: 2,
      },
      {
        name: "Resolved",
        id: 3,
      },
    ],
  },

  DATE: {
    sectionName: "Date",
    data: [],
  },

  SORT_BY: {
    sectionName: "Sort By",
    data: [
      {
        id: 1,
        name: "Uploaded Date", // – Sort tags by most recently added first.
      },
      {
        id: 2,
        name: "Oldest Uploaded Date", // –Sort tags by earliest added first.
      },
      {
        id: 3,
        name: "Important Tag", // – Prioritize tags marked as important.
      },
      {
        id: 4,
        name: "Resolved First", // – Show resolved anomalies at the top.
      },
      {
        id: 5,
        name: "Unresolved First", // –  Show open anomalies at the top.
      },
    ],
  },
};

export const PROGRESSSTEPS = {
  activeStep: "2",
  data: [
    { label: "Open", id: 1 },
    { label: "In Progress", id: 2 },
    { label: "Resolved", id: 3 },
  ],
};

export const TAGS = [
  ...Array.from({ length: 20 }, (_, i) => {
    const randomDate = `${months[Math.floor(Math.random() * 11)]} ${
      Math.floor(Math.random() * 26) + 1
    }, ${2020 + Math.floor(Math.random() * 10)}`;
    return {
      tagNumber: `#TAG-${4625 + i}`,
      category: ["security", "quality", "maintenance", "production"][i % 4],
      priority: ["normal", "urgent", "t_urgent"][i % 3],
      date: randomDate,
      progressSteps: {
        activeStep: `${(i % 3) + 1}`,
        data: [
          { label: "Open", id: 1 },
          { label: "In Progress", id: 2 },
          { label: "Resolved", id: 3 },
        ],
      },
      taskDetails: [
        {
          label: "date",
          value: randomDate,
        },
        {
          label: "deadline",
          value: "Feb 10, 2023",
        },
        { label: "zone", value: "Zone " + ["A", "B", "C", "D", "E"][i % 5] },
        {
          label: "machine",
          value: "Machine " + Math.floor(Math.random() * 20),
        },
        { label: "equipment", value: "Pump" },
        {
          label: "responsiblePerson",
          value: [
            {
              name: "Person A",
              avatar:
                "https://i.pinimg.com/736x/de/2b/d1/de2bd14c37a797e1913b1cdd4766c9e6.jpg",
            },
            {
              name: "Person B",
              avatar:
                "https://i.pinimg.com/736x/16/41/6e/16416ec2ba02f9617953b37813d1e07c.jpg",
            },
            {
              name: "Person B",
              avatar:
                "https://i.pinimg.com/736x/16/41/6e/16416ec2ba02f9617953b37813d1e07c.jpg",
            },
            {
              name: "Person B",
              avatar:
                "https://i.pinimg.com/736x/16/41/6e/16416ec2ba02f9617953b37813d1e07c.jpg",
            },
            {
              name: "Person B",
              avatar:
                "https://i.pinimg.com/736x/16/41/6e/16416ec2ba02f9617953b37813d1e07c.jpg",
            },
            {
              name: "Person B",
              avatar:
                "https://i.pinimg.com/736x/16/41/6e/16416ec2ba02f9617953b37813d1e07c.jpg",
            },
            {
              name: "Person B",
              avatar:
                "https://i.pinimg.com/736x/16/41/6e/16416ec2ba02f9617953b37813d1e07c.jpg",
            },
          ],
        },
        { label: "tagNumber", value: `153573${i + 39}` },
        {
          label: "foundedBy",
          value: [
            {
              name: "Reporter X",
              avatar:
                "https://i.pinimg.com/736x/fc/3a/16/fc3a16ef027cb4894ffb392043386e5c.jpg",
            },
          ],
        },
        {
          label: "actions",
          value: "Check and validate the reported issue.",
        },
        {
          label: "description",
          value:
            "Found a leaking hydraulic pipe near Machine 3 in Zone B. Requires immediate attention to prevent fluid loss and safety hazards.",
        },
      ],
      images: {
        label: "images",
        value: [
          {
            id: "1",
            uri: "https://th.bing.com/th/id/OIP.nYrnSJ3wgajQAePMQOD3mAHaF-?w=1200&h=968&rs=1&pid=ImgDetMain",
          },
          {
            id: "2",
            uri: "https://images.unsplash.com/photo-1718824331840-399943ff5c1e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
      },
    };
  }),
];

// old add tag data
//    "sections": {
//   "1": {
//     "sectionTitle": "Basic Information",
//     "nextPageTitle": "Next, Location Details"
//   },
//   "2": {
//     "sectionTitle": "Location Details",
//     "nextPageTitle": "Next, Priority and Status"
//   },
//   "3": {
//     "sectionTitle": "Priority and Status",
//     "nextPageTitle": "Next, Responsible Person"
//   },
//   "4": {
//     "sectionTitle": "Responsible Person",
//     "nextPageTitle": "Next, Actions and Deadline"
//   },
//   "5": {
//     "sectionTitle": "Actions and Deadline",
//     "nextPageTitle": "Next, Submit"
//   }
// },

// "fields": {
//       "1_1": {
//         "label": "Numéro de Tag",
//         "placeholder": "ex., #TAG-123456"
//       },
//       "1_2": {
//         "label": "Catégorie",
//         "placeholder": "ex., Maintenance, Production, Qualité",
//         "searchPlaceholder": "Rechercher...",
//         "options": {
//           "1": "Maintenance",
//           "2": "Production",
//           "3": "Qualité",
//           "4": "Sécurité"
//         }
//       },
//       "1_3": {
//         "label": "Description",
//         "placeholder": "ex., Problème de calibration de la Machine 5"
//       },
//       "1_4": {
//         "label": "Images",
//         "placeholder": "Télécharger ou prendre une photo de l'anomalie"
//       },
//       "2_1": {
//         "label": "Zone",
//         "placeholder": "ex., A, B, C"
//       },
//       "2_2": {
//         "label": "Machine",
//         "placeholder": "ex., 5, 10"
//       },
//       "2_3": {
//         "label": "Équipement",
//         "placeholder": "ex., Tapis Roulant, Pompe"
//       },
//       "3_1": {
//         "label": "Priorité",
//         "placeholder": "ex., Normale, Urgente, T.Urgente",
//         "searchPlaceholder": "Rechercher...",

//         "options": {
//           "1": "Normale",
//           "2": "Urgente",
//           "3": "T.Urgente"
//         }
//       },
//       "3_2": {
//         "label": "Statut",
//         "placeholder": "ex., Ouvert, En Cours, Résolu",
//         "searchPlaceholder": "Rechercher...",

//         "options": {
//           "1": "Ouvert",
//           "2": "En Cours",
//           "3": "Résolu"
//         }
//       },
//       "4_1": {
//         "label": "Trouvé Par",
//         "placeholder": "ex., Anas Najar",
//         "searchPlaceholder": "Rechercher..."
//       },
//       "4_2": {
//         "label": "Personne Responsable",
//         "placeholder": "ex., Jane Smith, Mohamed Ali",
//         "searchPlaceholder": "Rechercher..."
//       },
//       "5_1": {
//         "label": "Actions",
//         "placeholder": "ex., Recalibrer la machine, Remplacer la pièce"
//       },
//       "5_2": {
//         "label": "Délai",
//         "placeholder": "ex., 2023-10-30"
//       }
//     },

// export const ADDTAGDETAILS = [
//   {
//     id: "1",
//     sectionTitle: "Basic Information",
//     nextPageTitle: "Location Details",

//     fields: [
//       // {
//       //   id: "1_1",
//       //   label: "Tag Number",
//       //   keyboardType: "default",
//       //   placeholder: "e.g., #TAG-123456",
//       //   selectType: "tagNumber",
//       //   type: "textInput",
//       // },
//       {
//         id: "1_2",
//         label: "Category",
//         keyboardType: "default",
//         placeholder: "e.g., Maintenance, Production, Quality",
//         selectType: "category",
//         type: "select",
//         optionsLabelField: "type",

//         options: [
//           {
//             id: "1",
//             type: "Maintenance",
//           },
//           {
//             id: "2",
//             type: "Production",
//           },
//           {
//             id: "3",
//             type: "Quality",
//           },
//           {
//             id: "4",
//             type: "Sécurité",
//           },
//         ],
//       },
//       {
//         id: "1_3",
//         label: "Description",
//         keyboardType: "default",
//         placeholder: "e.g., Machine 5 calibration issue",
//         selectType: "description",
//         type: "textInput",
//       },
//       {
//         id: "1_4",
//         label: "Images",
//         keyboardType: "default",
//         placeholder: "Upload or take a photo of the anomaly",
//         selectType: "images",
//         type: "image",
//       },
//     ],
//   },
//   {
//     id: "2",
//     sectionTitle: "Location Details",
//     nextPageTitle: "Priority and Status",
//     fields: [
//       {
//         id: "2_1",
//         label: "Zone",
//         keyboardType: "default",
//         placeholder: "e.g.,A, B",
//         selectType: "zone",
//         type: "textInput",
//       },
//       {
//         id: "2_2",
//         label: "Machine",
//         keyboardType: "numeric",
//         placeholder: "e.g., 5, 10",
//         selectType: "machine",
//         type: "textInput",
//       },
//       {
//         id: "2_3",
//         label: "Equipment",
//         keyboardType: "default",
//         placeholder: "e.g., Conveyor Belt, Pump",
//         selectType: "equipment",
//         type: "textInput",
//       },
//     ],
//   },
//   {
//     id: "3",
//     sectionTitle: "Priority and Status",
//     nextPageTitle: "Responsible Person",
//     fields: [
//       {
//         id: "3_1",
//         label: "Priority",
//         keyboardType: "default",
//         placeholder: "e.g., Normal, Urgent, T.Urgent",
//         selectType: "priority",
//         type: "select",
//         optionsLabelField: "type",
//         options: [
//           {
//             id: "1",
//             type: "Normal",
//           },
//           {
//             id: "2",
//             type: "Urgent",
//           },
//           {
//             id: "3",
//             type: "T.Urgent",
//           },
//         ],
//       },
//       // {
//       //   id: "3_2",
//       //   label: "Status",
//       //   keyboardType: "default",
//       //   placeholder: "e.g., Open, In Progress, Resolved",
//       //   selectType: "status",
//       //   type: "select",
//       //   optionsLabelField: "type",

//       //   options: [
//       //     {
//       //       id: "1",
//       //       type: "Open",
//       //     },
//       //     {
//       //       id: "2",
//       //       type: "In Progress",
//       //     },
//       //     {
//       //       id: "3",
//       //       type: "Resolved",
//       //     },
//       //   ],
//       // },
//     ],
//   },
//   {
//     id: "4",
//     sectionTitle: "Responsible Person",
//     nextPageTitle: "Actions and Deadline",
//     fields: [
//       {
//         id: "4_1",
//         label: "Found By",
//         keyboardType: "default",
//         placeholder: "e.g., Anas Najar",
//         searchPlaceholder: "Search...",
//         selectType: "foundBy",
//         type: "select",
//         optionsLabelField: "name",

//         options: [
//           {
//             id: "1",
//             name: "Anasfs Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "2",
//             name: "Anasqt Najatsd ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "3",
//             name: "Anadfs Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "4",
//             name: "Anahs Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "5",
//             name: "Anazs Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "6",
//             name: "Anafdds Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "7",
//             name: "Anass Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//           {
//             id: "8",
//             name: "Anasa Najat ",
//             img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//           },
//         ],
//       },
//       // {
//       //   id: "4_2",
//       //   label: "Responsible Person",
//       //   keyboardType: "default",
//       //   placeholder: "e.g., Jane Smith, Mohamed Ali",
//       //   searchPlaceholder: "Search...",
//       //   selectType: "responsiblePerson",
//       //   type: "multiSelect",
//       //   optionsLabelField: "name",

//       //   options: [
//       //     {
//       //       id: "1",
//       //       name: "Anasfs Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "2",
//       //       name: "Anasqt Najatsd ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "3",
//       //       name: "Anadfs Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "4",
//       //       name: "Anahs Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "5",
//       //       name: "Anazs Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "6",
//       //       name: "Anafdds Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "7",
//       //       name: "Anass Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //     {
//       //       id: "8",
//       //       name: "Anasa Najat ",
//       //       img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
//       //     },
//       //   ],
//       // },
//     ],
//   },
//   {
//     id: "5",
//     sectionTitle: "Actions and Deadline",
//     nextPageTitle: "Submit",
//     fields: [
//       // {
//       //   id: "5_1",
//       //   label: "Actions",
//       //   keyboardType: "default",
//       //   placeholder: "e.g., Recalibrate machine, Replace part",
//       //   selectType: "actions",
//       //   type: "textInput",
//       // },
//       {
//         id: "5_2",
//         label: "Deadline",
//         keyboardType: "default",
//         placeholder: "e.g., 2023-10-30",
//         selectType: "deadline",
//         type: "date",
//       },
//     ],
//   },
// ];

// new add tag data
export const ADDTAGDETAILS = [
  {
    id: "1",
    sectionTitle: "Basic Information",
    nextPageTitle: "Location and Priority",
    fields: [
      {
        id: "1_1",
        label: "Category",
        keyboardType: "default",
        placeholder: "e.g., Maintenance, Production, Quality",
        selectType: "category",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Maintenance",
          },
          {
            id: "2",
            type: "Production",
          },
          {
            id: "3",
            type: "Quality",
          },
          {
            id: "4",
            type: "Sécurité",
          },
        ],
      },
      {
        id: "1_2",
        label: "Description",
        keyboardType: "default",
        placeholder: "e.g., Machine 5 calibration issue",
        selectType: "description",
        type: "textInput",
      },
      {
        id: "1_3",
        label: "Images",
        keyboardType: "default",
        placeholder: "Upload or take a photo of the anomaly",
        selectType: "images",
        type: "image",
      },
    ],
  },
  {
    id: "2",
    sectionTitle: "Location and Priority",
    nextPageTitle: "Assignment and Deadline",
    fields: [
      {
        id: "2_1",
        label: "Zone",
        keyboardType: "default",
        placeholder: "e.g.,A, B",
        selectType: "zone",
        type: "textInput",
      },
      {
        id: "2_2",
        label: "Machine",
        keyboardType: "numeric",
        placeholder: "e.g., 5, 10",
        selectType: "machine",
        type: "textInput",
      },
      {
        id: "2_3",
        label: "Equipment",
        keyboardType: "default",
        placeholder: "e.g., Conveyor Belt, Pump",
        selectType: "equipment",
        type: "textInput",
      },
      {
        id: "2_4",
        label: "Priority",
        keyboardType: "default",
        placeholder: "e.g., Normal, Urgent, T.Urgent",
        selectType: "priority",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Normal",
          },
          {
            id: "2",
            type: "Urgent",
          },
          {
            id: "3",
            type: "T.Urgent",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    sectionTitle: "Assignment and Deadline",
    nextPageTitle: "Submit",
    fields: [
      {
        id: "3_1",
        label: "Found By",
        keyboardType: "default",
        placeholder: "e.g., Anas Najar",
        searchPlaceholder: "Search...",
        selectType: "foundBy",
        type: "select",
        optionsLabelField: "name",
        options: [
          {
            id: "1",
            name: "Anasfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "2",
            name: "Anasqt Najatsd ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "3",
            name: "Anadfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "4",
            name: "Anahs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "5",
            name: "Anazs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "6",
            name: "Anafdds Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "7",
            name: "Anass Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "8",
            name: "Anasa Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
        ],
      },
      {
        id: "3_2",
        label: "Deadline",
        keyboardType: "default",
        placeholder: "e.g., 2023-10-30",
        selectType: "deadline",
        type: "date",
      },
    ],
  },
];

export const ADDFPSDETAILS = [
  {
    id: "1",
    sectionTitle: "Problem Identification",
    nextPageTitle: "Alert and Immediate Actions",
    fields: [
      {
        id: "1_1",
        label: "Category",
        keyboardType: "default",
        placeholder: "ex., Maintenance, Production, Quality",
        selectType: "category",
        type: "select",
        optionsLabelField: "type",
        options: [
          { id: "1", type: "Security" },
          { id: "2", type: "Quality" },
          { id: "3", type: "Maintenance" },
          { id: "4", type: "Production" },
          { id: "5", type: "Autre" },
        ],
      },
      {
        id: "1_2",
        label: "Reference",
        keyboardType: "default",
        placeholder: "e.g., REF-98765",
        selectType: "reference",
        type: "textInput",
      },
      {
        id: "1_3",
        label: "Problem Nature",
        keyboardType: "default",
        placeholder: "e.g., Machine breakdown, non-conforming product",
        selectType: "problemNature",
        type: "textInput",
      },
      {
        id: "1_4",
        label: "Date",
        keyboardType: "default",
        placeholder: "e.g., 2024-03-04 14:30",
        selectType: "dateTime",
        type: "datetime",
      },
      {
        id: "1_5",
        label: "Detection Location",
        keyboardType: "default",
        placeholder: "e.g., Production Line 3",
        selectType: "location",
        type: "textInput",
      },
      {
        id: "1_6",
        label: "Detected By",
        keyboardType: "default",
        placeholder: "e.g., John Doe",
        searchPlaceholder: "Search...",
        selectType: "detectedBy",
        type: "select",
        optionsLabelField: "name",
        options: [
          {
            id: "1",
            name: "Anasfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "2",
            name: "Anasqt Najatsd ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "3",
            name: "Anadfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "4",
            name: "Anahs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "5",
            name: "Anazs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "6",
            name: "Anafdds Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "7",
            name: "Anass Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "8",
            name: "Anasa Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
        ],
      },
      {
        id: "1_7",
        label: "Detection Method",
        keyboardType: "default",
        placeholder: "e.g., Visual Inspection, Machine Alarm",
        selectType: "detectionMethod",
        type: "textInput",
      },
      {
        id: "1_8",
        label: "Defective Quantity",
        keyboardType: "numeric",
        placeholder: "e.g., 10",
        selectType: "defectiveQuantity",
        type: "textInput",
      },
      {
        id: "1_9",
        label: "Cause and Impact",
        keyboardType: "default",
        placeholder: "e.g., Critical defect impacting production",
        selectType: "problemCause",
        type: "textInput",
      },
      {
        id: "1_10",
        label: "Customer Risk",
        keyboardType: "default",
        placeholder: "Yes / No",
        selectType: "customerRisk",
        type: "select",
        optionsLabelField: "type",
        options: [
          { id: "1", type: "Yes" },
          { id: "2", type: "No" },
        ],
      },
      {
        id: "1_11",
        label: "Images",
        keyboardType: "default",
        placeholder: "Upload or take a photo of the anomaly",
        selectType: "images",
        type: "image",
      },
    ],
  },
  {
    id: "2",
    sectionTitle: "Alert and Immediate Actions",
    nextPageTitle: "Root Cause Analysis",
    fields: [
      {
        id: "2_0",
        label: "Produit Concerné",
        keyboardType: "default",
        placeholder: "e.g., Composant X, Produit Y",
        selectType: "produit",
        type: "textInput",
      },
      {
        id: "2_4",
        label: "Sorting Results",
        keyboardType: "default",
        placeholder: "e.g., 50 sorted, 5 defective",
        selectType: "sortingResults",
        type: "textInput",
      },
      {
        id: "2_5",
        label: "Sorting Results",
        keyboardType: "default",
        placeholder: "e.g., 50 sorted, 5 defective",
        selectType: "sortingResultsNOK",
        type: "textInput",
      },
      {
        id: "2_6",
        label: "Who Handled Sorting?",
        keyboardType: "default",
        placeholder: "e.g., John Smith",
        searchPlaceholder: "Search...",
        selectType: "sortingBy",
        type: "user",
        type: "select",
        optionsLabelField: "name",
        options: [
          {
            id: "1",
            name: "Anasfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "2",
            name: "Anasqt Najatsd ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "3",
            name: "Anadfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "4",
            name: "Anahs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "5",
            name: "Anazs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "6",
            name: "Anafdds Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "7",
            name: "Anass Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "8",
            name: "Anasa Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
        ],
      },
      // {
      //   id: "2_1",
      //   label: "Notified Teams",
      //   keyboardType: "default",
      //   placeholder: "Select notified teams",
      //   selectType: "notifiedTeams",
      //   type: "multiSelect",
      //   optionsLabelField: "type",
      //   options: [
      //     {
      //       id: "1",
      //       type: "Team Leader",
      //     },
      //     {
      //       id: "2",
      //       type: "Supervisor",
      //     },
      //     {
      //       id: "3",
      //       type: "Quality Team",
      //     },
      //     {
      //       id: "4",
      //       type: "Maintenance",
      //     },
      //     {
      //       id: "5",
      //       type: "Logistics",
      //     },
      //     {
      //       id: "6",
      //       type: "UAP Manager",
      //     },
      //     {
      //       id: "7",
      //       type: "Site Director",
      //     },
      //     {
      //       id: "8",
      //       type: "Autre",
      //     },
      //   ],
      // },
      // {
      //   id: "2_2",
      //   label: "Immediate Actions Taken",
      //   keyboardType: "default",
      //   placeholder: "e.g., Stopped production, Isolated parts",
      //   selectType: "immediateActions",
      //   type: "textInput",
      // },
      // {
      //   id: "2_3",
      //   label: "Sorting Required?",
      //   keyboardType: "default",
      //   placeholder: "Yes / No",
      //   selectType: "sortingRequired",
      //   type: "select",
      //   optionsLabelField: "type",
      //   options: [
      //     {
      //       id: "1",
      //       type: "Yes",
      //     },
      //     {
      //       id: "2",
      //       type: "No",
      //     },
      //   ],
      // },

      // {
      //   id: "2_7",
      //   label: "Restart Time",
      //   keyboardType: "default",
      //   placeholder: "e.g., 15:45",
      //   selectType: "restartTime",
      //   type: "time",
      // },
    ],
    actionsFields: [
      {
        id: "2_2",
        label: "Immediate Actions Taken",
        keyboardType: "default",
        placeholder: "e.g., Stopped production, Isolated parts",
        selectType: "immediateActions",
        type: "textInput",
      },
      {
        id: "2_6",
        label: "Who Handled Sorting?",
        keyboardType: "default",
        placeholder: "e.g., John Smith",
        searchPlaceholder: "Search...",
        selectType: "sortingBy",
        type: "user",
        type: "select",
        optionsLabelField: "name",
        options: [
          {
            id: "1",
            name: "Anasfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "2",
            name: "Anasqt Najatsd ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "3",
            name: "Anadfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "4",
            name: "Anahs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "5",
            name: "Anazs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "6",
            name: "Anafdds Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "7",
            name: "Anass Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "8",
            name: "Anasa Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
        ],
      },
    ],
    resultsFields: [
      {
        id: "2_0",
        label: "Produit Concerné",
        keyboardType: "default",
        placeholder: "e.g., Composant X, Produit Y",
        selectType: "produit",
        type: "textInput",
      },
      {
        id: "2_4",
        label: "Sorting Results",
        keyboardType: "default",
        placeholder: "e.g., 50 sorted, 5 defective",
        selectType: "sortingResults",
        type: "textInput",
      },
      {
        id: "2_5",
        label: "Sorting Results",
        keyboardType: "default",
        placeholder: "e.g., 50 sorted, 5 defective",
        selectType: "sortingResultsNOK",
        type: "textInput",
      },
      {
        id: "2_6",
        label: "Who Handled Sorting?",
        keyboardType: "default",
        placeholder: "e.g., John Smith",
        searchPlaceholder: "Search...",
        selectType: "sortingBy",
        type: "user",
        type: "select",
        optionsLabelField: "name",
        options: [
          {
            id: "1",
            name: "Anasfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "2",
            name: "Anasqt Najatsd ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "3",
            name: "Anadfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "4",
            name: "Anahs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "5",
            name: "Anazs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "6",
            name: "Anafdds Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "7",
            name: "Anass Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "8",
            name: "Anasa Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    sectionTitle: "Root Cause Analysis",
    nextPageTitle: "Corrective Actions",
    fields: [
      {
        id: "3_1",
        label: "Root Cause Category",
        keyboardType: "default",
        placeholder: "Select cause category",
        selectType: "causeCategory",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Workforce",
          },
          {
            id: "2",
            type: "Material",
          },
          {
            id: "3",
            type: "Method",
          },
          {
            id: "4",
            type: "Machine",
          },
        ],
      },
      {
        id: "3_2",
        label: "5 Why Analysis",
        keyboardType: "default",
        placeholder: "List reasons step by step",
        selectType: "whyAnalysis",
        type: "icon",
      },
      {
        id: "3_3",
        label: "Why Wasn't It Detected Earlier?",
        keyboardType: "default",
        placeholder: "Explain why",
        selectType: "whyNotDetected",
        type: "textInput",
      },
    ],
  },
  {
    id: "4",
    sectionTitle: "Corrective Actions",
    nextPageTitle: "Validation and Closure",
    fields: [
      {
        id: "4_1",
        label: "Permanent Corrective Actions",
        keyboardType: "default",
        placeholder: "e.g., Improve inspection process",
        selectType: "correctiveActions",
        type: "textInput",
      },
      {
        id: "4_2",
        label: "Standard Improvement Needed?",
        keyboardType: "default",
        placeholder: "Yes / No",
        selectType: "standardImprovement",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Yes",
          },
          {
            id: "2",
            type: "No",
          },
        ],
      },
      {
        id: "4_3",
        label: "Responsible Person(s)",
        keyboardType: "default",
        placeholder: "e.g., Alex Johnson",
        searchPlaceholder: "Search...",
        selectType: "correctiveResponsible",
        type: "multiSelect",
        optionsLabelField: "name",
        options: [
          {
            id: "1",
            name: "Anasfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "2",
            name: "Anasqt Najatsd ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "3",
            name: "Anadfs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "4",
            name: "Anahs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "5",
            name: "Anazs Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "6",
            name: "Anafdds Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "7",
            name: "Anass Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
          {
            id: "8",
            name: "Anasa Najat ",
            img: "https://th.bing.com/th/id/R.9edcc6a214dfbd4e899f9d175f114706?rik=1XqL2HLJK%2bvo9Q&pid=ImgRaw&r=0",
          },
        ],
      },
      {
        id: "4_4",
        label: "Planned Date",
        keyboardType: "default",
        placeholder: "e.g., 2024-03-10",
        selectType: "plannedDate",
        type: "date",
      },
      {
        id: "4_5",
        label: "Actual Completion Date",
        keyboardType: "default",
        placeholder: "e.g., 2024-03-12",
        selectType: "completionDate",
        type: "date",
      },
    ],
  },
  {
    id: "5",
    sectionTitle: "Validation and Closure",
    nextPageTitle: "Submit",
    fields: [
      {
        id: "5_1",
        label: "Team Awareness",
        keyboardType: "default",
        placeholder: "Morning / Evening / Night",
        selectType: "teamAwareness",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Morning",
          },
          {
            id: "2",
            type: "Evening",
          },
          {
            id: "3",
            type: "Night",
          },
        ],
      },
      {
        id: "5_2",
        label: "Validation of Actions",
        keyboardType: "default",
        placeholder: "Morning / Evening / Night",
        selectType: "validationActions",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Morning",
          },
          {
            id: "2",
            type: "Evening",
          },
          {
            id: "3",
            type: "Night",
          },
        ],
      },
      {
        id: "5_3",
        label: "Manager Comments",
        keyboardType: "default",
        placeholder: "Additional feedback(optinal)",
        selectType: "managerComments",
        type: "textInput",
      },
      {
        id: "5_4",
        label: "Signatures",
        keyboardType: "default",
        placeholder: "Select responsible managers",
        selectType: "signatures",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Supervisor",
          },
          {
            id: "2",
            type: "UAP Manager",
          },
          {
            id: "3",
            type: "Site Director",
          },
        ],
      },
      {
        id: "5_5",
        label: "Escalation Needed?",
        keyboardType: "default",
        placeholder: "Yes / No",
        selectType: "escalationNeeded",
        type: "select",
        optionsLabelField: "type",
        options: [
          {
            id: "1",
            type: "Yes",
          },
          {
            id: "2",
            type: "No",
          },
        ],
      },
    ],
  },
];

export const NOTIFICATIONS = [
  {
    id: "1",
    type: "FPS",
    title: "FPS #A4512",
    description: "Your FPS report has been successfully submitted.",
    timestamp: "2024-03-04 14:30",
    status: "read",
  },
  {
    id: "2",
    type: "FPS",
    title: "FPS #A4512",
    description: "Your FPS report has been successfully submitted.",
    timestamp: "2024-03-04 14:30",
    status: "read",
  },
  {
    id: "3",
    type: "FPS",
    title: "FPS #A4512",
    description: "Your FPS report has been successfully submitted.",
    timestamp: "2024-03-04 14:30",
    status: "read",
  },

  {
    id: "4",
    type: "System",
    title: "System Maintenance Alert",
    description: "System updates scheduled for March 6, 2024.",
    timestamp: "2024-03-02 09:00",
    status: "read",
  },
  {
    id: "5",
    type: "TAG",
    title: "TAG #B7323 Resolved",
    description: "Your reported issue has been resolved.",
    timestamp: "2024-03-01 16:10",
    status: "unread",
  },
  {
    id: "6",
    type: "FPS",
    title: "FPS #C9876 Created",
    description: "You successfully created a new FPS report.",
    timestamp: "2024-02-28 14:55",
    status: "read",
  },
  {
    id: "7",
    type: "System",
    title: "Safety Alert",
    description: "New safety protocols have been added to the system.",
    timestamp: "2024-02-27 08:30",
    status: "read",
  },
  {
    id: "8",
    type: "TAG",
    title: "TAG #D5432 Pending Review",
    description: "Your reported anomaly is waiting for approval.",
    timestamp: "2024-02-26 19:20",
    status: "read",
  },
  {
    id: "9",
    type: "Announcement",
    title: "New Training Available",
    description: "A new training module has been added for FPS reporting.",
    timestamp: "2024-02-25 10:05",
    status: "read",
  },
  {
    id: "10",
    type: "TAG",
    title: "TAG #B8123 Needs More Info",
    description: "A supervisor requested more details on your report.",
    timestamp: "2024-02-24 15:45",
    status: "read",
  },
];

export const FORMTOAST_TYPES = {
  info: {
    label: "Normal",
    bgColor: "#0070C030",
    icon: "alert-circle",
    iconColor: "#0777e7",
  },
  warn: {
    label: "Urgent",
    bgColor: "#ffaa0030",
    icon: "alert",
    iconColor: "#ffaa00",
  },
  error: {
    label: "T.Urgent",
    bgColor: "#FF000030",
    icon: "alert-octagon",
    iconColor: "#FF0000",
  },
  success: {
    label: "T.Urgent",
    bgColor: "#00B05030",
    icon: "check-decagram",
    iconColor: "#00B050",
  },
};
export const HOMEDATA = [
  {
    id: 1,
    icon: tagIcon,
    title: "My Tags",
    subTitle: "You have 100 Tags",
    navigation: "",
  },
  {
    id: 2,
    icon: tagIcon,
    title: "My Actions",
    subTitle: "20 new actions added",
    navigation: "",
  },
  { id: 3, icon: tagIcon, title: "Audit", subTitle: "Audit", navigation: "" },
];
