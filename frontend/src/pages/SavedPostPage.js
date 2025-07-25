// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "../styles/homepage.css";
// import Header from "../components/HomePage/Header";
// import { format } from "date-fns";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import SavePost from "../components/HomePage/SavePost";

// export default function TemplatePage() {
//   const [isEventOpen, setIsEventOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const location = useLocation();

//   const openCreatePopup = (type) => {
//     if (type === 'event') {
//       setIsEventOpen(true);
//     }
//   };

//   const closeCreatePopup = () => {
//     setIsEventOpen(false);
//   };

//   const today_formatted = format(new Date(), "MMMM d, yyyy");

//   // Placeholder for navigation actions
//   const handleNavigation = (path) => {
//     // Implement navigation logic here
//   };

//   return (


//     {/* Add your page content here */ }
//     < SavePost />
//   )
// }
