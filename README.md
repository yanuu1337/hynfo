# Hynfo
## _Multi-functional Hypixel  API Wrapper for [Node.JS]!_
This is an API wrapper package for Minecraft's most popular server, Hypixel! 


```javascript
const Hynfo = require('hynfo');
const client = new Hynfo({key: 'YOUR_HYPIXEL_API_KEY'})
// use '/api new' in-game to get your api key!

client.getPlayer('YaNuu_').then(async res => {
    console.log(res)
})
```

## Install
`npm install hynfo`

## Features
- # Player
- `.getPlayer(IGN)` - Access player info 
- `.getFriends(IGN)` - Get Players friends
- `.getRecentGames(IGN)` - Get recent games played by the user
- `.IfOnline(IGN)` - Get a boolean whether the user is online or not
- `.getSession(IGN)` - Get current player status (game, status, etc.)
- # Guild
- `.getGuild(GUILDNAME)` - Access Guild info
- `.findGuildByPlayer(IGN)` - Access Guild Info based on a user
- # Skyblock
-  `.getProfileFromName(IGN, CUTE_NAME)` - Get user profile by cute name (Watermelon/Grape/etc.) 
-  `.getSkyblockProfile(PROFILEID)` - Get skyblock profile by its ID
- # Misc
- `.getKeyInfo(API_KEY)` - Get Info about an API key (owner, limits etc.)
- `.getNames(IGN)` - Get all past names and timestamps from Mojang. (search by current name)
-   `.getWatchdog()` - Get current watchdog statistics
- `.getLBs()` - Get all Leaderboards
- `.getLeaderBoard()` - Get Leaderboard for a specific gamemode.

## Package used
- [centra] - The core lightweight HTTP client for [Node.JS]





## License

MIT

   [node.js]: <http://nodejs.org>
   [centra]: <https://www.npmjs.com/package/centra>