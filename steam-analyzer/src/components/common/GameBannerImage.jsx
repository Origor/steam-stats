import React, { useState } from 'react';

const GameBannerImage = ({ appid, className }) => {
    const [imageSrc, setImageSrc] = useState(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_hero.jpg`);

    return (
        <img
            src={imageSrc}
            alt=""
            className={className}
            onError={() => {
                if (imageSrc.includes('library_hero.jpg')) {
                    setImageSrc(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`);
                }
            }}
        />
    );
};

export default GameBannerImage;
