// Allows for customizing errors

class AppError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }
}

module.exports = AppError