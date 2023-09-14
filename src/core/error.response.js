'use strict'

const { ReasonPhrases, StatusCodes } = require('../public/httpStatusCode')
const reasonPhrases = require('../public/reasonPhrases')

class ErrorResponse extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor( message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN ) {
        super(message, statusCode)
    }
}


class BadRequestError extends ErrorResponse{
    constructor( message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN ) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor ( message = reasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED ) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor (message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
}