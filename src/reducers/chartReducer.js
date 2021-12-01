import { createSlice } from "@reduxjs/toolkit";

export const chartReducer = createSlice({
  name: "charts",
  initialState: { chartsData: [] },
  reducers: {
    getChartData: (state, action) => {
      state.chartsData = action.payload;
    },
    setChartData: (state, action) => {
      state.chartsData = action.payload;
    },
  },
});

export const { getChartData, setChartData } = chartReducer.actions;

export default chartReducer.reducer;
