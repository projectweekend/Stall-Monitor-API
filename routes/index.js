var express = require( "express" );
var router = express.Router();
var gcm = require( "../api/gcm/handlers" );
var activity = require( "../api/activity/handlers" );

/* GET home page. */
router.get( "/ping", function ( req, res ) {

    res.status( 200 ).json( {
        ping: "pong"
    } );

} );

router.post( "/gcm", gcm.registerToken );
router.delete( "/gcm/:tokenId", gcm.removeToken );

router.get( "/current", activity.current );


module.exports = router;
