var mongoose = require( "mongoose" );
var Listener = require( "./rabbit" ).Listener;

var doorStatus;


var statusListener = new Listener(
    process.env.RABBIT_URL,
    "gpio_broadcast",
    "stall_monitor"
);

statusListener.start( function ( data, done ) {
    doorStatus = data;
    done();
} );


exports.current = function ( req, res, next ) {

    // Look up last status in cases where server was restarted
    if ( !doorStatus ) {
        mongoose.connection.db.collection( "activity", function ( err, collection ) {

            collection.find().sort( { date: -1 } ).limit( 1 ).toArray( function ( err, result ) {

                if ( err ) {
                    return next( err );
                }

                return res.status( 200 ).json( result );

            } );

        } );
    }

    return res.status( 200 ).json( doorStatus );

};
