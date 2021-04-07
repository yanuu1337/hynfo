const centra = require('centra')
const { PartialTextBasedChannel } = require('discord.js')
const uuidUtil = require('./util/uuidUtil')
const nameURL = `https://api.mojang.com/`
const hypixelURL = 'https://api.hypixel.net/'

class Hynfo {
    /**
     * 
     * @param {string} api_key - Valid Hypixel API Key (use "/api new" in-game to generate one) 
     */
    constructor(cnf) {
        this.api_key = cnf.api_key
        this.basePath = 'https://api.hypixel.net/'
    }


    /**
     * 
     * @param {string} name - Get full name history from mojang API 
     * @returns Name history and timestamps
     */
    async getNames(name) {
        let UUID = await uuidUtil('name', `${name}`)
        const res = await centra(nameURL).path(`user/profiles/${UUID}/names`).send()
        const jsonified = await res.json()
        if(jsonified.success) {
            return jsonified;
        } else {
            throw new Error(jsonified.cause || res)
        }
    }


    /**
     * 
     * @param {String} ign - Player IGN (in a guild) 
     * @returns Guild info
     */
    async findGuildByPlayer(ign) {
        let UUID = await uuidUtil('name', ign)
        const res = await centra(hypixelURL).path('/guild').query({
            'key': this.api_key,
            'player': UUID,
        }).json()

        if(res.success) {
            return res;
        } else throw new Error(res.cause || res)

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
        return body;
        
    }


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
        return body;
    }

    async getFriends(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/friends').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()
    
        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        return body; 
    }
    async getRecentGames(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/recentgames').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()

        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        return body;
    }
    async getPlayer(name) {
        let UUID = await uuidUtil('name', name)
        const res = await centra(hypixelURL).path('/player').query({
            'key': this.api_key,
            'uuid': UUID
        }).send()

        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        return body;
    }
   
    
    /**
     * 
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
        return Boolean(body.session['online'])
    }

    /**
     * 
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
        if(!body.success) throw new Error(body.cause || body)
        return (body);
    }
    /**
     * 
     * @param {String} [profileId] - Hypixel skyblock profile ID (https://hypixel.net/threads/how-to-get-a-profile-id-from-the-name.3003144/)
     * @returns Skyblock Profile
     * 
     */
    async getSkyblockProfile(profileId) {
        const res = await centra(hypixelURL).path('/skyblock/profile').query({
            'key': this.api_key,
            'profile': profileId
        }).send()

        const body = await res.json()
        if(!body.success) throw new Error(body.cause || body)
        return body;


    }

    /**
     * 
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
            if(sb['profiles'][profile]['cute_name'] === cutename) return sb['profiles'][profile]
            else return false;
        }
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
        return body;
        
    }

    /**
     * 
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
        return body['leaderboards'][mode.toUpperCase()];
    }
    async HynfoSupport() {
        return String('mailto:yanuu.why@gmail.com');
    }
    async getGuild(gname) {
        const res = await centra(hypixelURL).path('/guild').query({
            'key': this.api_key,
            'name': gname,
        }).send()
        const body = await res.json()
        return body;
    }
    
}

