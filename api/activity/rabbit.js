var util = require( "util" );
var EventEmitter = require( "events" ).EventEmitter;
var async = require( "async" );
var amqp = require( "amqplib/callback_api" );


exports.Listener = Listner;


function Listner ( rabbitURL, exchange, routingKey ) {
    EventEmitter.call( this );
    this._rabbitURL = rabbitURL;
    this._exchange = exchange;
    this._queue = null;
    this._routingKey = routingKey;
    this._connection = null;
    this._channel = null;
    this.start();
}

util.inherits( Listner, EventEmitter );

Listner.prototype.start = function() {

    var _this = this;

    function connect ( done ) {
        console.log( "Connecting..." );
        amqp.connect( _this._rabbitURL, function ( err, connection ) {
            if ( err ) {
                return done( err );
            }
            _this._connection = connection;
            return done();
        } );
    }

    function createChannel ( done ) {
        console.log( "Creating channel..." );
        _this._connection.createChannel( function ( err, channel ) {
            if ( err ) {
                return done( err );
            }
            _this._channel = channel;
            return done();
        } );
    }

    function createQueue ( done ) {
        console.log( "Creating queue..." );
        _this._channel.assertQueue( "", {}, function ( err, result ) {
            if ( err ) {
                return done( err );
            }
            _this._queue = result.queue;
            return done();
        } );
    }

    function checkExchange ( done ) {
        console.log( "Checking exchange..." );
        _this._channel.checkExchange( _this._exchange, done );
    }

    function bindQueueAndExchange ( done ) {
        console.log( "Binding..." );
        _this._channel.bindQueue( _this._queue, _this._exchange, _this._routingKey, {}, done );
    }

    function onMessage ( msg ) {
        var data = JSON.parse( msg.content.toString() );
        _this.emit( "message", data );
        _this._channel.ack( msg );
    }

    function startConsuming ( done ) {
        console.log( "Consuming..." );
        _this._channel.consume( _this._queue, onMessage );
        return done();
    }

    function allDone ( err ) {
        if ( err ) {
            throw err;
        }
        console.log( "Listener created..." );
    }

    async.series( [
        connect,
        createChannel,
        createQueue,
        checkExchange,
        bindQueueAndExchange,
        startConsuming
    ], allDone );

};
