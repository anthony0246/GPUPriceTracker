// =========================
// src/App.js
// =========================
import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import GPUSelector from './components/GPUSelector';
import PriceChart from './components/PriceChart';
import { GPU_DATA } from './data/gpuData';

// Helper to insert space after RTX or RX
const formatModel = (model) =>
  model.replace(/^RTX/, 'RTX ').replace(/^RX/, 'RX ');

const translations = {
  en: {
    title: 'GPUPriceTracker',
    subtitle: 'This page keeps track of high‑end consumer GPU prices.',
    instruction: 'Select one or more GPU models to learn more about their pricing.',
    placeholder: 'Click on a GPU option to learn more about it!',
    retail: 'Retail',
    secondHand: 'Second‑Hand',
    currency: { USD: 'USD', CAD: 'CAD' },
    toggle: { en: 'EN', fr: 'FR' },
    unavailable: 'Not Available',
    diffLabels: {
      retail: 'Retail monthly price difference',
      secondHand: 'Second‑Hand monthly price difference',
    },
    viewToggle: {
      trend: 'Trends',
      diff: 'Differences',
    },
    chartTitle: (model) => `${formatModel(model)} Pricing — Past 6 months`,
  },
  fr: {
    title: 'SuiviPrixGPU',
    subtitle: 'Cette page suit les prix des GPU grand public haut de gamme.',
    instruction: 'Sélectionnez un ou plusieurs modèles de GPU pour voir leurs prix.',
    placeholder: 'Cliquez sur une option GPU pour en savoir plus !',
    retail: 'Neuf',
    secondHand: 'Occasion',
    currency: { USD: 'USD', CAD: 'CAD' },
    toggle: { en: 'EN', fr: 'FR' },
    unavailable: 'Rupture de stock',
    diffLabels: {
      retail: 'Différence mensuelle (Neuf)',
      secondHand: 'Différence mensuelle (Occasion)',
    },
    viewToggle: {
      trend: 'Tendances',
      diff: 'Différences',
    },
    chartTitle: (model) => `Prix de ${formatModel(model)} — 6 derniers mois`,
  },
};

const CONVERSION_RATE = 1.32; // 1 USD = 1.32 CAD

function App() {
  const [lang, setLang] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [selected, setSelected] = useState([]);

  const t = translations[lang];

  const handleGPUClick = (model) => {
    setSelected((sel) =>
      sel.includes(model) ? sel.filter((m) => m !== model) : [...sel, model]
    );
  };

  return (
    <Container className="py-4 app-container">
      {/* Header & Toggles */}
      <Row className="align-items-center justify-content-between mb-4 flex-wrap">
        <Col xs="auto">
          <h1 className="mb-0 mb-sm-0">{t.title}</h1>
        </Col>
        <Col xs="auto" className="mt-2 mt-sm-0">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <ButtonGroup size="sm">
              <Button
                variant={lang === 'en' ? 'primary' : 'outline-primary'}
                onClick={() => setLang('en')}
              >
                {t.toggle.en}
              </Button>
              <Button
                variant={lang === 'fr' ? 'primary' : 'outline-primary'}
                onClick={() => setLang('fr')}
              >
                {t.toggle.fr}
              </Button>
            </ButtonGroup>
            <ButtonGroup size="sm">
              <Button
                variant={currency === 'USD' ? 'success' : 'outline-success'}
                onClick={() => setCurrency('USD')}
              >
                {t.currency.USD}
              </Button>
              <Button
                variant={currency === 'CAD' ? 'success' : 'outline-success'}
                onClick={() => setCurrency('CAD')}
              >
                {t.currency.CAD}
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>

      {/* Intro Text */}
      <p className="lead text-center">{t.subtitle}</p>
      <p className="text-center">{t.instruction}</p>

      {/* GPU Selector Cards */}
      <Row className="justify-content-center mb-4">
        <GPUSelector
          options={Object.keys(GPU_DATA)}
          selected={selected}
          onToggle={handleGPUClick}
          currency={currency}
          rate={CONVERSION_RATE}
          lang={lang}
        />
      </Row>

      {/* Placeholder or Charts */}
      {selected.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={8}>
            <p className="text-center fs-4 my-5">{t.placeholder}</p>
          </Col>
        </Row>
      ) : (
        selected.map((model) => (
          <PriceChart
            key={model}
            model={model}
            data={GPU_DATA[model]}
            chartTitle={t.chartTitle(model)}
            currency={currency}
            rate={CONVERSION_RATE}
            labels={{ retail: t.retail, secondHand: t.secondHand }}
            diffLabels={{
              retail: t.diffLabels.retail,
              secondHand: t.diffLabels.secondHand,
            }}
            unavailableText={t.unavailable}
            viewToggle={t.viewToggle}
          />
        ))
      )}
    </Container>
  );
}

export default App;