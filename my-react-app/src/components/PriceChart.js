// =========================
// src/components/PriceChart.js
// =========================
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Card } from 'react-bootstrap';

export default function PriceChart({ model, data, chartTitle, currency, rate, labels }) {
  const plotData = data.map((row) => ({
    month: row.month,
    retail: row.retail != null ? Math.round((currency === 'CAD' ? row.retail * rate : row.retail)) : 1,
    secondHand: row.secondHand != null ? Math.round((currency === 'CAD' ? row.secondHand * rate : row.secondHand)) : 1
  }));

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{chartTitle}</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={plotData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(val) => `${val} ${currency}`} />
            <Legend />
            <Bar dataKey="retail" name={labels.retail} maxBarSize={10} />
            <Bar dataKey="secondHand" name={labels.secondHand} maxBarSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
