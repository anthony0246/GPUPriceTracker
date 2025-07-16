// =========================
// src/components/PriceChart.js
// =========================
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card } from 'react-bootstrap';

export default function PriceChart({ model, data, chartTitle, currency, rate, labels }) {
  const plotData = data.map((row) => ({
    month: row.month,
    retail: row.retail != null ? Math.round((currency === 'CAD' ? row.retail * rate : row.retail)) : 0,
    secondHand: row.secondHand != null ? Math.round((currency === 'CAD' ? row.secondHand * rate : row.secondHand)) : 0,
    retailRaw: row.retail,
    secondHandRaw: row.secondHand,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <h6>{label}</h6>
          {payload.map((entry) => {
            const { dataKey, color } = entry;
            const isNull = entry.payload[`${dataKey}Raw`] == null;
            const valText = isNull ? 'Not Available' : `${entry.value} ${currency}`;
            const labelText = dataKey === 'retail' ? labels.retail : labels.secondHand;
            return (
              <p key={dataKey} style={{ color, margin: 0 }}>
                {labelText}: {valText}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{chartTitle}</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={plotData}
            margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="retail"
              name={labels.retail}
              stroke="#007bff"
              dot
            />
            <Line
              type="monotone"
              dataKey="secondHand"
              name={labels.secondHand}
              stroke="#28a745"
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
