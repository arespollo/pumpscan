import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
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
}

const CryptoTable = () => {
  const [data, setData] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(false);

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

  const getRowClassName = (record: CryptoCurrency): string => {
    if (isRecent(record.created_timestamp, 12 * 60)) {
      return "bg-green-200"; // Tailwind class for light green background
    }
    if (
      record.king_of_the_hill_timestamp &&
      isRecent(record.king_of_the_hill_timestamp, 30)
    ) {
      return "bg-green-200"; // Same Tailwind class, adjust if needed
    }
    return "";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let fetchedData = await fetchCryptoData();
      fetchedData = fetchedData.filter(
        (item) =>
          isRecent(item.created_timestamp) && item.usd_market_cap < 70000
      );
      setData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]); // Handle the error state as you see fit
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1 className="flex justify-center">Pump Scan</h1>
      <div className="flex justify-center">
        <Button
          onClick={loadData}
          className="text-white bg-blue-500 hover:bg-blue-700"
        >
          Refresh Data
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        rowClassName={getRowClassName}
      />
    </div>
  );
};

export default CryptoTable;
