const path = require("path");
const { format } = require("util");
const pool = require("./db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const auth = require("./auth.js");
const fs = require("fs");
var express = require('express');
const { log } = require("console");
var app = express();
dotenv.config();

const upDir = path.join(__dirname, 'public');
if (!fs.existsSync(upDir)) {
  fs.mkdirSync(upDir);
  console.log(upDir);
}

const uploadDir = path.join(__dirname, 'public', 'HostelManagement');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(uploadDir);
}
/**
 * Update/save applicant communcation info
 */
const save_communication_details = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  var info = req.body;

  await pool.query(
    "UPDATE student_info SET communication_address = $1, communication_city = $2, communication_state = $3, \
                    communication_pincode = $4, permanent_address = $5, permanent_city = $6, permanent_state = $7, \
                    permanent_pincode = $8, mobile_number = $9, alternate_mobile_number = $10 WHERE email_id = $11;",
    [
      info.communication_address,
      info.communication_city,
      info.communication_state,
      info.communication_pincode,
      info.permanent_address,
      info.permanent_city,
      info.permanent_state,
      info.permanent_pincode,
      info.mobile_number,
      info.alternate_mobile_number,
      email,
    ]
  );

  return res.status(200).send("Ok");
};
/*
 * Update/save applicant personal info
 */
const save_personal_info = async (req, res, next) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  var info = req.body;

  await pool.query(
    "UPDATE student_info SET full_name = $1, guardian = $2, fathers_name = $3, \
                  date_of_birth = $4, aadhar_card_number = $5, category = $6, is_pwd = $7,blood_group=$8, \
                  nationality = $9, gender = $10 WHERE email_id = $11;",
    [
      info.full_name,
      info.guardian,
      info.fathers_name,
      info.date_of_birth,
      info.aadhar_card_number,
      info.category,
      info.is_pwd,
      info.blood_group,
      info.nationality,
      info.gender,
      email,
    ]
  );

  let promises = [];
  let vals = Object.values(req.files);

  const uploadDir = path.join(__dirname, 'public', 'HostelManagement', 'PERSONAL_Details');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  for (let f of vals) {
    const filename = Date.now() + "_" + f[0].originalname;
    const filepath = path.join(uploadDir, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filepath, f[0].buffer, async (err) => {
          if (err) {
            f[0].localStorageError = err;
            next(err);
            console.log(err);
            reject(err);
            return;
          }
          url = format(
            `${process.env.STORAGE_BASE_URL}/HostelManagement/PERSONAL_Details/${filename}`

          );
          if (f[0].fieldname === "profile_image") {
            await pool.query(
              "UPDATE student_info SET profile_image_url = $1 WHERE email_id = $2;",
              [url, email]
            );
          }
          resolve();

        });
      })
    );
  }
  Promise.allSettled(promises).then(
    res.status(200).send("Ok") /** Confirm, rerender */
  );
};


/**
 * Get applicant profile info
 */
const get_profile_info = async (req, res) => {
  /**
   * Verify using authToken
   */
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY; 

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  /** Get email */
  var email = jwt.decode(authToken).userEmail;

  const results = await pool.query(
    "SELECT full_name,guardian, fathers_name, profile_image_url, date_of_birth, aadhar_card_number, \
                              category, is_pwd, blood_group,nationality, gender,communication_address, communication_city, \
                              communication_state, communication_pincode, permanent_address, permanent_city, permanent_state, \
                              permanent_pincode, mobile_number, alternate_mobile_number, email_id\
                              FROM student_info WHERE email_id = $1;",
    [email]
  );

  return res.send(results.rows[0]);
};

const get_user_info = async (req, res) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  if (!verified) {
    return res.send("1"); /** Error, logout on user side */
  }

  /** Get role */
  var userRole = jwt.decode(authToken).userRole;
  if (userRole !== 2) {
    return res.send("1");
  }

  var email = jwt.decode(authToken).userEmail;

  const results = await pool.query(
    "SELECT full_name, profile_image_url, email_id FROM student_info WHERE email_id = $1;",
    [email]
  );

  return res.send(results.rows[0]);
};

const get_user_email = async (req, res) => {
  authToken = req.headers.authorization;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  var verified = null;

  try {
    verified = jwt.verify(authToken, jwtSecretKey);
  } catch (error) {
    return res.send("1"); /** Error, logout on user side */
  }

  // if (!verified) {
  //   return res.send("1"); /** Error, logout on user side */
  // }

  // /** Get role */
  // var userRole = jwt.decode(authToken).userRole;
  // if (userRole !== 2) {
  //   return res.send("1");
  // }

  var email = jwt.decode(authToken).userEmail;

  console.log(email);

  // const results = await pool.query(
  //   "SELECT full_name, profile_image_url, email_id FROM student_info WHERE email_id = $1;",
  //   [email]
  // );

  return res.send(email);
};

module.exports = {
  save_personal_info,
  save_communication_details,
  get_profile_info,
  get_user_info,
  get_user_email
};