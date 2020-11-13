'use strict';
export {insertData};

function insertData(db, collection, ...data) {
    if(!data.length) return;

    let _collection = db.collection(collection);
    _collection.insertMany(data).then(
        result => {return result}
    ).catch(
        err => console.error(`Failed to insert: ${err}`)
    );
}