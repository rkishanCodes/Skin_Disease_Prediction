import axios from "axios";
import { FETCH_PRESCRIPTIONS, RESET_PREDICTION, SET_LOADING, SET_PREDICTION, SET_PREVIEW_IMAGE, SET_SELECTED_FILE } from "./types";

export const fetchPrescriptions = (patientId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/patient/pescription/${patientId}`
    );
    dispatch({
      type: FETCH_PRESCRIPTIONS,
      payload: response.data.prescriptions,
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const setLoading = (status) => ({
  type: SET_LOADING,
  payload: status,
});

export const setPrediction = (prediction) => ({
  type: SET_PREDICTION,
  payload: prediction,
});

export const resetPrediction = () => ({
  type: RESET_PREDICTION,
});

export const setSelectedFile = (file) => ({
  type: SET_SELECTED_FILE,
  payload: file,
});

export const setPreviewImage = (imageUrl) => ({
  type: SET_PREVIEW_IMAGE,
  payload: imageUrl,
});
