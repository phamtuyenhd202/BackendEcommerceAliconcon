'use strict'

const { ReasonPhrases, StatusCodes } = require('../public/httpStatusCode')
const reasonPhrases = require('../public/reasonPhrases')

class SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }){
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}){
        return res.status(this.status).json( this )
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options
    }
}

class AuthFailureError extends SuccessResponse {
    constructor (message = reasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}
module.exports = {
    OK,
    CREATED,
    AuthFailureError,
    SuccessResponse
}

