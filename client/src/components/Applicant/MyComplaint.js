import React, { useState, useEffect } from "react";
import axios from "axios";
import ComplaintCard from "../Admin/ComplaintCard";
import { getToken } from "../SignIn_SignUp/Sessions";
import DashboardNavBar from "./DashboardNavBar";

const MyComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [emailid, setEmailId] = useState('');

    useEffect(() => {
        axios
          .get("/get-user-info", {
            headers: {
              Authorization: getToken(),
            },
          })
          .then((response) => {
            console.log(response.data);
            setEmailId(response.data.email_id);
            if (response.data === 1) {
                // navigate("/logout");
            } else {
                // setUser(response.data);
                const id = response.data.email_id;
                console.log(id);
                axios
                    .get(`/getmycomplaints/${id}`)
                    .then((response) => {
                        console.log(response);
                        setComplaints(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
          })
          .catch((err) => console.log(err));
    }, []);


    const handleFilterClick = (filterStatus) => {
        setFilter(filterStatus);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
        <DashboardNavBar currentFlag={6} />
            <div>
                <div class="flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-900 dark:border-gray-700 dark:divide-gray-700">
                    <button onClick={() => handleFilterClick('all')} class="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                        All
                    </button>

                    <button onClick={() => handleFilterClick('solved')} class="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                        Solved
                    </button>

                    <button onClick={() => handleFilterClick('unsolved')} class="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                        Unsolved
                    </button>
                </div>
                <br></br>
                {/* <div>
                    <label for="username" class="block text-sm text-gray-500 dark:text-gray-300">Search By Name :</label>

                    <input type="text" placeholder="Search by name" onChange={handleSearch} class="block  mt-2 placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                </div> */}
                {/* <div>
                    <input type="text" placeholder="Search by name" onChange={handleSearch} />
                </div> */}
                <div>
                    {complaints
                        .filter((complaint) => {
                            if (filter === "all" || (filter === "solved" && complaint.complaint_status === "done") || (filter === "unsolved" && complaint.complaint_status !== "done")) {
                                return complaint.name.toLowerCase().includes(searchTerm.toLowerCase());
                            } else {
                                return false;
                            }
                        })
                        .map((complaint) => (
                            <ComplaintCard
                                key={complaint.complaint_id}
                                id={complaint.complaint_id}
                                name={complaint.name}
                                description={complaint.complaint_details}
                                date={complaint.complaint_date}
                                hostel={complaint.hostel_name}
                                room={complaint.room_number}
                            />
                        ))}
                </div>
            </div>
        </>
    );
};

export default MyComplaint;
