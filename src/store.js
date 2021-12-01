import { configureStore } from "@reduxjs/toolkit";
import chartReducer from "./reducers/chartReducer";

export default configureStore({
  reducer: {
    charts: chartReducer,
  },
});
