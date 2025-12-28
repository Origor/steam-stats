export const MOCK_USER = {
    steamid: '76561198000000000',
    personaname: 'DemoGamer_99',
    avatarfull: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    profileurl: 'https://steamcommunity.com/',
    timecreated: 1262304000
};

export const MOCK_GAMES = [
    { appid: 730, name: 'Counter-Strike: Global Offensive', playtime_forever: 85000, rtime_last_played: 1700000000, img_icon_url: '69f7ebe2735c366c65c0b33dae00e12dc40edbe4' },
    { appid: 570, name: 'Dota 2', playtime_forever: 120000, rtime_last_played: 1698000000, img_icon_url: '0bf11a9e2e7760d3fe72db086629305601a337fb' },
    { appid: 440, name: 'Team Fortress 2', playtime_forever: 4500, rtime_last_played: 1650000000, img_icon_url: 'e3f595a92552da3d664ad00277fad2107345f743' },
    { appid: 271590, name: 'Grand Theft Auto V', playtime_forever: 100, rtime_last_played: 1680000000, img_icon_url: '1e7c62a87556c52d8b802a433f48a1c6a8585e51' },
    { appid: 252490, name: 'Rust', playtime_forever: 12000, rtime_last_played: 1701000000, img_icon_url: '82216e53c44862211624f1c7136015f5c8899880' },
    { appid: 292030, name: 'The Witcher 3: Wild Hunt', playtime_forever: 8000, rtime_last_played: 1640000000, img_icon_url: '96940d9d690a7862215c26914561845c083693e5' },
    { appid: 105600, name: 'Terraria', playtime_forever: 200, rtime_last_played: 1690000000, img_icon_url: '858961e95fdb869f7a6295822081597a9b0c58e5' },
    { appid: 1, name: 'Unplayed Game A', playtime_forever: 0, rtime_last_played: 0, img_icon_url: '' },
    { appid: 2, name: 'Unplayed Game B', playtime_forever: 0, rtime_last_played: 0, img_icon_url: '' },
];

export const MOCK_ACHIEVEMENTS = Array.from({ length: 30 }).map((_, i) => ({
    apiname: `ACHIEVEMENT_${i}`,
    name: `Achievement ${i + 1}`,
    description: "You did something amazing in the game.",
    achieved: 1,
    unlocktime: 1672531200 + (Math.random() * 31536000)
}));
