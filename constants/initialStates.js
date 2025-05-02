import { TAGFILTERDATA } from "./data";

export const initialTags = [
  {
    id: 1,
    description: "Safety hazard in Zone A",
    type: "Sécurité",
    zone: "Zone A",
    machine: "Machine 1",
    priority: "Urgent",
  },
  {
    id: 2,
    description: "Production delay in Zone B",
    type: "Production",
    zone: "Zone B",
    machine: "Machine 2",
    priority: "Normal",
  },
  {
    id: 3,
    description: "Maintenance required for Machine 3",
    type: "Maintenance",
    zone: "Zone C",
    machine: "Machine 3",
    priority: "T.Urgent",
  },
  {
    id: 4,
    description: "Quality issue in Zone D",
    type: "Qualité",
    zone: "Zone D",
    machine: "Machine 4",
    priority: "Urgent",
  },
];

export const initialFilters = {
  categories: [],
  priority: [],
  status: [],
  sort: TAGFILTERDATA?.SORT_BY?.data[0]?.id,
  date: {
    selectedFromDate: new Date("2020-01-01"),
    selectedToDate: null,
    isFromDatePickerVisible: false,
    isToDatePickerVisible: false,
  },
};

export const initialTagForm = {
  tagNumber: null,
  category: null,
  description: null,
  images: [
    { id: "1", selectedImg: null },
    { id: "2", selectedImg: null },
    { id: "3", selectedImg: null },
    { id: "4", selectedImg: null },
  ],
  zone: null,
  machine: null,
  equipment: null,
  priority: null,
  status: null,
  foundBy: null,
  responsiblePerson: [],
  actions: null,
  deadline: new Date(),
};
