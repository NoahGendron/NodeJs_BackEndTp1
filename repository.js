import fs from 'fs';

export default class Repository {
    constructor(objectsFile) {
        this.objectsList = null;
        this.objectsFile = objectsFile
        this.read();
    }
    objects() {
        if (this.objectsList == null) {
            this.read()
        }
        return this.objectsList;
    }

    read() {
        try{
            let rawdata = fs.readFileSync(this.objectsFile);
            this.objectsList = JSON.parse(rawdata);
            return true;
        }
        catch (error){
            console.log(error)
            this.objectsList = [];
        }
        return false;
    }
    write() {
        try {
            fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
            return true;
        }
        catch (error) {
            console.log(error);
        }
        return false;
    }
    
    nextId() {
        let maxId = 0;
        for (let object of this.objectsList) {
            if (object.id > maxId) {
                maxId = object.id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        object.id = this.nextId();
        this.objectsList.push(object);
        if (this.write()) {
            return object;
        }
        return null;
    }
    update(objectToModify) {
        let index = 0;
        for (let object of this.objects()) {
            if (object.id === objectToModify.id) {
                this.objectsList[index] = objectToModify;
                return this.write();
            }
            index++;
        }
        return false;
    }
    remove(id) {
        let index = 0;
        for (let object of this.objects()) {
            if (object.id === id) {
                this.objectsList.splice(index, 1);
                return this.write();
            }
            index++;
        }
        return false;
    }
    getAll(params = null) {
        return this.objects();
    }
    get(id) {
        for (let object of this.objects()) {
            if (object.id === id){
                console.log("returning object with id: " + id)
                return object;
            }
        }
        console.log("returning null")
        return null;
    }

}
