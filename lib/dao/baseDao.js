"use strict";

//========================== Class Definitions Start =====================

class BaseDao {
  constructor(dbModel) {
    //Get Model
    this.Model = dbModel;
  }

  save(object) {
    return this.Model.create(object);
  }

  findOne(query, projection) {
    return this.Model.findOne(query, projection).exec();
  }

  findOneLean(query, projection) {
    return this.Model.findOne(query, projection).lean().exec();
  }

  find(query, projection, options) {
    return this.Model.find(query, projection, options).exec();
  }

  findLean(query, projection, options) {
    return this.Model.find(query, projection, options).lean().exec();
  }

  findOneAndUpdate(query, update, options) {
    return this.Model.findOneAndUpdate(query, update, options).exec();
  }

  count(query) {
    return this.Model.count(query).exec();
  }

  remove(query) {
    return this.Model.find(query).remove().exec();
  }

  update(query, update, options) {
    console.log(`update query ${JSON.stringify(query)}`);
    console.log(`update doc ${JSON.stringify(update)}`);
    console.log(`update options ${JSON.stringify(options)}`);
    return this.Model.update(query, update, options).exec();
  }

  aggregate(query) {
    return this.Model.aggregate(query).exec();
  }

  insertMany(arr){
    return this.Model.insertMany(arr);
  }
}
//========================== Class Definitions End =====================


//========================== Helper methods start =======================

//========================== Helper methods end =======================

//========================== Export module start =======================

module.exports = BaseDao;

//========================== Export module End =======================


