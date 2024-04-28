import axios, { AxiosError } from 'axios'

// 定义单个API调用
const fetchSingleBatch = async (offset: number, limit: number = 50) => {
  const url = `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${offset}&limit=${limit}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`;
  const response = await axios.get(url);
  return response.data;
};

// 一次性调用多个API
export const fetchCryptoData = async () => {
  const offsets = [0, 50, 100, 150, 200, 250]; // Define offsets for pagination
  try {
    const promises = offsets.map(offset => fetchSingleBatch(offset));
    const results = await Promise.all(promises);
    return results.flat(); // Combine all results into one array
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};
