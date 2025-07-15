// =========================
// src/components/GPUSelector.js
// =========================
import React from 'react';
import { Card } from 'react-bootstrap';
import { GPU_DATA } from '../data/gpuData';

// Map each model to its company
const companyMap = {
  RTX5090: 'NVIDIA',
  RTX4090: 'NVIDIA',
  RTX5080: 'NVIDIA',
  RX7900XT: 'AMD',
};

export default function GPUSelector({ options, selected, onToggle, currency, rate }) {
  return options.map((model) => {
    const company = companyMap[model] || '';
    const history = GPU_DATA[model];
    const latest = history[history.length - 1];
    const rawPrice = latest.retail ?? latest.secondHand ?? 0;
    const displayPrice = currency === 'CAD' ? Math.round(rawPrice * rate) : rawPrice;
    const priceLabel = `${displayPrice} ${currency}`;

    return (
      <Card
        key={model}
        className={`m-2 gpu-card ${selected.includes(model) ? 'border-success' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => onToggle(model)}
      >
        <Card.Img
          variant="top"
          src={`/images/${model}.png`}
          className="p-2 img-fluid"
        />
        <Card.Body>
          <Card.Title>{model}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{company}</Card.Subtitle>
          <Card.Text>{priceLabel}</Card.Text>
        </Card.Body>
      </Card>
    );
  });
}
