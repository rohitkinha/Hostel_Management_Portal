const express = require("express");
const cors = require("cors");
const auth = require("./auth");
const path = require("path");
const complaintSection = require("./complaintSection");
const multer = require("multer");
const upload = multer();
const applicantdB = require("./applicant-db");
const admindB = require("./admin-db");
const ListDownloader = require("./ListDownloader");
const FeeScript = require("./feescript");
var bodyParser = require("body-parser");
const roomExchanger = require("./roomExchanger");

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/signin/otp", auth.signin_otp);

app.post("/auth/signin/verify", auth.signin_verify);

app.post("/auth/forgotpassword/otp", auth.forgot_password_otp);

app.post("/auth/forgotpassword/verify", auth.forgot_password_verify);

app.post("/auth/signup/otp", auth.signup_otp);

app.post("/auth/signup/verify", auth.signup_verify);

app.post("/contact-us", auth.contact_us);

app.post("/complaintSection/savedata", complaintSection.save_data);

app.post("/complaints/solve/:id", complaintSection.solveIt);


app.post(
  "/save-personal-info",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
  ]),
  applicantdB.save_personal_info
);

app.post(
  "/save-communication-details",
  upload.fields([]),
  applicantdB.save_communication_details
);
app.post(
  "/save-fees-details",
  upload.fields([
    {
      name: "fees_pdf", maxCount: 1
    }
  ]),
  applicantdB.save_fees_details
);
app.get("/getAllInfo/:id", applicantdB.getAllInfo);

app.get("/get-profile-info", applicantdB.get_profile_info);

app.get("/get-user-info", applicantdB.get_user_info);

app.get("/get-user-email", applicantdB.get_user_email);

app.get("/get-fees-info", applicantdB.get_fees_info);

app.get("/get-fees-history", applicantdB.get_fees_history);

app.post("/add-admin", upload.fields([]), admindB.add_admin);

app.post("/add-fees-record", upload.fields([]), admindB.add_fees_record);

app.post("/edit-admin", upload.fields([]), admindB.edit_admin);

app.post("/delete-admin", upload.fields([]), admindB.delete_admin);

app.post("/delete-student", upload.fields([]), admindB.delete_student);

app.post("/edit-admin-profile", upload.fields([]), admindB.edit_admin_profile);

app.post("/view-excel", upload.fields([]), admindB.view_excel);
app.get(
  "/get-list-in-excel",
  ListDownloader.get_list_in_excel
);
app.post(
  "/get-fee-in-excel", upload.fields([]),
  FeeScript.get_fee_in_excel
);
app.get("/get-admins", admindB.get_admins);

app.get("/get-students", admindB.get_students);

app.get("/get-admin-profile", admindB.get_admin_profile);

app.get("/get-admin-fees-record", admindB.get_fees_record);

app.post("/add-excel", upload.fields([{ name: "excelfile", maxCount: 1 }]), admindB.add_excel);

app.post("/add-students", upload.fields([]), admindB.add_students);

app.post("/add-student", upload.fields([]), admindB.add_student);

app.post("/delete-excel", upload.fields([]), admindB.delete_excel);

app.get("/get-excel", admindB.get_excel);

app.get("/admin/getcomplaints", complaintSection.get_all_complaints);

app.get("/admin/solvedcomplaints", complaintSection.get_all_solved_complaints);

app.get("/complaints/:id", complaintSection.get_complaints);

app.get("/getmycomplaints/:id", complaintSection.get_my_complaints);

app.get("/myRoomRequest/:id", roomExchanger.get_my_requests);

app.get("/getAllRequest", roomExchanger.get_all_requests);

app.post("/checkRoomAvailability", roomExchanger.checkForRoom)

app.post("/updateStatus/:id", roomExchanger.statusUpdater);

app.post("/postRoomRequest", roomExchanger.request_for_exchange);

module.exports = app;