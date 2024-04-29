import React from "react";
import { Avatar, Tag } from "antd";
import { FilterDropdownProps } from "antd/lib/table/interface";
import NumberRangeFilter from "./filter";

// 定义列的接口，如果需要可以扩展此接口
interface ColumnInterface {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  sorter?:
    | ((a: any, b: any) => number)
    | { compare: (a: any, b: any) => number; multiple: number };
  filterDropdown?: (props: FilterDropdownProps) => React.ReactNode;
  onFilter?: (value: any, record: any) => boolean; // Adding this line
}

// 定义数据行接口，根据你的数据模型适当调整
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
  },
  {
    title: "MC",
    dataIndex: "usd_market_cap",
    key: "usd_market_cap",
    render: (value: number) => `${(value / 1000).toFixed(1)}K`,
    sorter: {
      compare: (a: CryptoCurrency, b: CryptoCurrency) =>
        a.usd_market_cap - b.usd_market_cap,
      multiple: 1,
    },
    onFilter: (filterValues, record) => {
      if (!filterValues || filterValues.length === 0) return true;
      const filterInfo = JSON.parse(filterValues);
      return (
        (!filterInfo.min || record.usd_market_cap >= filterInfo.min * 1000) &&
        (!filterInfo.max || record.usd_market_cap <= filterInfo.max * 1000)
      );
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <NumberRangeFilter
        onFilter={(min, max) => {
          const mixedKey = JSON.stringify({ min, max });
          setSelectedKeys([mixedKey]);
          confirm();
        }}
        confirm={confirm}
        onReset={() => {
          setSelectedKeys([]);
          confirm();
        }}
        clearFilters={clearFilters}
        minPlaceholder="Min (K)" // Custom placeholder for min input
        maxPlaceholder="Max (K)" // Custom placeholder for max input
      />
    ),
  },
  {
    title: "Created Time",
    dataIndex: "created_timestamp",
    key: "created_timestamp",
    onFilter: (value, record) => {
      // Convert the time range in minutes to milliseconds
      const filterInfo = JSON.parse(value);
      const currentTime = Date.now();
      const timeDiff = currentTime - record.created_timestamp;
      const minTime =
        filterInfo.min !== undefined ? filterInfo.min * 60000 : undefined;
      const maxTime =
        filterInfo.max !== undefined ? filterInfo.max * 60000 : undefined;

      // Apply the time filter
      return (
        (minTime === undefined || timeDiff >= minTime) &&
        (maxTime === undefined || timeDiff <= maxTime)
      );
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <NumberRangeFilter
        onFilter={(min, max) => {
          const mixedKey = JSON.stringify({ min, max });
          setSelectedKeys([mixedKey]);
          confirm();
        }}
        confirm={confirm}
        clearFilters={clearFilters}
        minPlaceholder="Min (Minute)" // Custom placeholder for min input
        maxPlaceholder="Max (Minute)" // Custom placeholder for max input
      />
    ),
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
          {Math.floor((Date.now() - value) / 60000)}m ago
          <br />
          {displayValue}
        </Tag>
      );
    },
    sorter: {
      compare: (a: CryptoCurrency, b: CryptoCurrency) =>
        a.created_timestamp - b.created_timestamp,
      multiple: 2,
    },
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
    onFilter: (value, record) => {
      // Convert the time range in minutes to milliseconds
      const filterInfo = JSON.parse(value);
      const currentTime = Date.now();
      const timeDiff = currentTime - record.king_of_the_hill_timestamp;
      const minTime =
        filterInfo.min !== undefined ? filterInfo.min * 60000 : undefined;
      const maxTime =
        filterInfo.max !== undefined ? filterInfo.max * 60000 : undefined;

      // Handle undefined king_of_the_hill_timestamp (N/A values)
      if (!filterInfo.includeNA && !record.king_of_the_hill_timestamp) {
        return false; // Exclude items without a timestamp
      }

      // Apply the time filter
      return (
        (minTime === undefined || timeDiff >= minTime) &&
        (maxTime === undefined || timeDiff <= maxTime)
      );
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <NumberRangeFilter
        onFilter={(min, max, includeNA) => {
          const mixedKey = JSON.stringify({ min, max, includeNA });
          setSelectedKeys([mixedKey]);
          confirm();
        }}
        confirm={confirm}
        clearFilters={clearFilters}
        minPlaceholder="Min (Minute)" // Custom placeholder for min input
        maxPlaceholder="Max (Minute)" // Custom placeholder for max input
        showNACheckbox={true} // Show the N/A checkbox
      />
    ),
    sorter: {
      compare: (a: CryptoCurrency, b: CryptoCurrency) =>
        (a.king_of_the_hill_timestamp ?? 0) -
        (b.king_of_the_hill_timestamp ?? 0),
      multiple: 3,
    },
  },
  {
    title: "Reply Count",
    dataIndex: "reply_count",
    key: "reply_count",
    sorter: {
      compare: (a: CryptoCurrency, b: CryptoCurrency) =>
        a.reply_count - b.reply_count,
      multiple: 4,
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <NumberRangeFilter
        onFilter={(min, max) => {
          const mixedKey = JSON.stringify({ min, max });
          setSelectedKeys([mixedKey]);
          confirm();
        }}
        confirm={confirm}
        clearFilters={clearFilters}
        minPlaceholder="Min Count"
        maxPlaceholder="Max Count"
      />
    ),
    onFilter: (value, record) => {
      const filterInfo = JSON.parse(value);

      return (
        (filterInfo.min === undefined ||
          record.reply_count >= filterInfo.min) &&
        (filterInfo.max === undefined || record.reply_count <= filterInfo.max)
      );
    },
  },
  {
    title: "Last Reply",
    dataIndex: "last_reply",
    key: "last_reply",
    render: (value: number) =>
      `${Math.floor((Date.now() - value) / 60000)}m ago`,
    sorter: {
      compare: (a: CryptoCurrency, b: CryptoCurrency) =>
        a.last_reply - b.last_reply,
      multiple: 5,
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <NumberRangeFilter
        onFilter={(min, max) => {
          const mixedKey = JSON.stringify({ min, max });
          setSelectedKeys([mixedKey]);
          confirm();
        }}
        confirm={confirm}
        clearFilters={clearFilters}
        minPlaceholder="Min (Minutes)"
        maxPlaceholder="Max (Minutes)"
      />
    ),
    onFilter: (value, record) => {
      const filterInfo = JSON.parse(value);

      const timeDiff = (Date.now() - record.last_reply) / 60000;
      return (
        (filterInfo.min === undefined || timeDiff >= filterInfo.min) &&
        (filterInfo.max === undefined || timeDiff <= filterInfo.max)
      );
    },
  },
  {
    title: "Last Trade",
    dataIndex: "last_trade_timestamp",
    key: "last_trade_timestamp",
    render: (value: number) =>
      `${Math.floor((Date.now() - value) / 60000)}m ago`,
    sorter: {
      compare: (a: CryptoCurrency, b: CryptoCurrency) =>
        a.last_trade_timestamp - b.last_trade_timestamp,
      multiple: 6,
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <NumberRangeFilter
        onFilter={(min, max) => {
          const mixedKey = JSON.stringify({ min, max });
          setSelectedKeys([mixedKey]);
          confirm();
        }}
        confirm={confirm}
        clearFilters={clearFilters}
        minPlaceholder="Min (Minutes)"
        maxPlaceholder="Max (Minutes)"
      />
    ),
    onFilter: (value, record) => {
      const filterInfo = JSON.parse(value);

      const timeDiff = (Date.now() - record.last_trade_timestamp) / 60000;
      return (
        (filterInfo.min === undefined || timeDiff >= filterInfo.min) &&
        (filterInfo.max === undefined || timeDiff <= filterInfo.max)
      );
    },
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
];

export default columns;
