import React, { useState } from 'react';

const CustomDonutChart = ({ data, onCategorySelect, selectedCategory }) => {
    const size = 320;
    const strokeWidth = 24;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const visibleFraction = 0.75;
    const visibleCircumference = circumference * visibleFraction;

    let currentAngle = 0;
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="flex items-center justify-center py-4 pl-4"> {/* Added padding left to offset the visual weight */}
            <div className="relative" style={{ width: size, height: size }}>
                {/* Chart SVG */}
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-90 select-none drop-shadow-sm overflow-visible">
                    {/* Visual Layer - PURELY VISUAL (pointer-events-none) */}
                    {data.map((item, idx) => {
                        if (item.value === 0) return null;
                        const segmentLength = (item.value / total) * visibleCircumference;
                        const strokeDasharray = `${segmentLength} ${circumference}`;
                        const strokeDashoffset = -currentAngle;
                        currentAngle += segmentLength;

                        const isHovered = hoveredIndex === idx;
                        const isSelected = selectedCategory === item.id;
                        const isDimmed = (hoveredIndex !== null && !isHovered) || (selectedCategory && !isSelected);

                        return (
                            <circle
                                key={`visual-${idx}`}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={isHovered || isSelected ? strokeWidth + 6 : strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className={`transition-all duration-300 ease-out pointer-events-none ${isDimmed ? 'opacity-30' : 'opacity-100'} ${isHovered || isSelected ? 'brightness-110' : ''}`}
                            />
                        );
                    })}

                    {/* Interaction Layer - INVISIBLE HIT TARGETS (Reset angle loop) */}
                    {(() => {
                        let hitAngle = 0;
                        return data.map((item, idx) => {
                            if (item.value === 0) return null;
                            const segmentLength = (item.value / total) * visibleCircumference;
                            const strokeDasharray = `${segmentLength} ${circumference}`;
                            const strokeDashoffset = -hitAngle;
                            hitAngle += segmentLength;

                            return (
                                <circle
                                    key={`hit-${idx}`}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="none"
                                    stroke="transparent"
                                    strokeWidth={strokeWidth + 16} // Stable, wide hit area
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={(e) => { e.stopPropagation(); onCategorySelect(item.id); }}
                                    className="cursor-pointer transition-none"
                                />
                            );
                        });
                    })()}
                </svg>

                {/* Legend positioned in the "Invisible Circle" concept:
            Ideally centered at approx (270, 270) relative to top-left of this 320x320 container.
            We use absolute positioning to place it there.
        */}
                <div
                    className="absolute flex flex-col justify-center items-center gap-1 z-10 pointer-events-none"
                    style={{
                        width: size * 0.6,
                        height: size * 0.6,
                        bottom: -size * 0.1,
                        right: -size * 0.1,
                    }}
                >
                    {/* Header for Types count - Moved here as requested */}
                    <div className="flex items-baseline gap-1 mb-2 border-b-2 border-slate-100 pb-1 px-4">
                        <span className="text-2xl font-extrabold text-slate-700">{data.length}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Types</span>
                    </div>

                    {/* Legend Items */}
                    <div className="flex flex-col gap-1.5 pointer-events-auto">
                        {data.map((item, idx) => {
                            const isHovered = hoveredIndex === idx;
                            const isSelected = selectedCategory === item.id;
                            const isDimmed = (hoveredIndex !== null && !isHovered) || (selectedCategory && !isSelected);

                            return (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={(e) => { e.stopPropagation(); onCategorySelect(item.id); }}
                                    className={`flex items-center gap-2 text-xs cursor-pointer transition-all duration-300 px-2 py-0.5 rounded-lg ${isDimmed ? 'opacity-40 blur-[0.5px]' : 'opacity-100'} ${isHovered || isSelected ? 'bg-slate-50 scale-105 shadow-sm ring-1 ring-slate-100' : ''}`}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm shrink-0 transition-transform ${isHovered || isSelected ? 'scale-125' : ''}`} style={{ backgroundColor: item.color }}></div>
                                    <div className="flex items-baseline gap-2 min-w-0">
                                        <span className={`font-bold truncate transition-colors ${isHovered || isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{Math.round((item.value / total) * 100)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomDonutChart;
