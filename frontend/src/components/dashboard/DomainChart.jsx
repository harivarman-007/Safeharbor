import React from 'react';

const DomainChart = ({ data }) => {
  const maxValue = data && data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;

  return (
    <div className="chart-container">
      <h3 style={{ marginBottom: '1.25rem' }}>Incident Distribution by Type</h3>
      <div className="bar-chart">
        {data && data.length > 0 ? (
          data.map((item, index) => {
            const widthPercentage = (item.value / maxValue) * 100;
            return (
              <div key={index} className="chart-bar-row">
                <span className="chart-label" title={item.label}>
                  {item.label}
                </span>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
                <span className="chart-value">{item.value}</span>
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
