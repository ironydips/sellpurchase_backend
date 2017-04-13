const _ = require("lodash");

_.mixin({
  unwind: function (o, field) {
    return _.map(o[field], function (val) {
      var cloned = _.clone(o);
      cloned[field] = val;
      return cloned;
    });
  }
});
