var rabbit = require( "./rabbit.js" );


var doorStatus = "open";

var statusListener = new rabbit.Listener(
    process.env.RABBIT_URL,
    "gpio_broadcast",
    "stall_monitor"
);

statusListener.on( "message", function ( data ) {
    doorStatus = data.door_open ? "open" : "closed";
} );

exports.current = function ( req, res, next ) {

    return res.status( 200 ).json( { door: doorStatus } );

};
