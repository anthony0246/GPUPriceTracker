// =========================
// src/components/PriceChart.js
// =========================
import React, { useState, useEffect } from 'react';
import { Card, ButtonGroup, ToggleButton } from 'react-bootstrap';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function PriceChart({
  model,
  data,
  chartTitle,
  currency,
  rate,
  labels,
  diffLabels,
  unavailableText,
  viewToggle,
}) {
  const [view, setView] = useState('trend');
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 380);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const plotData = data.map((row, idx) => {
    const conv = (v) => (v != null ? Math.round((currency === 'CAD' ? v * rate : v)) : 0);
    const rVal = conv(row.retail);
    const sVal = conv(row.secondHand);
    let rDiff = 0, sDiff = 0;
    if (idx > 0) {
      const prev = data[idx - 1];
      rDiff = rVal - conv(prev.retail);
      sDiff = sVal - conv(prev.secondHand);
    }
    return {
      month: row.month,
      retail: rVal,
      secondHand: sVal,
      retailDiff: rDiff,
      secondDiff: sDiff,
      retailRaw: row.retail,
      secondHandRaw: row.secondHand,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <h6>{label}</h6>
          {payload.map((entry) => {
            const { dataKey, color, value } = entry;
            const isDiffKey = dataKey.endsWith('Diff');
            const valText = isDiffKey
              ? `${value} ${currency}`
              : entry.payload[`${dataKey}Raw`] == null
              ? unavailableText
              : `${value} ${currency}`;
            const labelText = isDiffKey
              ? diffLabels[dataKey.replace('Diff','')]
              : labels[dataKey];
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
        <ButtonGroup className="mb-2">
          <ToggleButton
            id={`${model}-trend`}
            type="radio"
            variant={view === 'trend' ? 'primary' : 'outline-primary'}
            name="view"
            value="trend"
            onChange={() => setView('trend')}
          >
            {viewToggle.trend}
          </ToggleButton>
          <ToggleButton
            id={`${model}-diff`}
            type="radio"
            variant={view === 'diff' ? 'primary' : 'outline-primary'}
            name="view"
            value="diff"
            onChange={() => setView('diff')}
          >
            {viewToggle.diff}
          </ToggleButton>
        </ButtonGroup>
        <ResponsiveContainer width="100%" height={300}>
          {view === 'trend' ? (
            <LineChart data={plotData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ marginTop: isNarrow ? 16 : 0 }} />
              <Line type="monotone" dataKey="retail" name={labels.retail} stroke="#007bff" dot />
              <Line type="monotone" dataKey="secondHand" name={labels.secondHand} stroke="#28a745" dot />
            </LineChart>
          ) : (
            <BarChart data={plotData} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={{ marginTop: isNarrow ? 16 : 0 }} />
              <Bar dataKey="retailDiff" name={diffLabels.retail} fill="#007bff" />
              <Bar dataKey="secondDiff" name={diffLabels.secondHand} fill="#28a745" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
