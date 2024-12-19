import { combineReducers } from "redux";
import { FETCH_PRESCRIPTIONS, RESET_PREDICTION, SET_LOADING, SET_PREDICTION, SET_PREVIEW_IMAGE, SET_SELECTED_FILE } from "./types";

const initialState = {
  prescriptions: [],
  loading: false,
  prediction: null,
  selectedFile: null,
  previewImage: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRESCRIPTIONS:
      return {
        ...state,
        prescriptions: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_PREDICTION:
      return {
        ...state,
        prediction: action.payload,
      };
    case RESET_PREDICTION:
      return {
        ...state,
        prediction: null,
      };
    case SET_SELECTED_FILE:
      return {
        ...state,
        selectedFile: action.payload,
      };
    case SET_PREVIEW_IMAGE:
      return {
        ...state,
        previewImage: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
});
