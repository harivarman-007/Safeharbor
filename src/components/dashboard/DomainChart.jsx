import React from 'react';

const DomainChart = ({ data }) => {
  const maxValue = data && data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;

  return (
    <div className="chart-container">
      <div className="panel-header">
        <h3 className="panel-title">INCIDENT DISTRIBUTION BY CLASSIFICATION</h3>
        <span className="mono-tag tag-neutral">ACTIVE METRICS</span>
      </div>
      <div className="bar-chart">
        {data && data.length > 0 ? (
          data.map((item, index) => {
            const heightPercentage = (item.value / maxValue) * 100;
            return (
              <div key={index} className="chart-bar-col">
                <span className="chart-value">{item.value}</span>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar-fill"
                    style={{ height: `${heightPercentage}%` }}
                  />
                </div>
                <span className="chart-label" title={item.label}>
                  {item.label}
                </span>
              </div>
            );
          })
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            No incident distribution details available.
          </p>
        )}
      </div>
    </div>
  );
};

export default DomainChart;
