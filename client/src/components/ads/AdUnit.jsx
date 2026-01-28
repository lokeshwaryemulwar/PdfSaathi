import React, { useEffect } from 'react';

const AdUnit = ({ slot, format = 'auto', responsive = 'true', style = {} }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense Error:", e);
        }
    }, []);

    return (
        <div style={{ margin: '2rem 0', textAlign: 'center', overflow: 'hidden', ...style }} className="ad-unit">
            <span style={{ display: 'block', fontSize: '10px', color: '#ccc', marginBottom: '5px' }}>Advertisement</span>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3315474783468485"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}>
            </ins>
        </div>
    );
};

export default AdUnit;
