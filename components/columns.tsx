import React from "react";
import { Avatar, Tag } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

// 定义列的接口，如果需要可以扩展此接口
interface ColumnInterface {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
}

// 定义数据行接口，根据你的数据模型适当调整
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

const isRecent = (timestamp: number, minutes = 4320): boolean => {
  const timeInMillis = minutes * 60 * 1000;
  return Date.now() - timestamp <= timeInMillis;
};

const columns: ColumnInterface[] = [
  {
    title: "Avatar",
    dataIndex: "image_uri",
    key: "image_uri",
    render: (text: string) => <Avatar src={text} alt="Avatar" />,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    render: (text: string, record: CryptoCurrency) => (
      <a
        href={`https://www.pump.fun/${record.mint}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    ),
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      a.symbol.localeCompare(b.symbol),
  },
  {
    title: "MC",
    dataIndex: "usd_market_cap",
    key: "usd_market_cap",
    render: (value: number) => `${(value / 1000).toFixed(1)}K`,
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      a.usd_market_cap - b.usd_market_cap,
  },
  {
    title: "Progress",
    dataIndex: "progress",
    key: "progress",
    render: (_: any, record: CryptoCurrency) => {
      const progress =
        record.virtual_token_reserves && record.total_supply
          ? (record.virtual_token_reserves / record.total_supply) * 100
          : 0; // Fallback to 0 if data is not available
      return `${progress.toFixed(1)}%`;
    },
    sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
      const progressA =
        a.virtual_token_reserves && a.total_supply
          ? (a.virtual_token_reserves / a.total_supply) * 100
          : 0;
      const progressB =
        b.virtual_token_reserves && b.total_supply
          ? (b.virtual_token_reserves / b.total_supply) * 100
          : 0;
      return progressA - progressB;
    },
  },
  {
    title: "Created Time",
    dataIndex: "created_timestamp",
    key: "created_timestamp",
    render: (value: number, record: CryptoCurrency) => {
      let tagColor = "default"; // Default color for more than 12 hours
      if (isRecent(record.created_timestamp, 2 * 60)) {
        tagColor = "green"; // Green for within 2 hours
      } else if (isRecent(record.created_timestamp, 12 * 60)) {
        tagColor = "blue"; // Blue for within 12 hours
      }
      const displayValue = new Date(value).toLocaleString();

      return (
        <Tag color={tagColor} key={value}>
          {displayValue}
        </Tag>
      );
    },
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      a.created_timestamp - b.created_timestamp,
  },
  {
    title: "Reply Count",
    dataIndex: "reply_count",
    key: "reply_count",
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      a.reply_count - b.reply_count,
  },
  {
    title: "Last Reply",
    dataIndex: "last_reply",
    key: "last_reply",
    render: (value: number) =>
      `${Math.floor((Date.now() - value) / 60000)}m ago`,
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      a.last_reply - b.last_reply,
  },
  {
    title: "Last Trade",
    dataIndex: "last_trade_timestamp",
    key: "last_trade_timestamp",
    render: (value: number) =>
      `${Math.floor((Date.now() - value) / 60000)}m ago`,
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      a.last_trade_timestamp - b.last_trade_timestamp,
  },
  {
    title: "Buy",
    dataIndex: "mint",
    key: "buy",
    render: (mint: string) => (
      <a
        href={`https://gmgn.ai/sol/token/SlTvkKNLj_${mint}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Buy
      </a>
    ),
  },
  {
    title: "Twitter",
    dataIndex: "twitter",
    key: "twitter",
    render: (twitter: string) =>
      twitter ? (
        <a
          href={`https://${twitter}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      ) : null,
  },
  {
    title: "Telegram",
    dataIndex: "telegram",
    key: "telegram",
    render: (telegram: string) =>
      telegram ? (
        <a
          href={`https://${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>
      ) : null,
  },
  {
    title: "Website",
    dataIndex: "website",
    key: "website",
    render: (website: string) =>
      website ? (
        <a
          href={`https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>
      ) : null,
  },
  {
    title: "King",
    dataIndex: "king_of_the_hill_timestamp",
    key: "king_of_the_hill_timestamp",
    render: (value: number | undefined, record: CryptoCurrency) => {
      const isKOTHRecent = value && isRecent(value, 30);
      const tagColor = isKOTHRecent ? "green" : "default"; // Choose colors as needed
      const displayValue = value
        ? `${Math.floor((Date.now() - value) / 60000)}m ago`
        : "N/A";

      return (
        <Tag color={tagColor} key={value}>
          {displayValue}
        </Tag>
      );
    },
    sorter: (a: CryptoCurrency, b: CryptoCurrency) =>
      (a.king_of_the_hill_timestamp ?? 0) - (b.king_of_the_hill_timestamp ?? 0),
  },
];

export default columns;
