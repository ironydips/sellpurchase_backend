/**
 */

const redis = require('redis'),
    Promise = require('bluebird'),
    app = require('../util/app'),
    TAG = 'sellpurchase-cacheClient';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

client = redis.createClient( env.dbConfig.redisDB.port , env.dbConfig.redisDB.server  );
// Client Events
client.on('connect', function(err, res) {
    logger.log( TAG , 'redis connected');
    if(err) throw err;
});

client.on( 'error'  , function ( err , res) {
    logger.log(TAG , 'error occured while connecting to redis');
    logger.log( err );
    throw err;
});

module.exports = {
    set : _set,
    get : _get,
    getMulti : _mget,
    remove : _remove,
    clearDB : _clearDB
};

//================================================= Implementation ===================================================

/**
 *
 * @param key
 * @param value
 * @return {*}
 * @private
 */
function _set( key , value ) {
    return client.setAsync( key , value );
}

/**
 *
 * @param key
 * @return {*|String}
 * @private
 */
function _get( key ) {
    return client.getAsync( key );
}

/**
 * remove token from redis
 * @param key
 * @private
 */
function _remove(key) {
    return client.delAsync(key)
}

function _clearDB() {
    return client.flushall();
}

function _mget( keyList ) {
    // fetch multple keys from redis
    return client.mgetAsync(keyList)
}