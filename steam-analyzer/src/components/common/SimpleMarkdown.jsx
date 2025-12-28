import React from 'react';

const SimpleMarkdown = ({ text }) => {
    if (!text) return null;
    return (
        <div className="space-y-1 text-slate-600">
            {text.split('\n').map((line, i) => {
                if (line.trim() === '') return <div key={i} className="h-2" />;
                const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
                const cleanLine = isBullet ? line.trim().substring(2) : line;
                const isHeader = line.trim().startsWith('##');
                const headerText = isHeader ? line.trim().replace(/^#+\s*/, '') : cleanLine;
                const parts = headerText.split(/(\*\*.*?\*\*)/g);
                if (isHeader) return <h4 key={i} className="font-bold text-slate-800 mt-2 mb-1">{headerText.replace(/\*\*/g, '')}</h4>
                return (
                    <div key={i} className={`${isBullet ? 'pl-4 flex items-start' : ''}`}>
                        {isBullet && <span className="mr-2 text-indigo-400">•</span>}
                        <p className="inline leading-relaxed">
                            {parts.map((part, j) => (part.startsWith('**') && part.endsWith('**') ? <strong key={j} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong> : part))}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default SimpleMarkdown;
