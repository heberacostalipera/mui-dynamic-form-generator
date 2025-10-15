export const newField = (overrides = {}) => ({
  id: crypto.randomUUID(),
  name: "field_" + Math.random().toString(36).slice(2, 7),
  label: "Untitled",
  type: "text",
  required: false,
  fullWidth: true,
  placeholder: "",
  helperText: "",
  options: "Option A, Option B",
  // date/datetime config
  format: "DD/MM/YYYY",
  minDate: "",
  maxDate: "",
  minDateTime: "",
  maxDateTime: "",
  ...overrides,
});

export const DEFAULT_FIELDS = [
  {
    label: "Full name",
    name: "fullName",
    placeholder: "John Doe",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
  },
  {
    label: "About you",
    name: "about",
    type: "textarea",
    helperText: "A short bio",
  },
  {
    label: "Role",
    name: "role",
    type: "select",
    options: "Engineer, Designer, Product",
  },
  { label: "Accept terms", name: "terms", type: "checkbox", required: true },
];

export const moveIndex = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
};

export const ACTIONS = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  REMOVE: "REMOVE",
  MOVE: "MOVE",
  DUPLICATE: "DUPLICATE",
  CLEAR: "CLEAR",
  RESET_DEFAULTS: "RESET_DEFAULTS",
  SET_ALL: "SET_ALL",
};
