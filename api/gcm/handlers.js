var async = require( "async" );
var models = require( "./models" );


exports.registerToken = function ( req, res, next ) {

    req.checkBody( "token" ).notEmpty();

    var validationErrors = req.validationErrors();
    if ( validationErrors ) {
        return res.status( 400 ).json( validationErrors );
    }

    function checkExisting ( done ) {

        models.GCM.findOne( { token: req.body.token }, function ( err, result ) {

            if ( err ) {
                return done( err );
            }

            return done( null, result );

        } );

    }

    function addNew ( existing, done ) {

        if ( existing ) {
            return done( null, existing );
        }

        models.GCM.create( { token: req.body.token }, function ( err, gcm ) {

            if ( err ) {
                return done( err );
            }

            return done( null, gcm );

        } );

    }

    var tasks = [ checkExisting, addNew ];

    async.waterfall( tasks, function ( err, gcm ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( gcm );

    } );

};


exports.removeToken = function ( req, res, next ) {

    req.checkParams( "tokenId" ).notEmpty();

    var validationErrors = req.validationErrors();
    if ( validationErrors ) {
        return res.status( 400 ).json( validationErrors );
    }

    models.GCM.findOneAndRemove( { _id: req.params.tokenId }, function ( err, gcm ) {

        if ( err ) {
            return next( err );
        }

        if ( !gcm ) {
            return res.status( 404 ).json();
        }

        return res.status( 204 ).json();

    } );

};
