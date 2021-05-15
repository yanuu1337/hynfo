# Hynfo
## _Multi-functional Hypixel  API Wrapper for [Node.JS]!_
This is an API wrapper package for Minecraft's most popular server, Hypixel! 


```javascript
const Hynfo = require('hynfo');
const client = new Hynfo({api_key: 'YOUR_HYPIXEL_API_KEY'})
// use '/api new' in-game to get your api key!

client.getPlayer('YaNuu_').then(async res => {
    console.log(res)
})
```

# Install
`npm install hynfo`

# Features
- ## Player
- `.getPlayer(IGN)` - Access player info 
- `.getFriends(IGN)` - Get Players friends
- `.getRecentGames(IGN)` - Get recent games played by the user
- `.IfOnline(IGN)` - Get a boolean whether the user is online or not
- `.getSession(IGN)` - Get current player status (game, status, etc.)
- ## Guild
- `.getGuild(GUILDNAME)` - Access Guild info
- `.findGuildByPlayer(IGN)` - Access Guild Info based on a user
- ## Skyblock
-  `.getProfileFromName(IGN, CUTE_NAME)` - Get user profile by cute name (Watermelon/Grape/etc.) 
-  `.getSkyblockProfile(PROFILEID)` - Get skyblock profile by its ID
- ## Misc
- `.getKeyInfo(API_KEY)` - Get Info about an API key (owner, limits etc.)
- `.getNames(IGN)` - Get all past names and timestamps from Mojang (search by current name)
-   `.getWatchdog()` - Get current watchdog statistics
- `.getLBs()` - Get all Leaderboards
- `.getLeaderBoard(GAME_MODE)` - Get Leaderboard for a specific game mode
- ## Resources
- `.getAchievements()` - Get all Achievements
- `.getGameAchievements(GAME_MODE)` - Get achievements for a specific game mode
- `.getChallenges()` - Get all challenges
- `.getGameChallenges(GAME_MODE)` - Get challenges for a specific game mode
- `.getQuests()` - Get all quests
- `.getGameQuests(GAME_MODE)` - Get Quests for a specific game mode
- `.getGuildAchievements()` - Get all guild achievements
- `.getGuildPermissions()` - Get all guild permissions

# Useless events (cuz why not)
- `nameReceive` - Emitted when `getNames` data is received
- `guildData` - Emitted when `getGuild` OR `findGuildByPlayer` OR `getGuildAchievements` OR `getGuildPermissions` data is received
- `friendsData` - Emitted when `getFriends` data is received
- `recentGamesReceive` - Emitted when `getRecentGames` data is received
- `playerData` - Emitted when `getPlayer` OR `IfOnline` OR `getSession` data is received
- `skyblockData`- Emitted when `getSkyblockProfile` OR `getProfileFromName` data is received
- `APIKeyData` - Emitted when `getKeyInfo` data is received
- `achievementsData` - Emitted when `getAchievements` or `getGameAchievements` data is received
- `questsData` - Emitted when `getQuests` or `getGameQuests` data is received
- `lbData` - Emitted when `getLBs` or `getLeaderboard` data is received
- ## Global Events
- - `data` - Emitted when any data is received (all of the above events also emit `data`) (data is the only event that contains two params: `type` and `data`)
- - `resourceData` - Emitted when resource data is received (LBs, Guild/Normal Achievements, Guild Permissions, Watchdog, Quests, Challenges, Key Info)
- - `skyblockData` - guess 😉 (Emitted when skyblock profile information is received)



# Package used
- [centra] - The core lightweight HTTP client for [Node.JS]





## License

MIT

   [node.js]: <http://nodejs.org>
   [centra]: <https://www.npmjs.com/package/centra>
