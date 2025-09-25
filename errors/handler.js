export const ERRORS = Object.freeze({
    NOT_FOUND: 'NotFound',
    INCORRECT_BODY: 'IncorrectBody',
    PARTIAL_PAYLOAD: 'PartialPayload',
    NOT_UNIQUE: 'NotUnique'
});



export const errorHandler = (error, request, response, next) => {
    const errorName = error.name;
    const {NOT_FOUND, INCORRECT_BODY, PARTIAL_PAYLOAD, NOT_UNIQUE} = ERRORS;

    const reply = (code, message) => {
        console.log(message);
        return response.status(code).json(
            { error: message }
        );
    };

    switch (errorName) {
        case NOT_FOUND:
            return reply(404, 'The person is not found!');
        case INCORRECT_BODY:
            return reply(400, 'Not correct body format');
        case PARTIAL_PAYLOAD:
            return reply(400, 'Full data is not provided');
        case NOT_UNIQUE:
            return reply(400, 'Name must be unique');
        case 'ValidationError':
            return reply(400, error.message);
    }

    next(error);
};