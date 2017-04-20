"use strict";


const MESSAGES = {
  intrnlSrvrErr: "Please try after some time.",
  userNotFound: "User not found.",
  emailNotFound: "We don't recognize this email.",
  emailAlrdyRegistered: "The email address you have entered is already registered.",
  invalidEmail: "Please fill valid Email Address",
  invalidZipcode: "Please fill valid zip Code",
  gndrCantEmpty: "Gender can't be empty",
  roleCantEmpty: "Role can't be empty",
  dobCantEmpty: "Date of birth can't be empty",
  passCantEmpty: "Password can't be empty",
  invalidNum: "Please fill valid phone number or Do not add country code",
  nameCantEmpty: "Name can't be empty",
  HgstLevelPlayedError: "Please fill highest level you played/Coached",
  incorrectPass: "Incorrect password",
  notRegistered: "Not registered",
  linkExpired: "Link has been expired",
  passChanged: "Password has been changed successfully",
  provideFeedId: "Please provide Feed id",
  unAuthAccess: "Unauthorized access",
  ratingAdded: 'Rating has been added successfully',
  tokenGenError: "Error while generating access token",
  cmntCantEmpty: "Comment can't be empty",
  commentAdded: "Comment has been added successfully",
  provideLocation: "Please provide longitude and latitude",
  feedCreated: "Post has been created successfully",
  providePlyrId: "Please provide player id",
  provideLoadMoreId: "Please provide load more Id",
  provideFollowerId: "Please provide follower Id",
  alreadyFollowed: "Already followed",
  cantFollowYourSelf: "You can't follow yourself",
  follow: "Followed",
  unFollow: "Unfollowed",
  provideAllRating: "Please fill all rating parameters",
  cantRateYourSelf: "You can't Rate yourself",
  userRated: "User rated successfully",
  fltrTypReq: "filter type is required fields",
  inVldFltrVal: "invalid filter value",
  provdBoxCordinates: "Please provide box coordinates",
  changesSaved: "your changes has beed saved successfully",
  invlMapType: "Please provide map type",
  zmLvlRequired: "Zoom level required in map filter type",
  radiusRequired: "Radius is required",
  mapIdRequired: "Map Id required",
  provideOldPass: "Please provide old and new password",
  passCantSame: "Old password and new password can't be same",
  inavlidOldPass: "Your password was incorrect.",
  PassChanged: "Your password was reset successfully",
  settingsChanges: "Notification setting changed",
  logout: "You have signed out",
  sessionExpired: "Session Expired",
  profileUpdated: "Your profile has been saved.",
  provideDevice: "Please provide device token and device type to update device token",
  deviceIdUpdated: "Registration id updated",
  userRankCalculate: "User rank calculated successfully.",
  succesfullyDeleted: "Successfully Deleted",
  operationUnsuccessful: "Operation Unsuccessful. Please try after some time.",
  successfullySignedout: "Sucessfully Signed Out",
  emailSent: "Email has been successfully sent",
  resetPasswordEmail: {
    subject: "How to reset your password on #domain",
    body: "Hello#userName,\n\nTo reset your password, click this link: #resetPasswordLink " +
    "There, you will be prompted to enter your new password."
  },
  accountCreateEmail: {
    subject: "An account has been created for you on #domain",
    // ToDo:change sw logo url
    body: `<head>
            <title>South Western Consulting</title>
           </head>
           <body>
            <table style=\"width:800px;\tmargin:0 auto;\">
             <tr>
              <td style=\"width:1170px; margin: 0 auto; border-bottom: 1px solid #d2caca; clear:both;\">
               <img style=\"padding:15px 0px;\" src=\"http://testcsf.southwesternconsulting.com/images/csf_logo.png\"/>
              </td>
             </tr>
             <tr>
              <td>
               <h1 style=\"text-align:center; width:100%; color:#767171; font-family:Arial, Helvetica, sans-serif;\"> 
                #name
               </h1>
               <p style=\"text-align:left; float:left; width:100%; color:#a29c9c; font-family:Arial, Helvetica, sans-serif;\">
                 #msg<br><br>
               </p>
              </td>
             </tr>
             <tr>
              <td style=\"text-align:center;\">
                <a href= #userCreateUrl style=\"background:#98ca3c; color:#fff; padding:20px; 
                font-size:36px; font-family:Arial, Helvetica, sans-serif; text-decoration:none; 
                border-radius:15px; margin:50px auto;\">#btntxt>
                </a><br><br>
              </td>
             </tr>
             <tr>
              <td>
                <p style=\"text-align:left; float:left; width:100%; color:#a29c9c; 
                font-family:Arial, Helvetica, sans-serif;\">
                Problems with button above?  Copy and paste this link into your browser: <br>
                  <a href= #userCreateUrl>#userCreateUrl
                  </a>
                </p>
              </td>
             </tr>
            </table>
           </body>`
  },
  errorEmail: {
    subject: "InfusionSoft errors",
    // ToDo:change sw logo url
    body: `<head>
            <title>#mailTitle</title>
           </head>
           <body>
            <table style=\"width:800px;\tmargin:0 auto;\">
              <tr>
                <td style=\"width:1170px; margin: 0 auto; border-bottom: 1px solid #d2caca; clear:both;\">
                  <img style=\"padding:15px 0px;\" src=\"http://testcsf.southwesternconsulting.com/images/csf_logo.png\"/>
                </td>
              </tr>
              <tr>
                <td>
                  <h1 style=\"text-align:center; width:100%; color:#767171; font-family:Arial, Helvetica, sans-serif;\"> 
                    #mailContentTitle
                  </h1>
                  <p style=\"text-align:left; float:left; width:100%; color:#a29c9c; font-family:Arial, Helvetica, sans-serif;\">
                    #mailContent<br><br><br>
                  </p>
                </td>
              </tr>
            </table>\n\n\n  
          </body>\n\n\n`
  },
  provideISoftId: "You must provide member infusionId.",
  iSoftUserNotFound: "User with the given Infusion soft id not present.",
  reset_token: "Reset password token is missing.",
  emailPasswordIncorrect: "Email Id or password is incorrect.",
  resettokenExpired: "Reset password token is expired.",
  failedToAuthenticateToken: "Define message here",
  passwordNotSetYet: "Password not set yet",
  passwordNotMatch: "Password not matched.",
  unableToDeleteCompany: "Unable to delete company. Please try again later",
  companyIdBlank: "Company Id can not be blank.",
  companyNameBlank: "Company Name can not be blank.",
  companyNameAlreadyExists: "Company Name already exists.",
  successfullyUpdated: "Successfully updated .",
  companyNotFound: "Company not found",
  nationalNotFound: "National not found",
  userActivated: "The user was successfully activated.",
  userDeactivated: "The user was successfully deactivated.",
  teamCreated: "Team created successfully.",
  teamUpated: "Team updated successfully.",
  teamDeleted: "Team deleted successfully.",
  fieldMissing: "Required field missing.",
  unableToUpdateNational: "Unable to update national in companies .",
  nationalNameAlreadyExists: "National Name already exists.",
  companyCreated: "Company created successfully.",
  userCreated: "User created successfully.",
  companyAssignedSuccesfully: "Company assigned to manager successfully.",
  companyunAssignedSuccesfully: "Company unassigned to manager successfully.",
  nationalNameAlreadyExist: "National name already exists.",
  nothingToUpdate: "Nothing to update.",
  unAssignedSuccessfully: "UnAssigned Successfully.",
  accountUpdated: "Account info successfully updated.",
  userIdMissing: "User Id can not be blank.",
  incorrectEmailPass: "Incorrect email or password.",
  managerNotFound: "Manager not found or the assigned user is not manager.",
  invalidCsf: " Input Csf values are invalid",
  managerAssigned: "Manager assigned successfully.",
  inValidUserID: "Please provide valid userId.",
  inValidFactorId: "Please provide valid factorId.",
  inValidCSFDAte: "Please provide valid csf date",
  invalidFactorName: "Please provide valid csf Name",
  invalidFactorValue: "Please provide factor value",
  companyNameEmpty: "Company name can't be empty.",
  nationalNameEmpty: "National name can't be empty.",
  userDeleted: "User deleted successfully.",
  cantDeletSu: "Deleting super admin account is not allowed.",
  cantDeleteSelf: "Deleting your own account is not allowed.",
  cantDeleteUser: "Deleting this user is not allowed.",
  inValidleaderInput: "Input detail for leader is invalid.",
  inValidDataForLEADER: "Category or CSF should not be list",
  inValidCSFForLEADER: "CSF id should not be provided is Show leaders in all categories is checked",
  inValidDataForFrequencyAndTime: "frequency and time data is incorrect",
  inValidPeriodForLeader: "Invalid period for leader",
  inValidBDLFForLeader: "Invalid level for breaklevel",
  inValidSortOrderForLeader: "Sort order should be asc or desc",
  zipNotValid: "Zip must be a valid zip code.",
  noUpdtaePermissions: "Do not have add/update leader permissions.",
  notAuthorisedToAdd: "You\'re not authorized to add users to the Southwestern company. Contact the administrator.",
  cantAddUserToRestCompany: 'You cannot add users to restricted company.',
  cantSetUpSuchRoles: 'You cannot set up such roles.',
  invalidFactorType: "Factor type must be valid entery.",
  invalidFactorFrequency: "Factor fequency must be valid entery.",
  csfAlreadyAdded: "Csf is already added, please try another one.",
  userIdEmpty: "User can't be empty.",
  arrayNotFound: "Array expected.",
  paramsNotFound: "Required params not found."
};


const STATUS_CODE = {
  ERROR: 0,
  SUCCESS: 1
};

const DB_KEYS = {
  NAME: 'name',
  EMAIL: 'email',
  SEARCH: 'search'
};

const KEYS = {
  PROFILE: 'profile',
  DOT: '.',
  EMPTY: '',
  COMPANIES: 'companies',
  NATIONALS: 'nationals',
  USERS: 'users',
  COMPANIES_NATIONAL: 'companies_national',
  NATIONAL: 'national',

};

const ROLES = {
  //["coach", "client", "manager", "sales", "admin", "su"]
  COACH: 'coach',
  CLIENT: 'client',
  MANAGER: 'manager',
  SALES: 'sales',
  ADMIN: 'admin',
  SU: 'su'

};

const USERS = {
    PRATEEK: 'Prateek Narang',
    BHARAT_UNCLE: 'Bharat Uncle',
    OPENING_STOCK: 'Opening Stock',
    MILAAP: 'Milaap'
};

//========================== Export Module Start ===========================

module.exports = {
  MESSAGES,
  STATUS_CODE,
  DB_KEYS,
  KEYS,
  ROLES,
  USERS
};

//========================== Export Module END ===========================
