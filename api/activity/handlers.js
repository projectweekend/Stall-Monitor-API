var mongoose = require( "mongoose" );


exports.current = function ( req, res, next ) {

    mongoose.connection.db.collection( "activity", function ( err, collection ) {

        collection.find().sort( { date: -1 } ).limit( 1 ).toArray( function ( err, result ) {

            if ( err ) {
                return next( err );
            }

            return res.status( 200 ).json( result );

        } );

    } );

};
