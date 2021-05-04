/*
Copyright 2021 Maciej Januś

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation 
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or 
sell copies of the Software, and to permit persons to
whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const centra = require('centra')
const events = require('events')
const uuidUtil = require('./util/uuidUtil')
const nameURL = `https://api.mojang.com/`
const hypixelURL = 'https://api.hypixel.net/'

class Hynfo {
    
    /**
     * @param {string} api_key - Valid Hypixel API Key (use "/api new" in-game to generate one) 
     */
    constructor(cnf) {
        this.api_key = cnf.api_key
        this.basePath = 'https://api.hypixel.net/'
        this.EventEmitter = new events.EventEmitter()

    }



    /**
     * @event Hynfo#nameReceive
     * @event Hynfo#data
     * @param {String} name - Get full name history from mojang API 
     * @returns Name history and timestamps
     */
    async getNames(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(nameURL).path(`user/profiles/${UUID}/names`).send()
        const jsonified = await res.json()
        if(jsonified.error) {
            throw new Error(jsonified.errorMessage || jsonified)
        } else {
            this.EventEmitter.emit('nameReceive', jsonified)
            this.EventEmitter.emit('data', jsonified)
            return jsonified;
            
            
        }
    }

    /**
     * 
     * GUILDS
     * 
     */

    /**
     * @param {String} gname - Guild Name
     * @returns - Guild Info
     */
     async getGuild(gname) {
        const res = await centra(hypixelURL).path('/guild').query({
            'key': this.api_key,
            'name': gname,
        }).send()
        const body = await res.json()
        if(body.error) {
            throw new Error(body.cause || body)
        }
        this.EventEmitter.emit('guildData', body)
        this.EventEmitter.emit('data', 'guild', body)
        return res;
    }

    /**
     * @param {String} ign - Player IGN (in a guild) 
     * @returns Guild info
     */
    async findGuildByPlayer(ign) {
        let UUID = await uuidUtil('name', ign)
        const res = await centra(hypixelURL).path('/guild').query({
            'key': this.api_key,
            'player': UUID,
        }).json()

        if(!res.success) throw new Error(res.cause || res)
        this.EventEmitter.emit('guildData', res)
        this.EventEmitter.emit('data', res)
        return res;
        

    }
    
    
    /**
     * 
     * PLAYER & SESSION
     * 
     */


    /**
     * @param {String} name - IGN of the player 
     * @returns Friends
     */
    async getFriends(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/friends').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()
    
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('friendsListReceive', body)
        this.EventEmitter.emit('data', 'friends', body)
        return body; 
    }
    
    /**
     * @param {String} name - IGN of the player 
     * @returns - Players recent games
     */
    async getRecentGames(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/recentgames').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()

        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('recentGamesReceive', body)
        this.EventEmitter.emit('data', 'player', body)
        return body;
    }


    /**
     * @param {String} name - IGN of the player 
     * @returns - Players stats
     */
    async getPlayer(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/player').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()

        const body = await res.json()
        this.EventEmitter.emit('playerData', body)
        this.EventEmitter.emit('data', 'player', body)
        if(!body.success) throw new Error(body.cause || body)
        return body;
    }
    
    /**
     * @param {String} name - Player IGN 
     * @returns Boolean whether player is online (true) or offline (false)
     */
    async IfOnline(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/status').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()

        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('playerData', body)
        this.EventEmitter.emit('StatusChange', body['status'])
        this.EventEmitter.emit('data', 'status', body)
        return Boolean(body.session['online'])
    }

    /**
     * @param {String} name - Player IGN
     * @returns Player session (status, game, lobby, etc.)
     */
    async getSession(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/status').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()

        const body = await res.json()
        this.EventEmitter.emit('playerData', body)
        this.EventEmitter.emit('sessionData', body)
        this.EventEmitter.emit('data', 'session', body)
        if(!body.success) throw new Error(body.cause || body)
        return (body);
    }


    /**
     * 
     * SKYBLOCK
     * 
     */

    /**
     * @param {String} [profileId] - Hypixel skyblock profile ID (https://hypixel.net/threads/how-to-get-a-profile-id-from-the-name.3003144/)
     * @returns Skyblock Profile
     */
    async getSkyblockProfile(profileId) {
        const res = await centra(hypixelURL).path('/skyblock/profile').query({
            'key': this.api_key,
            'profile': profileId
        }).send()

        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('skyblockData', body)
        this.EventEmitter.emit('data', 'skyblock', sb['profiles'][profile])
        return body;
    }
    /**
     * @param {String} ign - Players IGN 
     * @param {String} cutename - Cutename to search through
     * @returns profile_id
     */
    async getProfileFromName(ign, cutename) {
        let uuid = await uuidUtil('name', ign)
        const res = await centra(hypixelURL).path('/player').query({
            'key': this.api_key,
            'uuid': uuid,
        }).send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        const sb = body['player']['stats']['SkyBlock']
        for(const profile of Object.keys(sb['profiles'])) {
            
            if(sb['profiles'][profile]['cute_name'] === cutename) {
                this.EventEmitter.emit('skyblockData', sb['profiles'][profile])
                this.EventEmitter.emit('data', 'skyblock',sb['profiles'][profile])
                return sb['profiles'][profile]
            }else return false;
        }
    }


    /** 
     * RESOURCES
    */

    /**
     * @param {String} key - API Key to search 
     * @returns API Key info
     */
     async getKeyInfo(key) {
        const res = await centra(hypixelURL).path('/key').query({
            'key': key

        }).send()
        if(!res.json().success) throw new Error(res.json().cause || res)
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('APIKeyData', body)
        this.EventEmitter.emit('data','key' , body)
        this.EventEmitter.emit('resourceData',body)
        return body;
    }

    /**
     * @returns Watchdog Statistics
     */
     async getWatchdog() {
        const res = await centra(hypixelURL).path('/watchdogstats').query({
            'key': this.api_key
        }).send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('watchdogData', body)
        this.EventEmitter.emit('data', body)
        this.EventEmitter.emit('resourceData', body)
        return body;
    }
    /**
     * @returns All Achievements
     */
    async getAchievements() {
        const res = await centra(hypixelURL).path('/resources/achievements').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('achievementsData', body)
        this.EventEmitter.emit('data','achievements', body)
        this.EventEmitter.emit('resourceData', body)
        return body;
    }

    /**
     * @param {String} game - Game Mode 
     * @returns - Achievements for the specified Game Mode
     */
    async getGameAchievements(game = String) {
        const games = ['arcade', 'arena', 'bedwars', 'blitz', 'buildbattle', 'christmas2017', 'copsandcrims', 'duels', 'easter', 'general', 'gingerbread', 'halloween2017', 'housing', 'murdermystery', 'paintball',
            'pit', 'quake', 'skyblock', 'skyclash', 'skywars', 'speeduhc', 'summer', 'supersmash', 'tntgames', 'truecombat', 'uhc', 'vampirez', 'walls', 'walls3', 'warlords']
        if(!games.includes(game.toLowerCase())) throw new Error(`There is no game called \`${game}\` that has achievement records!`)
        const res = await centra(hypixelURL).path('/resources/achievements').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('achievementsData', body)
        this.EventEmitter.emit('data', 'achievements', body)
        this.EventEmitter.emit('resourceData', body)
        return body['achievements'][game.toLowerCase()];
    }

    /** 
     * @returns All Challenges
     */
    async getChallenges() {
        const res = await centra(hypixelURL).path('/resources/challenges').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('challengesData', body)
        this.EventEmitter.emit('data', 'challenges',body)
        this.EventEmitter.emit('resourceData', body)
        return body;
    }

    /**
     * 
     * @param {String} game - Game Mode 
     * @returns - Challenges for the specified Game Mode
     */
    async getGameChallenges(game) {
        const games = ['arcade', 'arena', 'bedwars', 'hungergames', 'buildbattle', 'truecombat', 'duels', 'mcgo', 'murdermystery', 'paintball', 'quake', 'skyclash', 'skywars', 'supersmash', 
            'speeduhc', 'gingerbread', 'tntgames', 'uhc', 'vampirez', 'walls', 'walls3',]
            if(!games.includes(game.toLowerCase())) throw new Error(`There is no game called \`${game}\` that has challenge records!`)
            const res = await centra(hypixelURL).path('/resources/challenges').send()
            const body = await res.json()
            if(!body.success) throw new Error(body.cause || body)
            this.EventEmitter.emit('chalengesData', body['challenges'][game.toLowerCase()])
            this.EventEmitter.emit('data','challenges', body['challenges'][game.toLowerCase()])
            this.EventEmitter.emit('resourceData', body['challenges'][game.toLowerCase()])
            return body['challenges'][game.toLowerCase()];
    } 


    /**
     * @returns - All Quests
     */
    async getQuests() {
        const res = await centra(hypixelURL).path('/resources/quests').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('questsData', body)
        this.EventEmitter.emit('data','quests', body)
        this.EventEmitter.emit('resourceData', body)
        return body;
    }

    /**
     * @param {String} game - Game Mode 
     * @returns - Quests for the specified Game Mode
     */
    async getGameQuests(game) {
        const games = ['quake','walls','paintball','hungergames','tntgames','vampirez','walls3','arcade','arena','uhc','mcgo','battleground','supersmash',
            'gingerbread','skywars','truecombat','skyclash', 'prototype', 'bedwars', 'murdermystery', 'buildbattle', 'duels']
        if(!games.includes(game.toLowerCase()))	throw new Error(`There is no game called \`${game}\` that has quest records!`)
        const res = await centra(hypixelURL).path('/resources/quests').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('questsData', body['quests'][game.toLowerCase()])
        this.EventEmitter.emit('data','quests', body['quests'][game.toLowerCase()])
        this.EventEmitter.emit('resourceData', body['quests'][game.toLowerCase()])
        return body['quests'][game.toLowerCase()];
    }

    /**
     * 
     * @returns All Hypixel Leaderboards registered
     */
    async getLBs() {
        const res = await centra(hypixelURL).path('/leaderboards').query({
            'key': this.api_key
        }).send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('lbData', body)
        this.EventEmitter.emit('data', 'leaderboards', body)
        this.EventEmitter.emit('resourceData', body)
        return body;
        
    }

    /** 
     * @param {String} mode - Leaderboard Game Mode  
     * @returns Leaderboards for the selected Game Mode
     */
    async getLeaderboard(mode = String) {
        const lbmodes = ['TNTGAMES', 'SKYCLASH', 'DUELS', 'PAINTBALL', 'ARENA', 'SPEED_UHC', 'WALLS3', 'SUPER_SMASH', 'GINGERBREAD', 'BUILD_BATTLE', 'MCGO', 
        'VAMPIREZ', 'TRUE_COMBAT', 'BATTLEGROUND', 'SKYWARS', 'SURVIVAL_GAMES', 'BEDWARS', 'QUAKECRAFT', 'UHC', 'ARCADE', 'MURDER_MYSTERY', 'WALLS']
        if(!lbmodes.includes(mode.toUpperCase())) throw new Error(`There is no game called \`${mode}\` that has leaderboard records!`)
        const res = await centra(hypixelURL).path('/leaderboards').query({
            'key': this.api_key
        }).send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('lbData', body)
        this.EventEmitter.emit('data', 'leaderboards',body)
        this.EventEmitter.emit('resourceData', body)
        return body['leaderboards'][mode.toUpperCase()];
    }

    /**(SUB) GUILD RESOURCES */
    /**
     * @returns All Guild Achievements
     */
    async getGuildAchievements() {
        const res = await centra(hypixelURL).path('/resources/guilds/achievements').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('guildData', body)
        this.EventEmitter.emit('data', 'guildachievements', body)
        this.EventEmitter.emit('resourceData', body)
        return body;

    }

    /**
     * @returns All Guild Permissions
     */
    async getGuildPermissions() {
        const res = await centra(hypixelURL).path('/resources/guilds/permissions').send()
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        this.EventEmitter.emit('guildData', body)
        this.EventEmitter.emit('data', 'guildperms', body)
        this.EventEmitter.emit('resourceData', body)
        return body;
    }


    /**
     * @returns Hynfo Support Mail
     */
    async HynfoSupport() {
        return String('yanuu.why@gmail.com');
    }
}
module.exports = Hynfo;
