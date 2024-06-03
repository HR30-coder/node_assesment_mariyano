class error{
    constructor(status, message) {
        this.status = status;
        this.message = message;
     };

    getError() {
        return {
            "status": this.status,
            "error":this.message
        }
    }
}

module.exports = error;