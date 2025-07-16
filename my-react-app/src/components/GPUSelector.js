// =========================
// src/components/GPUSelector.js
// =========================
import React from 'react';
import { Card } from 'react-bootstrap';
import { GPU_DATA } from '../data/gpuData';

// Helper to insert space after RTX or RX
const formatModel = (model) =>
  model.replace(/^RTX/, 'RTX ').replace(/^RX/, 'RX ');

export default function GPUSelector({ options, selected, onToggle, currency, rate, lang}) {
  return options.map((model) => {
    const company = model.startsWith('RTX') ? 'NVIDIA' : 'AMD';
    const history = GPU_DATA[model];
    const latest = history[history.length - 1];
    const rawPrice = latest.retail ?? latest.secondHand ?? 0;
    const displayPrice =
      currency === 'CAD' ? Math.round(rawPrice * rate) : rawPrice;
    let priceLabel;
    console.log(lang)
    if (lang === 'en') {
      priceLabel = '$' + `${displayPrice} ${currency}`;
    }
    else {
      priceLabel = `${displayPrice}` + '$ ' + `${currency}`;
    }


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
          <Card.Title>{formatModel(model)}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {company}
          </Card.Subtitle>
          <Card.Text>{priceLabel}</Card.Text>
        </Card.Body>
      </Card>
    );
  });
}
