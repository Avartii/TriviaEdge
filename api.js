import axios from "axios";

const fetchQuestions = async (params, retries = 3) => {
  const cacheKey = JSON.stringify(params);
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    console.log("Using cached data.");
    return JSON.parse(cachedData);
  }

  try {
    const response = await axios.get("https://opentdb.com/api.php", { params });
    const questions = response.data.results;
    localStorage.setItem(cacheKey, JSON.stringify(questions));
    return questions;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn("Rate limit hit. Retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return fetchQuestions(params, retries - 1);
    }
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export default fetchQuestions;
