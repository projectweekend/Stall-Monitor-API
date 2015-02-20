var mongoose = require( "mongoose" );


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var GCMSchema = Schema ( {
    id: ObjectId,
    token: {
        type: String,
        index: true
    }
} );


exports.GCM = mongoose.model( "gcm", GCMSchema );
