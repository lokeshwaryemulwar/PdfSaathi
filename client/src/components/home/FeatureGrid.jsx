import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { tools } from '../../data/tools';
import './FeatureGrid.css';

const FeatureGrid = ({ limit }) => {
    const navigate = useNavigate();
    const displayTools = limit ? tools.slice(0, limit) : tools;

    return (
        <div className="feature-grid">
            {displayTools.map((tool) => {
                const Icon = tool.icon;
                return (
                    <Card
                        key={tool.id}
                        hoverable
                        className="tool-card"
                        onClick={() => navigate(tool.path)}
                    >
                        <div className="tool-icon-wrapper" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                            <Icon size={28} />
                        </div>
                        <h3 className="tool-title">{tool.title}</h3>
                        <p className="tool-desc">{tool.description}</p>
                    </Card>
                );
            })}
        </div>
    );
};

export default FeatureGrid;
