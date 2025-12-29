import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

const GameIcon = ({ appid, iconUrl, className, alt }) => {
    const [error, setError] = useState(false);

    if (error || !iconUrl) {
        return (
            <div className={`flex items-center justify-center bg-slate-100 rounded-lg ${className}`}>
                <ImageIcon className="w-1/2 h-1/2 text-slate-300" />
            </div>
        );
    }

    return (
        <img
            src={`http://localhost:3000/api/images/icon/${appid}/${iconUrl}`}
            alt={alt || ""}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export default GameIcon;
