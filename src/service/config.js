// Test API locally
// const devBaseURL = "http://localhost:3000";
// const proBaseURL = "http://localho st:3000";
// APIs have been deployed to the server
const devBaseURL = "http://39.102.36.212:3000";
const proBaseURL = "http://39.102.36.212:3000";
// const devBaseURL = "http://123.207.32.32:9001/";
// const proBaseURL = "http://123.207.32.32:9001/";
export const BASE_URL =
  process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL

export const TIMEOUT = 8000
