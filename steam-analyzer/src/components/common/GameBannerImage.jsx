import React, { useState } from 'react';

const GameBannerImage = ({ appid, className }) => {
    // Use local backend proxy
    const [imageSrc, setImageSrc] = useState(`http://localhost:3000/api/images/banner/${appid}`);
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className={`${className} bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center`}>
                <span className="text-slate-400 opacity-50 text-xs font-mono">NO IMAGE</span>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt=""
            className={className}
            onError={() => {
                // If even the proxy fails (e.g. backend down), show error state
                setHasError(true);
            }}
        />
    );
};

export default GameBannerImage;
