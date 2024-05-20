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
  created_timestamp: number;
  reply_count: number;
  last_reply: number;
  last_trade_timestamp: number;
  mint: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  king_of_the_hill_timestamp?: number;
}

const CryptoTable = () => {
  const [data, setData] = useState<CryptoCurrency[]>([]);
  const [loading, setLoding] = useState<boolean>();

  const refreshInterval = useRef<NodeJS.Timeout | null>(null); // NodeJS.Timeout for Node.js or number for browser
  const refreshFrequency = 10 * 1000; // 10 sec, can be changed to your preferred interval

  const fetchCryptoData = async () => {
    const urls = [
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${0}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${50}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${100}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${150}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${200}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${250}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${300}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${350}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${400}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${450}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${500}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${550}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
      `https://client-api-2-74b1891ee9f9.herokuapp.com/coins?offset=${600}&limit=${50}&sort=created_timestamp&order=DESC&includeNsfw=false`,
    ];
    try {
      const promises = urls.map((url) => axios.get(url));
      const results = await Promise.all(promises);
      let data = results.flatMap((result) => result.data);
      // Remove duplicates based on 'mint'
      const uniqueData = Array.from(new Set(data.map((a) => a.mint))).map(
        (mint) => {
          return data.find((a) => a.mint === mint);
        }
      );
      return uniqueData;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

  const isRecent = (timestamp: number, minutes = 4320): boolean => {
    const timeInMillis = minutes * 60 * 1000;
    return Date.now() - timestamp <= timeInMillis;
  };

  const refreshData = async (isFirst: boolean) => {
    if (isFirst) {
      setLoding(true); // Start loading only if it's the first load
    }
    try {
      let fetchedData = await fetchCryptoData();
      // Filter data based on criteria
      fetchedData = fetchedData.filter(
        (item) =>
          isRecent(item.created_timestamp) &&
          item.usd_market_cap <= 65000 &&
          item.complete === false
      );

      // Only update the state if the filtered data is not empty
      if (fetchedData.length > 0) {
        setData(fetchedData);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]); // Set empty data or handle errors as needed
    }
    setLoding(false); // Stop loading irrespective of the data received
  };

  useEffect(() => {
    // Fetch data initially
    refreshData(true);
    // Set up the auto-refresh interval
    refreshInterval.current = setInterval(() => {
      refreshData(false);
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
        loading={loading}
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
      />
    </div>
  );
};

export default CryptoTable;
