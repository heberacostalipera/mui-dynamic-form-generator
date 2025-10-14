import createReducer from "../utils/createReducer";
import { ACTIONS, DEFAULT_FIELDS, moveIndex, newField } from "./fields-helpers";

const handlers = {
  [ACTIONS.ADD]: (state) => {
    const label = `Field ${state.length + 1}`;
    return [...state, newField({ label })];
  },

  [ACTIONS.UPDATE]: (state, action) => {
    const f = action.payload;
    return state.map((x) => (x.id === f.id ? f : x));
  },

  [ACTIONS.REMOVE]: (state, action) => {
    const id = action.payload;
    return state.filter((x) => x.id !== id);
  },

  [ACTIONS.MOVE]: (state, action) => {
    const { from, to } = action.payload;
    return moveIndex(state, from, to);
  },

  [ACTIONS.DUPLICATE]: (state, action) => {
    const f = action.payload;
    const idx = state.findIndex((x) => x.id === f.id);
    if (idx === -1) return state;
    const clone = {
      ...f,
      id: crypto.randomUUID(),
      name: f.name + "_copy",
      label: f.label + " (copy)",
    };
    const copy = [...state];
    copy.splice(idx + 1, 0, clone);
    return copy;
  },

  [ACTIONS.CLEAR]: () => [],

  [ACTIONS.RESET_DEFAULTS]: () => DEFAULT_FIELDS.map(newField),

  [ACTIONS.SET_ALL]: (state, action) =>
    Array.isArray(action.payload) ? action.payload : state,
};

export const fieldsReducer = createReducer([], handlers);
