var Listener = require( "./rabbit" ).Listener;

var doorStatus;
var error;

function setDoorStatus ( err, data ) {
    if ( err ) {
        error = err;
        doorStatus = null;
    } else {
        error = null;
        doorStatus = data;
    }
}

var statusListener = new Listener(
    process.env.RABBIT_URL,
    "gpio_broadcast",
    "stall_monitor"
);

statusListener.start( setDoorStatus );


exports.current = function ( req, res, next ) {

    if ( error ) {
        return next( error );
    }
    return res.status( 200 ).json( doorStatus );

};
