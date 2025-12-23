import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { tools } from '../../data/tools';
import './FeatureGrid.css';

const FeatureGrid = ({ limit }) => {
    const displayTools = limit ? tools.slice(0, limit) : tools;

    return (
        <div className="feature-grid">
            {displayTools.map((tool) => {
                const Icon = tool.icon;
                return (
                    <Link
                        key={tool.id}
                        to={tool.path}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        aria-label={`${tool.title} - ${tool.description}`}
                    >
                        <Card
                            hoverable
                            className="tool-card"
                        >
                            <div className="tool-icon-wrapper" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                                <Icon size={28} />
                            </div>
                            <h3 className="tool-title">{tool.title}</h3>
                            <p className="tool-desc">{tool.description}</p>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
};

export default FeatureGrid;
