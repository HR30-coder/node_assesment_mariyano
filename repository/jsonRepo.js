const fs = require("fs");

class Client{
    constructor(filePath) { 
        this.filePath = filePath;
    };

    getData() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData;
            // console.log(jsonData);
          } catch (err) {
            console.error(err);
        }
    }
}

class Repository{
    constructor(client){
        this.client = client;
    };

    getResult() {
        console.log("called the get data repository");
        try {
            return this.client.getData();
        }
        catch (err) {
            console.log("error : ", err);
            throw new Error("error fetching the match data");
        }
    }
}


module.exports = new Repository(new Client("D:/nodetask-1/data/match.json"));