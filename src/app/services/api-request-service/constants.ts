export const projectKey = process.env.CTP_PROJECT_KEY
  ? process.env.CTP_PROJECT_KEY
  : "";
export const scopes = process.env.CTP_SCOPES ? [process.env.CTP_SCOPES] : [];
export const clientId = process.env.CTP_CLIENT_ID
  ? process.env.CTP_CLIENT_ID
  : "";
export const clientSecret = process.env.CTP_CLIENT_SECRET
  ? process.env.CTP_CLIENT_SECRET
  : "";
export const region = "europe-west1.gcp";
