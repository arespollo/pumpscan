import React, { useEffect, useState, useRef } from "react";
import { Table } from "antd";
import axios from "axios";
import columns from "../components/columns";

interface CryptoCurrency {
  id: string;
  rank: number;
  image_uri: string;
  symbol: string;
  usd_market_cap: number;
  progress: number;
  created_timestamp: number;
  reply_count: number;
  last_reply: number;
  last_trade_timestamp: number;
  mint: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  king_of_the_hill_timestamp?: number;
  virtual_token_reserves: number;
  total_supply: number;
}

const CryptoTable = () => {
  const [data, setData] = useState<CryptoCurrency[]>([]);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null); // NodeJS.Timeout for Node.js or number for browser
  const refreshFrequency = 10000; // 10 sec, can be changed to your preferred interval

  const fetchCryptoData = async () => {
    const urls = [
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${0}&limit=${50}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${50}&limit=${50}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${100}&limit=${50}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${150}&limit=${50}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${200}&limit=${50}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${250}&limit=${50}&sort=market_cap&order=DESC&includeNsfw=false&complete=false`,
    ];
    try {
      const promises = urls.map((url) => axios.get(url));
      const results = await Promise.all(promises);
      return results.flatMap((result) => result.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

  const isRecent = (timestamp: number, minutes = 4320): boolean => {
    const timeInMillis = minutes * 60 * 1000;
    return Date.now() - timestamp <= timeInMillis;
  };

  const refreshData = async () => {
    try {
      let fetchedData = await fetchCryptoData();
      fetchedData = fetchedData.filter(
        (item) =>
          isRecent(item.created_timestamp) && item.usd_market_cap < 65000
      );
      setData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]); // Handle the error state as you see fit
    }
  };

  useEffect(() => {
    // Fetch data initially
    refreshData();

    // Set up the auto-refresh interval
    refreshInterval.current = setInterval(() => {
      refreshData();
    }, refreshFrequency);

    // Clear the interval when the component is unmounted
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);

  return (
    <div className="App flex flex-col items-center px-4 lg:px-4">
      <h1 className="text-center text-4xl font-bold text-gray-800 my-6 shadow-md p-4 rounded-lg">
        Pump Scan
      </h1>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
      />
    </div>
  );
};

export default CryptoTable;
