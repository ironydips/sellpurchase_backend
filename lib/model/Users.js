"use strict";

/**
 * User
 *
 * @module      :: Model
 * @description :: Represent data model for the Users
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require('mongoose');

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

/**
 * User Schema
 */
var userSchema = new Schema(
  {
    _id: {
      type: String,
      trim: true
    },
    profile: {
      firstName: {
        type: String,
        trim: true,
        required: true
      },
      lastName: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      }
    },
    coachesIds: [
      {
        type: String,
        trim: true
      }
    ],
    roles: [
      {
        type: String,
        trim: true,
        /**
         * at a single time a user can be
         * "su"
         * "admin"
         * "client"
         * "coach"
         * "coach", "manager"
         * "client", "manager"
         */
        enum: ["coach", "client", "manager", "admin", "su"]
      }
    ],
    emails: [{
      address: {
        type: String,
        trim: true,
        required: true,
        index: {
          sparse: true,
          unique: true
        },
        lowercase: true
      },
      verified: {
        type: Boolean,
        default: false
      },
      _id: false
    }],
    services: {
      password: {
        reset: {
          when: {
            type: Date,
            default: Date.now
          },
          token: {
            type: String,
            trim: true
          },
          email: {
            type: String,
            trim: true
          }

        },
        bcrypt: {
          type: String,
          trim: true
        }
      },
      resume: {
        loginTokens: [
          {
            when: {
              type: Date,
              default: Date.now
            },
            hashedToken: {
              type: String,
              trim: true
            },
            _id: false
          }
        ]

      }
    },
    factors: [
      {
        _id: {
          type: String
        },
        filled: [{
          value: {
            type: String
          },
          date: {
            type: String
          }
        }],
        goal: {
          type: Number
        }
      }
    ],
    disabled: Boolean,
    company: {
      _id: {
        type: String
      },
      profile: {
        name: {
          type: String,
          required: true
        },
        sales: {
          type: String,
        },
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        zip: {
          type: String,
        },
        country: {
          type: String,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true
        },
        notes: {
          type: String,
        }
      },
      national: {
        profile: {
          name: {
            type: String
          }
        },
        createdAt: {
          type: Date
        }
      },
      salesId: {
        type: String
      },
      chief: {
        type: Boolean,
        default: false
      },
      teams: [
        {
          _id: {
            type: String
          },
          profile: {
            name: {
              type: String
            },
            notes: {
              type: String
            }
          }
        }
      ],
      createdBy: {
        type: String,
      }
    },
    teamId: [
      {
        type: String,
        trim: true
      }
    ],
    managedTeams: [
      {
        type: String,
        trim: true
      }
    ],
    restrictedCompanies: [
      {
        type: String,
        trim: true
      }
    ],
    salesIds: [
      {
        type: String,
        trim: true
      }
    ],
    managersIds: [
      {
        type: String,
        trim: true
      }
    ],
    // company ids whose user manager can see
    visibleCompanies: [
      {
        type: String,
        trim: true
      }
    ],
    timeZone: String,
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    forgotPassToken: {
      type: String,
      select: false
    },
    infusionId: {
      type: String,
      trim: true
    }
  },
  {
    versionKey: false
  }
);

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.isVerified;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  return obj;
};

userSchema.pre("save", function (next) {
  console.log(this);
  this._id = mongoose.Types.ObjectId().toString();
  next();
});


module.exports = mongoose.model('user', userSchema, "users");
