// =========================
// src/App.js
// =========================
import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import GPUSelector from './components/GPUSelector';
import PriceChart from './components/PriceChart';
import { GPU_DATA } from './data/gpuData';

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
    chartTitle: (model) => `${model} Pricing — Past 6 months`,
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
    chartTitle: (model) => `Prix de ${model} — 6 derniers mois`,
  },
};

const CONVERSION_RATE = 0.72; // 1 USD = 0.72 CAD

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
    <Container className="py-4">
      {/* Header & Toggles */}
      <Row className="align-items-center mb-4">
        <Col><h1>{t.title}</h1></Col>
        <Col className="text-end">
          <ButtonGroup size="sm" className="me-2">
            <Button variant={lang === 'en' ? 'primary' : 'outline-primary'} onClick={() => setLang('en')}>
              {t.toggle.en}
            </Button>
            <Button variant={lang === 'fr' ? 'primary' : 'outline-primary'} onClick={() => setLang('fr')}>
              {t.toggle.fr}
            </Button>
          </ButtonGroup>
          <ButtonGroup size="sm">
            <Button variant={currency === 'USD' ? 'success' : 'outline-success'} onClick={() => setCurrency('USD')}>
              {t.currency.USD}
            </Button>
            <Button variant={currency === 'CAD' ? 'success' : 'outline-success'} onClick={() => setCurrency('CAD')}>
              {t.currency.CAD}
            </Button>
          </ButtonGroup>
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
          />
        ))
      )}
    </Container>
  );
}

export default App;