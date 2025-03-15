import { predictionApi } from "./predictionApiclient";

export const getUserPredict = () =>
  predictionApi.get("/predict").then((res) => res.data);
