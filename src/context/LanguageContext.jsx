/*
 * FixMate - Language Context
 * FILE: src/context/LanguageContext.jsx
 *
 * Usage:
 *   import { useLang, LangToggle } from "../context/LanguageContext";
 *   const { t, lang, dir } = useLang();
 */

import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext(null);

/* --- TRANSLATIONS --- */
export const T = {
  /* Landing Page */
  landing_title: { en: "Home Repairs Made Simple", he: "\u05ea\u05d9\u05e7\u05d5\u05e0\u05d9\u05dd \u05dc\u05d1\u05d9\u05ea \u05d1\u05e4\u05e9\u05d8\u05d5\u05ea" },
  landing_sub: { en: "Find trusted professionals for any home repair \u2014 fast, easy, and reliable.", he: "\u05de\u05e6\u05d0\u05d5 \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2 \u05d0\u05de\u05d9\u05e0\u05d9\u05dd \u05dc\u05db\u05dc \u05ea\u05d9\u05e7\u05d5\u05df \u05d1\u05d1\u05d9\u05ea \u2014 \u05de\u05d4\u05d9\u05e8, \u05e7\u05dc \u05d5\u05d0\u05de\u05d9\u05df." },
  landing_signin: { en: "Sign In", he: "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" },
  landing_signup: { en: "Sign Up", he: "\u05d4\u05e8\u05e9\u05de\u05d4" },
  landing_or: { en: "or", he: "\u05d0\u05d5" },
  landing_feature1_title: { en: "Verified Pros", he: "\u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2 \u05de\u05d0\u05d5\u05de\u05ea\u05d9\u05dd" },
  landing_feature1_desc: { en: "All professionals are background-checked and certified", he: "\u05db\u05dc \u05d1\u05e2\u05dc\u05d9 \u05d4\u05de\u05e7\u05e6\u05d5\u05e2 \u05e2\u05d5\u05d1\u05e8\u05d9\u05dd \u05d1\u05d3\u05d9\u05e7\u05ea \u05e8\u05e7\u05e2 \u05d5\u05de\u05d5\u05e1\u05de\u05db\u05d9\u05dd" },
  landing_feature2_title: { en: "Instant Booking", he: "\u05d4\u05d6\u05de\u05e0\u05d4 \u05de\u05d9\u05d9\u05d3\u05d9\u05ea" },
  landing_feature2_desc: { en: "Book a service in minutes, not hours", he: "\u05d4\u05d6\u05de\u05d9\u05e0\u05d5 \u05e9\u05d9\u05e8\u05d5\u05ea \u05d1\u05d3\u05e7\u05d5\u05ea, \u05dc\u05d0 \u05d1\u05e9\u05e2\u05d5\u05ea" },
  landing_feature3_title: { en: "AI Diagnosis", he: "\u05d0\u05d1\u05d7\u05d5\u05df AI" },
  landing_feature3_desc: { en: "Snap a photo and get instant diagnosis", he: "\u05e6\u05dc\u05de\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4 \u05d5\u05e7\u05d1\u05dc\u05d5 \u05d0\u05d1\u05d7\u05d5\u05df \u05de\u05d9\u05d9\u05d3\u05d9" },

  /* Sign In */
  signin_title: { en: "Welcome Back", he: "\u05d1\u05e8\u05d5\u05db\u05d9\u05dd \u05d4\u05e9\u05d1\u05d9\u05dd" },
  signin_sub: { en: "Sign in to your account", he: "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5 \u05dc\u05d7\u05e9\u05d1\u05d5\u05df \u05e9\u05dc\u05db\u05dd" },
  signin_email: { en: "Email Address", he: "\u05db\u05ea\u05d5\u05d1\u05ea \u05d0\u05d9\u05de\u05d9\u05d9\u05dc" },
  signin_password: { en: "Password", he: "\u05e1\u05d9\u05e1\u05de\u05d4" },
  signin_forgot: { en: "Forgot Password?", he: "\u05e9\u05db\u05d7\u05ea\u05dd \u05e1\u05d9\u05e1\u05de\u05d4?" },
  signin_btn: { en: "Sign In", he: "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" },
  signin_no_account: { en: "Don't have an account?", he: "\u05d0\u05d9\u05df \u05dc\u05db\u05dd \u05d7\u05e9\u05d1\u05d5\u05df?" },
  signin_signup: { en: "Sign Up", he: "\u05d4\u05e8\u05e9\u05de\u05d4" },

  /* Sign Up */
  signup_title: { en: "Create Account", he: "\u05d9\u05e6\u05d9\u05e8\u05ea \u05d7\u05e9\u05d1\u05d5\u05df" },
  signup_sub: { en: "Join FixMate today", he: "\u05d4\u05e6\u05d8\u05e8\u05e4\u05d5 \u05dc\u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8 \u05d4\u05d9\u05d5\u05dd" },
  signup_fullname: { en: "Full Name", he: "\u05e9\u05dd \u05de\u05dc\u05d0" },
  signup_email: { en: "Email Address", he: "\u05db\u05ea\u05d5\u05d1\u05ea \u05d0\u05d9\u05de\u05d9\u05d9\u05dc" },
  signup_phone: { en: "Phone Number", he: "\u05de\u05e1\u05e4\u05e8 \u05d8\u05dc\u05e4\u05d5\u05df" },
  signup_password: { en: "Password", he: "\u05e1\u05d9\u05e1\u05de\u05d4" },
  signup_confirm: { en: "Confirm Password", he: "\u05d0\u05d9\u05de\u05d5\u05ea \u05e1\u05d9\u05e1\u05de\u05d4" },
  signup_btn: { en: "Create Account", he: "\u05d9\u05e6\u05d9\u05e8\u05ea \u05d7\u05e9\u05d1\u05d5\u05df" },
  signup_have_account: { en: "Already have an account?", he: "\u05db\u05d1\u05e8 \u05d9\u05e9 \u05dc\u05db\u05dd \u05d7\u05e9\u05d1\u05d5\u05df?" },
  signup_signin: { en: "Sign In", he: "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" },
  signup_next: { en: "Next", he: "\u05d4\u05d1\u05d0" },
  signup_back: { en: "Back", he: "\u05d7\u05d6\u05e8\u05d4" },
  signup_step: { en: "Step", he: "\u05e9\u05dc\u05d1" },
  signup_of: { en: "of", he: "\u05de\u05ea\u05d5\u05da" },
  signup_role: { en: "I am a", he: "\u05d0\u05e0\u05d9" },
  signup_client: { en: "Client", he: "\u05dc\u05e7\u05d5\u05d7" },
  signup_professional: { en: "Professional", he: "\u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2" },

  /* Client Dashboard */
  cd_hello: { en: "Hello,", he: "\u05e9\u05dc\u05d5\u05dd," },
  cd_sub: { en: "Need something fixed at home \u2014 we're here to help.", he: "\u05e6\u05e8\u05d9\u05db\u05d9\u05dd \u05dc\u05ea\u05e7\u05df \u05de\u05e9\u05d4\u05d5 \u05d1\u05d1\u05d9\u05ea \u2014 \u05d0\u05e0\u05d7\u05e0\u05d5 \u05db\u05d0\u05df \u05dc\u05e2\u05d6\u05d5\u05e8." },
  cd_snap_title: { en: "Snap an Issue", he: "\u05e6\u05dc\u05dd \u05ea\u05e7\u05dc\u05d4" },
  cd_snap_desc: { en: "Take a photo and let our AI chatbot diagnose the problem", he: "\u05e6\u05dc\u05de\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4 \u05d5\u05ea\u05e0\u05d5 \u05dc-AI \u05e9\u05dc\u05e0\u05d5 \u05dc\u05d0\u05d1\u05d7\u05df \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4" },
  cd_book_title: { en: "Book a Pro", he: "\u05d4\u05d6\u05de\u05df \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  cd_book_desc: { en: "Search and book a verified professional near you instantly", he: "\u05d7\u05e4\u05e9\u05d5 \u05d5\u05d4\u05d6\u05de\u05d9\u05e0\u05d5 \u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2 \u05de\u05d0\u05d5\u05de\u05ea \u05d1\u05e7\u05e8\u05d1\u05ea\u05db\u05dd" },
  cd_mindmap_title: { en: "Mind Map", he: "\u05de\u05e4\u05ea \u05d7\u05e9\u05d9\u05d1\u05d4" },
  cd_mindmap_desc: { en: "View your issue history and connections in a visual map", he: "\u05de\u05d3\u05e8\u05d9\u05db\u05d9 \u05e4\u05ea\u05e8\u05d5\u05df \u05ea\u05e7\u05dc\u05d5\u05ea \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9\u05d9\u05dd" },
  cd_active_orders: { en: "Active Orders", he: "\u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea" },
  cd_no_orders: { en: "No active orders yet.", he: "\u05d0\u05d9\u05df \u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea \u05e2\u05d3\u05d9\u05d9\u05df." },
  cd_book_to_start: { en: "Book a professional to get started!", he: "\u05d4\u05d6\u05de\u05d9\u05e0\u05d5 \u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2 \u05db\u05d3\u05d9 \u05dc\u05d4\u05ea\u05d7\u05d9\u05dc!" },
  cd_pending: { en: "Pending", he: "\u05de\u05de\u05ea\u05d9\u05df" },
  cd_confirmed: { en: "Confirmed", he: "\u05d0\u05d5\u05e9\u05e8" },
  cd_in_progress: { en: "In Progress", he: "\u05d1\u05d1\u05d9\u05e6\u05d5\u05e2" },
  cd_completed: { en: "Completed", he: "\u05d4\u05d5\u05e9\u05dc\u05dd" },
  cd_cancel: { en: "Cancel", he: "\u05d1\u05d9\u05d8\u05d5\u05dc" },
  cd_edit: { en: "Edit", he: "\u05e2\u05e8\u05d9\u05db\u05d4" },
  cd_contact_pro: { en: "Contact Pro", he: "\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8" },
  cd_track: { en: "Track Progress", he: "\u05de\u05e2\u05e7\u05d1 \u05d4\u05ea\u05e7\u05d3\u05de\u05d5\u05ea" },
  cd_rate: { en: "Rate Professional", he: "\u05d3\u05e8\u05d2 \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  cd_notifications: { en: "Notifications", he: "\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea" },
  cd_mark_all: { en: "Mark all read", he: "\u05e1\u05de\u05df \u05d4\u05db\u05dc \u05db\u05e0\u05e7\u05e8\u05d0" },
  cd_no_notif: { en: "No notifications", he: "\u05d0\u05d9\u05df \u05d4\u05ea\u05e8\u05d0\u05d5\u05ea" },
  cd_edit_profile: { en: "Edit Profile", he: "\u05e2\u05e8\u05d5\u05da \u05e4\u05e8\u05d5\u05e4\u05d9\u05dc" },
  cd_order_history: { en: "Order History", he: "\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d9\u05ea \u05d4\u05d6\u05de\u05e0\u05d5\u05ea" },
  cd_saved_pros: { en: "Saved Professionals", he: "\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05e9\u05de\u05d5\u05e8\u05d9\u05dd" },
  cd_settings: { en: "Settings", he: "\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea" },
  cd_logout: { en: "Log Out", he: "\u05d4\u05ea\u05e0\u05ea\u05e7" },
  cd_edit_order: { en: "Edit Order", he: "\u05e2\u05e8\u05d5\u05da \u05d4\u05d6\u05de\u05e0\u05d4" },
  cd_order_id: { en: "Order ID", he: "\u05de\u05e1\u05e4\u05e8 \u05d4\u05d6\u05de\u05e0\u05d4" },
  cd_professional: { en: "Professional", he: "\u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2" },
  cd_date: { en: "Date", he: "\u05ea\u05d0\u05e8\u05d9\u05da" },
  cd_time: { en: "Time", he: "\u05e9\u05e2\u05d4" },
  cd_description: { en: "Description", he: "\u05ea\u05d9\u05d0\u05d5\u05e8" },
  cd_save_changes: { en: "Save Changes", he: "\u05e9\u05de\u05d5\u05e8 \u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd" },
  cd_track_progress: { en: "Track Progress", he: "\u05de\u05e2\u05e7\u05d1 \u05d4\u05ea\u05e7\u05d3\u05de\u05d5\u05ea" },
  cd_close: { en: "Close", he: "\u05e1\u05d2\u05d5\u05e8" },
  cd_cancel_order: { en: "Cancel Order", he: "\u05d1\u05d9\u05d8\u05d5\u05dc \u05d4\u05d6\u05de\u05e0\u05d4" },
  cd_cancel_confirm: { en: "Are you sure you want to cancel the order with", he: "\u05d4\u05d0\u05dd \u05d0\u05ea\u05dd \u05d1\u05d8\u05d5\u05d7\u05d9\u05dd \u05e9\u05d1\u05e8\u05e6\u05d5\u05e0\u05db\u05dd \u05dc\u05d1\u05d8\u05dc \u05d0\u05ea \u05d4\u05d4\u05d6\u05de\u05e0\u05d4 \u05e2\u05dd" },
  cd_cancel_fee_title: { en: "Cancellation Fee:", he: "\u05e2\u05de\u05dc\u05ea \u05d1\u05d9\u05d8\u05d5\u05dc:" },
  cd_cancel_fee_desc: { en: "Less than 48 hours before the appointment. A cancellation fee will be charged.", he: "\u05e4\u05d7\u05d5\u05ea \u05de-48 \u05e9\u05e2\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d4\u05ea\u05d5\u05e8. \u05ea\u05d7\u05d5\u05d9\u05d1\u05d5 \u05d1\u05e2\u05de\u05dc\u05ea \u05d1\u05d9\u05d8\u05d5\u05dc." },
  cd_free_cancel_title: { en: "Free Cancellation", he: "\u05d1\u05d9\u05d8\u05d5\u05dc \u05d7\u05d9\u05e0\u05dd" },
  cd_free_cancel_desc: { en: "More than 48 hours before the appointment. No fee will be charged.", he: "\u05d9\u05d5\u05ea\u05e8 \u05de-48 \u05e9\u05e2\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d4\u05ea\u05d5\u05e8. \u05dc\u05d0 \u05d9\u05d7\u05d5\u05d9\u05d1 \u05ea\u05e9\u05dc\u05d5\u05dd." },
  cd_go_back: { en: "Go Back", he: "\u05d7\u05d6\u05e8\u05d4" },
  cd_order_placed: { en: "Order Placed", he: "\u05d4\u05d6\u05de\u05e0\u05d4 \u05d1\u05d5\u05e6\u05e2\u05d4" },
  cd_pro_assigned: { en: "Professional Assigned", he: "\u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2 \u05e9\u05d5\u05d1\u05e5" },
  cd_pro_on_way: { en: "Pro On The Way", he: "\u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2 \u05d1\u05d3\u05e8\u05da" },
  cd_work_started: { en: "Work Started", he: "\u05d4\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d4\u05d7\u05dc\u05d4" },
  cd_job_completed: { en: "Job Completed", he: "\u05d4\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d4\u05d5\u05e9\u05dc\u05de\u05d4" },

  /* Book a Pro */
  bp_title: { en: "Book a Pro", he: "\u05d4\u05d6\u05de\u05e0\u05ea \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  bp_step1: { en: "Service Type", he: "\u05e1\u05d5\u05d2 \u05e9\u05d9\u05e8\u05d5\u05ea" },
  bp_step2: { en: "Issue Type", he: "\u05e1\u05d5\u05d2 \u05ea\u05e7\u05dc\u05d4" },
  bp_step3: { en: "Choose Pro", he: "\u05d1\u05d7\u05e8 \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  bp_how_help: { en: "How can we help \ud83d\udee0\ufe0f", he: "\u05d0\u05d9\u05da \u05e0\u05d5\u05db\u05dc \u05dc\u05e2\u05d6\u05d5\u05e8 \ud83d\udee0\ufe0f" },
  bp_choose_type: { en: "Choose the type of professional you need", he: "\u05d1\u05d7\u05e8\u05d5 \u05d0\u05ea \u05e1\u05d5\u05d2 \u05d1\u05e2\u05dc \u05d4\u05de\u05e7\u05e6\u05d5\u05e2 \u05e9\u05d0\u05ea\u05dd \u05e6\u05e8\u05d9\u05db\u05d9\u05dd" },
  bp_whats_issue: { en: "What's the issue \ud83d\udd0d", he: "\u05de\u05d4 \u05d4\u05ea\u05e7\u05dc\u05d4 \ud83d\udd0d" },
  bp_you_selected: { en: "You selected", he: "\u05d1\u05d7\u05e8\u05ea\u05dd" },
  bp_pick_issue: { en: "now pick the issue type", he: "\u05e2\u05db\u05e9\u05d9\u05d5 \u05d1\u05d7\u05e8\u05d5 \u05e1\u05d5\u05d2 \u05ea\u05e7\u05dc\u05d4" },
  bp_find_pro: { en: "\ud83d\udd0e Find a Professional", he: "\ud83d\udd0e \u05de\u05e6\u05d0\u05d5 \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  bp_when_where: { en: "When & Where \ud83d\udccd", he: "\u05de\u05ea\u05d9 \u05d5\u05d0\u05d9\u05e4\u05d4 \ud83d\udccd" },
  bp_when_where_sub: { en: "Tell us your location, preferred date and time", he: "\u05e1\u05e4\u05e8\u05d5 \u05dc\u05e0\u05d5 \u05d0\u05ea \u05d4\u05de\u05d9\u05e7\u05d5\u05dd, \u05ea\u05d0\u05e8\u05d9\u05da \u05d5\u05e9\u05e2\u05d4 \u05de\u05d5\u05e2\u05d3\u05e4\u05d9\u05dd" },
  bp_location: { en: "Location", he: "\u05de\u05d9\u05e7\u05d5\u05dd" },
  bp_search_city: { en: "Search city... (e.g. Haifa, Tel Aviv)", he: "\u05d7\u05e4\u05e9\u05d5 \u05e2\u05d9\u05e8... (\u05dc\u05de\u05e9\u05dc \u05d7\u05d9\u05e4\u05d4, \u05ea\u05dc \u05d0\u05d1\u05d9\u05d1)" },
  bp_no_cities: { en: "No cities found", he: "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05e2\u05e8\u05d9\u05dd" },
  bp_date: { en: "Date", he: "\u05ea\u05d0\u05e8\u05d9\u05da" },
  bp_time: { en: "Time", he: "\u05e9\u05e2\u05d4" },
  bp_select_time: { en: "Select time", he: "\u05d1\u05d7\u05e8\u05d5 \u05e9\u05e2\u05d4" },
  bp_morning: { en: "Morning", he: "\u05d1\u05d5\u05e7\u05e8" },
  bp_afternoon: { en: "Afternoon", he: "\u05e6\u05d4\u05e8\u05d9\u05d9\u05dd" },
  bp_evening: { en: "Evening", he: "\u05e2\u05e8\u05d1" },
  bp_search_btn: { en: "\ud83d\udd0e Search Available Professionals", he: "\ud83d\udd0e \u05d7\u05e4\u05e9\u05d5 \u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05d6\u05de\u05d9\u05e0\u05d9\u05dd" },
  bp_available_in: { en: "Available in", he: "\u05d6\u05de\u05d9\u05e0\u05d9\u05dd \u05d1" },
  bp_found: { en: "Found", he: "\u05e0\u05de\u05e6\u05d0\u05d5" },
  bp_professionals: { en: "professionals", he: "\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd" },
  bp_professional: { en: "professional", he: "\u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  bp_for: { en: "for", he: "\u05dc" },
  bp_at: { en: "at", he: "\u05d1\u05e9\u05e2\u05d4" },
  bp_reviews: { en: "reviews", he: "\u05d1\u05d9\u05e7\u05d5\u05e8\u05d5\u05ea" },
  bp_yrs_exp: { en: "yrs exp.", he: "\u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df" },
  bp_book_now: { en: "Book Now", he: "\u05d4\u05d6\u05de\u05df \u05e2\u05db\u05e9\u05d9\u05d5" },
  bp_confirm_title: { en: "Confirm Booking", he: "\u05d0\u05d9\u05e9\u05d5\u05e8 \u05d4\u05d6\u05de\u05e0\u05d4" },
  bp_notes: { en: "Additional notes (optional)", he: "\u05d4\u05e2\u05e8\u05d5\u05ea \u05e0\u05d5\u05e1\u05e4\u05d5\u05ea (\u05d0\u05d5\u05e4\u05e6\u05d9\u05d5\u05e0\u05dc\u05d9)" },
  bp_notes_placeholder: { en: "Any extra details...", he: "\u05e4\u05e8\u05d8\u05d9\u05dd \u05e0\u05d5\u05e1\u05e4\u05d9\u05dd..." },
  bp_cancel_policy: { en: "Cancellation Policy", he: "\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05d1\u05d9\u05d8\u05d5\u05dc" },
  bp_cancel_free: { en: "more than 48 hours", he: "\u05d9\u05d5\u05ea\u05e8 \u05de-48 \u05e9\u05e2\u05d5\u05ea" },
  bp_cancel_free_label: { en: "Free", he: "\u05d7\u05d9\u05e0\u05dd" },
  bp_cancel_paid: { en: "less than 48 hours", he: "\u05e4\u05d7\u05d5\u05ea \u05de-48 \u05e9\u05e2\u05d5\u05ea" },
  bp_cancel_paid_label: { en: "\u20aa50 fee", he: "\u05e2\u05de\u05dc\u05d4 \u20aa50" },
  bp_cancel_before: { en: "before the appointment", he: "\u05dc\u05e4\u05e0\u05d9 \u05d4\u05ea\u05d5\u05e8" },
  bp_confirm_btn: { en: "Confirm Booking", he: "\u05d0\u05e9\u05e8 \u05d4\u05d6\u05de\u05e0\u05d4" },
  bp_success: { en: "Booking Confirmed! \ud83c\udf89", he: "\u05d4\u05d4\u05d6\u05de\u05e0\u05d4 \u05d0\u05d5\u05e9\u05e8\u05d4! \ud83c\udf89" },
  bp_success_sub: { en: "The professional will contact you shortly.", he: "\u05d1\u05e2\u05dc \u05d4\u05de\u05e7\u05e6\u05d5\u05e2 \u05d9\u05d9\u05e6\u05d5\u05e8 \u05d0\u05d9\u05ea\u05db\u05dd \u05e7\u05e9\u05e8 \u05d1\u05e7\u05e8\u05d5\u05d1." },
  bp_redirect: { en: "Redirecting to dashboard...", he: "\u05de\u05e2\u05d1\u05d9\u05e8 \u05dc\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3..." },
  bp_cat_electricity: { en: "Electrician", he: "\u05d7\u05e9\u05de\u05dc\u05d0\u05d9" },
  bp_cat_plumbing: { en: "Plumber", he: "\u05e9\u05e8\u05d1\u05e8\u05d1" },
  bp_cat_painting: { en: "Painter", he: "\u05e6\u05d1\u05e2\u05d9" },
  bp_cat_ac: { en: "AC Technician", he: "\u05d8\u05db\u05e0\u05d0\u05d9 \u05de\u05d6\u05d2\u05e0\u05d9\u05dd" },
  bp_cat_locksmith: { en: "Locksmith", he: "\u05de\u05e0\u05e2\u05d5\u05dc\u05df" },
  bp_cat_renovation: { en: "Renovation", he: "\u05e9\u05d9\u05e4\u05d5\u05e6\u05d9\u05dd" },
  bp_cat_carpentry: { en: "Carpenter", he: "\u05e0\u05d2\u05e8" },
  bp_cat_cleaning: { en: "Cleaning", he: "\u05e0\u05d9\u05e7\u05d9\u05d5\u05df" },
  bp_iss_short_circuit: { en: "Short Circuit", he: "\u05e7\u05e6\u05e8 \u05d7\u05e9\u05de\u05dc\u05d9" },
  bp_iss_panel_replace: { en: "Panel Replacement", he: "\u05d4\u05d7\u05dc\u05e4\u05ea \u05dc\u05d5\u05d7 \u05d7\u05e9\u05de\u05dc" },
  bp_iss_sockets: { en: "Socket Malfunction", he: "\u05ea\u05e7\u05dc\u05ea \u05e9\u05e7\u05e2\u05d9\u05dd" },
  bp_iss_lighting: { en: "Lighting Issue", he: "\u05d1\u05e2\u05d9\u05d9\u05ea \u05ea\u05d0\u05d5\u05e8\u05d4" },
  bp_iss_install_points: { en: "Install Power Points", he: "\u05d4\u05ea\u05e7\u05e0\u05ea \u05e0\u05e7\u05d5\u05d3\u05d5\u05ea \u05d7\u05e9\u05de\u05dc" },
  bp_iss_general_elec: { en: "General Issue", he: "\u05ea\u05e7\u05dc\u05d4 \u05db\u05dc\u05dc\u05d9\u05ea" },
  bp_iss_clog: { en: "Clogged Drain", he: "\u05e1\u05ea\u05d9\u05de\u05d4" },
  bp_iss_leak: { en: "Leak / Drip", he: "\u05e0\u05d6\u05d9\u05dc\u05d4 / \u05d8\u05e4\u05d8\u05d5\u05e3" },
  bp_iss_faucet: { en: "Faucet Install / Replace", he: "\u05d4\u05ea\u05e7\u05e0\u05ea / \u05d4\u05d7\u05dc\u05e4\u05ea \u05d1\u05e8\u05d6" },
  bp_iss_boiler: { en: "Boiler Issue", he: "\u05ea\u05e7\u05dc\u05ea \u05d3\u05d5\u05d3 \u05e9\u05de\u05e9" },
  bp_iss_pipes: { en: "Pipe Work", he: "\u05e2\u05d1\u05d5\u05d3\u05d5\u05ea \u05e6\u05e0\u05e8\u05ea" },
  bp_iss_general_plumb: { en: "General Issue", he: "\u05ea\u05e7\u05dc\u05d4 \u05db\u05dc\u05dc\u05d9\u05ea" },
  bp_iss_full_apt: { en: "Full Apartment", he: "\u05d3\u05d9\u05e8\u05d4 \u05de\u05dc\u05d0\u05d4" },
  bp_iss_single_room: { en: "Single Room", he: "\u05d7\u05d3\u05e8 \u05d1\u05d5\u05d3\u05d3" },
  bp_iss_plaster: { en: "Plaster Repair", he: "\u05ea\u05d9\u05e7\u05d5\u05df \u05d8\u05d9\u05d7" },
  bp_iss_exterior: { en: "Exterior Painting", he: "\u05e6\u05d1\u05d9\u05e2\u05ea \u05d7\u05d5\u05e5" },
  bp_iss_ac_fault: { en: "AC Malfunction", he: "\u05ea\u05e7\u05dc\u05ea \u05de\u05d6\u05d2\u05df" },
  bp_iss_ac_clean: { en: "AC Cleaning", he: "\u05e0\u05d9\u05e7\u05d5\u05d9 \u05de\u05d6\u05d2\u05df" },
  bp_iss_ac_install: { en: "AC Installation", he: "\u05d4\u05ea\u05e7\u05e0\u05ea \u05de\u05d6\u05d2\u05df" },
  bp_iss_ac_gas: { en: "Gas Refill", he: "\u05de\u05d9\u05dc\u05d5\u05d9 \u05d2\u05d6" },
  bp_iss_door_open: { en: "Locked Out", he: "\u05e0\u05e0\u05e2\u05dc\u05ea\u05d9 \u05d1\u05d7\u05d5\u05e5" },
  bp_iss_lock_replace: { en: "Lock Replacement", he: "\u05d4\u05d7\u05dc\u05e4\u05ea \u05de\u05e0\u05e2\u05d5\u05dc" },
  bp_iss_lock_install: { en: "Lock Installation", he: "\u05d4\u05ea\u05e7\u05e0\u05ea \u05de\u05e0\u05e2\u05d5\u05dc" },
  bp_iss_keys: { en: "Key Duplication", he: "\u05e9\u05db\u05e4\u05d5\u05dc \u05de\u05e4\u05ea\u05d7\u05d5\u05ea" },
  bp_iss_gypsum: { en: "Drywall / Gypsum", he: "\u05d2\u05d1\u05e1" },
  bp_iss_tiling: { en: "Tiling", he: "\u05e8\u05d9\u05e6\u05d5\u05e3" },
  bp_iss_cladding: { en: "Wall Cladding", he: "\u05d7\u05d9\u05e4\u05d5\u05d9 \u05e7\u05d9\u05e8\u05d5\u05ea" },
  bp_iss_demolition: { en: "Demolition", he: "\u05d4\u05e8\u05d9\u05e1\u05d4" },
  bp_iss_furniture: { en: "Furniture Assembly", he: "\u05d4\u05e8\u05db\u05d1\u05ea \u05e8\u05d4\u05d9\u05d8\u05d9\u05dd" },
  bp_iss_closet: { en: "Closets / Wardrobes", he: "\u05d0\u05e8\u05d5\u05e0\u05d5\u05ea" },
  bp_iss_door_fix: { en: "Door Repair / Replace", he: "\u05ea\u05d9\u05e7\u05d5\u05df / \u05d4\u05d7\u05dc\u05e4\u05ea \u05d3\u05dc\u05ea" },
  bp_iss_custom: { en: "Custom Woodwork", he: "\u05e0\u05d2\u05e8\u05d5\u05ea \u05d1\u05d4\u05ea\u05d0\u05de\u05d4" },
  bp_iss_deep_clean: { en: "Deep Cleaning", he: "\u05e0\u05d9\u05e7\u05d9\u05d5\u05df \u05d9\u05e1\u05d5\u05d3\u05d9" },
  bp_iss_post_reno: { en: "Post-Renovation", he: "\u05d0\u05d7\u05e8\u05d9 \u05e9\u05d9\u05e4\u05d5\u05e5" },
  bp_iss_windows: { en: "Window Cleaning", he: "\u05e0\u05d9\u05e7\u05d5\u05d9 \u05d7\u05dc\u05d5\u05e0\u05d5\u05ea" },
  bp_iss_carpet: { en: "Carpet / Upholstery", he: "\u05e9\u05d8\u05d9\u05d7\u05d9\u05dd / \u05e8\u05d9\u05e4\u05d5\u05d3" },

  /* Snap an Issue */
  snap_title: { en: "Snap an Issue", he: "\u05e6\u05dc\u05dd \u05ea\u05e7\u05dc\u05d4" },
  snap_sub: { en: "AI-powered diagnosis", he: "\u05d0\u05d1\u05d7\u05d5\u05df \u05de\u05d1\u05d5\u05e1\u05e1 AI" },
  snap_placeholder: { en: "Describe your issue or upload a photo...", he: "\u05ea\u05d0\u05e8\u05d5 \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4 \u05d0\u05d5 \u05d4\u05e2\u05dc\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4..." },
  snap_send: { en: "Send", he: "\u05e9\u05dc\u05d7" },
  snap_upload: { en: "Upload Photo", he: "\u05d4\u05e2\u05dc\u05d4 \u05ea\u05de\u05d5\u05e0\u05d4" },
  snap_analyzing: { en: "Analyzing your image...", he: "\u05de\u05e0\u05ea\u05d7 \u05d0\u05ea \u05d4\u05ea\u05de\u05d5\u05e0\u05d4..." },
  snap_diy: { en: "DIY Guide", he: "\u05de\u05d3\u05e8\u05d9\u05da \u05e2\u05e9\u05d4 \u05d6\u05d0\u05ea \u05d1\u05e2\u05e6\u05de\u05da" },
  snap_tools: { en: "Tools Needed", he: "\u05db\u05dc\u05d9\u05dd \u05e0\u05d3\u05e8\u05e9\u05d9\u05dd" },
  snap_time: { en: "Estimated Time", he: "\u05d6\u05de\u05df \u05de\u05e9\u05d5\u05e2\u05e8" },
  snap_cost: { en: "Estimated Cost", he: "\u05e2\u05dc\u05d5\u05ea \u05de\u05e9\u05d5\u05e2\u05e8\u05ea" },
  snap_book_pro: { en: "Book a Professional", he: "\u05d4\u05d6\u05de\u05df \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  snap_welcome: { en: "Hi! I'm your FixMate AI assistant. Take a photo of your issue or describe it, and I'll help diagnose the problem.", he: "\u05e9\u05dc\u05d5\u05dd! \u05d0\u05e0\u05d9 \u05e2\u05d5\u05d6\u05e8 \u05d4-AI \u05e9\u05dc \u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8. \u05e6\u05dc\u05de\u05d5 \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4 \u05d0\u05d5 \u05ea\u05d0\u05e8\u05d5 \u05d0\u05d5\u05ea\u05d4, \u05d5\u05d0\u05e0\u05d9 \u05d0\u05e2\u05d6\u05d5\u05e8 \u05dc\u05d0\u05d1\u05d7\u05df." },

  /* Mind Map */
  mm_title: { en: "Mind Map", he: "\u05de\u05e4\u05ea \u05d7\u05e9\u05d9\u05d1\u05d4" },
  mm_sub: { en: "Troubleshooting Guides", he: "\u05de\u05d3\u05e8\u05d9\u05db\u05d9 \u05e4\u05ea\u05e8\u05d5\u05df \u05ea\u05e7\u05dc\u05d5\u05ea" },
  mm_heading: { en: "Mind Map Guides", he: "\u05de\u05d3\u05e8\u05d9\u05db\u05d9\u05dd \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9\u05d9\u05dd" },
  mm_desc: { en: "Visual troubleshooting \u2014 tap branches to see step-by-step fixes", he: "\u05e4\u05ea\u05e8\u05d5\u05df \u05ea\u05e7\u05dc\u05d5\u05ea \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9 \u2014 \u05dc\u05d7\u05e6\u05d5 \u05e2\u05dc \u05e2\u05e0\u05e4\u05d9\u05dd \u05dc\u05e8\u05d0\u05d5\u05ea \u05e9\u05dc\u05d1\u05d9\u05dd" },
  mm_tap: { en: "Tap any step to see details", he: "\u05dc\u05d7\u05e6\u05d5 \u05e2\u05dc \u05e9\u05dc\u05d1 \u05dc\u05e4\u05e8\u05d8\u05d9\u05dd" },
  mm_steps: { en: "steps", he: "\u05e9\u05dc\u05d1\u05d9\u05dd" },
  mm_book_pro: { en: "Book a Professional", he: "\u05d4\u05d6\u05de\u05df \u05de\u05e7\u05e6\u05d5\u05e2\u05df" },
  mm_boiler: { en: "Hot Water Troubleshooting", he: "\u05e4\u05ea\u05e8\u05d5\u05df \u05d1\u05e2\u05d9\u05d5\u05ea \u05de\u05d9\u05dd \u05d7\u05de\u05d9\u05dd" },
  mm_ac: { en: "Air Conditioner Problem", he: "\u05d1\u05e2\u05d9\u05d5\u05ea \u05de\u05d6\u05d2\u05df" },
  mm_electrical: { en: "Electrical Short Circuit", he: "\u05e7\u05e6\u05e8 \u05d7\u05e9\u05de\u05dc\u05d9" },
  mm_plumbing: { en: "Plumbing Issues", he: "\u05d1\u05e2\u05d9\u05d5\u05ea \u05d0\u05d9\u05e0\u05e1\u05d8\u05dc\u05e6\u05d9\u05d4" },

  /* Rate Professional */
  rate_title: { en: "How was your experience?", he: "\u05d0\u05d9\u05da \u05d4\u05d9\u05d9\u05ea\u05d4 \u05d4\u05d7\u05d5\u05d5\u05d9\u05d4?" },
  rate_sub: { en: "Rate", he: "\u05d3\u05e8\u05d2\u05d5 \u05d0\u05ea" },
  rate_submit: { en: "Submit Rating", he: "\u05e9\u05dc\u05d7 \u05d3\u05d9\u05e8\u05d5\u05d2" },
  rate_skip: { en: "Skip for now", he: "\u05d3\u05dc\u05d2 \u05dc\u05e2\u05ea \u05e2\u05ea\u05d4" },
  rate_thanks: { en: "Thank You! \ud83c\udf89", he: "\u05ea\u05d5\u05d3\u05d4 \u05e8\u05d1\u05d4! \ud83c\udf89" },
  rate_submitted: { en: "Your rating has been submitted.", he: "\u05d4\u05d3\u05d9\u05e8\u05d5\u05d2 \u05e9\u05dc\u05db\u05dd \u05e0\u05e9\u05dc\u05d7." },
  rate_redirect: { en: "Redirecting to dashboard...", he: "\u05de\u05e2\u05d1\u05d9\u05e8 \u05dc\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3..." },
  rate_poor: { en: "Poor", he: "\u05d2\u05e8\u05d5\u05e2" },
  rate_fair: { en: "Fair", he: "\u05e1\u05d1\u05d9\u05e8" },
  rate_good: { en: "Good", he: "\u05d8\u05d5\u05d1" },
  rate_very_good: { en: "Very Good", he: "\u05d8\u05d5\u05d1 \u05de\u05d0\u05d5\u05d3" },
  rate_excellent: { en: "Excellent", he: "\u05de\u05e2\u05d5\u05dc\u05d4" },

  /* Pro Dashboard */
  pro_greeting: { en: "Good morning,", he: "\u05d1\u05d5\u05e7\u05e8 \u05d8\u05d5\u05d1," },
  pro_overview: { en: "Here's your business overview for today", he: "\u05d4\u05e0\u05d4 \u05e1\u05e7\u05d9\u05e8\u05ea \u05d4\u05e2\u05e1\u05e7 \u05e9\u05dc\u05da \u05dc\u05d4\u05d9\u05d5\u05dd" },
  pro_new_orders: { en: "New Orders", he: "\u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05d7\u05d3\u05e9\u05d5\u05ea" },
  pro_today_orders: { en: "Today's Orders", he: "\u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05d4\u05d9\u05d5\u05dd" },
  pro_weekly_income: { en: "Weekly Income", he: "\u05d4\u05db\u05e0\u05e1\u05d4 \u05e9\u05d1\u05d5\u05e2\u05d9\u05ea" },
  pro_avg_rating: { en: "Average Rating", he: "\u05d3\u05d9\u05e8\u05d5\u05d2 \u05de\u05de\u05d5\u05e6\u05e2" },
  pro_alert_title: { en: "new orders waiting!", he: "\u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05d7\u05d3\u05e9\u05d5\u05ea \u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea!" },
  pro_alert_sub: { en: "Clients are waiting for your approval", he: "\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05de\u05de\u05ea\u05d9\u05e0\u05d9\u05dd \u05dc\u05d0\u05d9\u05e9\u05d5\u05e8\u05da" },
  pro_view_orders: { en: "View Orders", he: "\u05e6\u05e4\u05d4 \u05d1\u05d4\u05d6\u05de\u05e0\u05d5\u05ea" },
  pro_new_orders_title: { en: "New Orders", he: "\u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05d7\u05d3\u05e9\u05d5\u05ea" },
  pro_all_caught: { en: "All caught up!", he: "\u05d4\u05db\u05dc \u05de\u05e2\u05d5\u05d3\u05db\u05df!" },
  pro_no_new: { en: "No new orders waiting for approval", he: "\u05d0\u05d9\u05df \u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05d7\u05d3\u05e9\u05d5\u05ea \u05dc\u05d0\u05d9\u05e9\u05d5\u05e8" },
  pro_approve: { en: "Approve", he: "\u05d0\u05e9\u05e8" },
  pro_decline: { en: "Decline", he: "\u05d3\u05d7\u05d4" },
  pro_today_schedule: { en: "Today's Schedule", he: "\u05dc\u05d5\u05d7 \u05d6\u05de\u05e0\u05d9\u05dd \u05dc\u05d4\u05d9\u05d5\u05dd" },
  pro_completed: { en: "Completed", he: "\u05d4\u05d5\u05e9\u05dc\u05dd" },
  pro_in_progress: { en: "In Progress", he: "\u05d1\u05d1\u05d9\u05e6\u05d5\u05e2" },
  pro_upcoming: { en: "Upcoming", he: "\u05e7\u05e8\u05d5\u05d1" },
  pro_approve_q: { en: "Approve Order?", he: "\u05dc\u05d0\u05e9\u05e8 \u05d4\u05d6\u05de\u05e0\u05d4?" },
  pro_decline_q: { en: "Decline Order?", he: "\u05dc\u05d3\u05d7\u05d5\u05ea \u05d4\u05d6\u05de\u05e0\u05d4?" },
  pro_decline_warn: { en: "This action cannot be undone.", he: "\u05e4\u05e2\u05d5\u05dc\u05d4 \u05d6\u05d5 \u05dc\u05d0 \u05e0\u05d9\u05ea\u05e0\u05ea \u05dc\u05d1\u05d9\u05d8\u05d5\u05dc." },
  pro_go_back: { en: "Go Back", he: "\u05d7\u05d6\u05e8\u05d4" },
  pro_notifications: { en: "Notifications", he: "\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea" },
  pro_mark_all: { en: "Mark all read", he: "\u05e1\u05de\u05df \u05d4\u05db\u05dc \u05db\u05e0\u05e7\u05e8\u05d0" },
  pro_tab_dashboard: { en: "Dashboard", he: "\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3" },
  pro_tab_orders: { en: "Manage Orders", he: "\u05e0\u05d9\u05d4\u05d5\u05dc \u05d4\u05d6\u05de\u05e0\u05d5\u05ea" },
  pro_tab_clients: { en: "Manage Clients", he: "\u05e0\u05d9\u05d4\u05d5\u05dc \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea" },
  pro_tab_profile: { en: "Profile", he: "\u05e4\u05e8\u05d5\u05e4\u05d9\u05dc" },

  /* Shared */
  cancel: { en: "Cancel", he: "\u05d1\u05d9\u05d8\u05d5\u05dc" },
};

/* --- PROVIDER --- */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(function() {
    try { return localStorage.getItem("fixmate_lang") || "en"; } catch(e) { return "en"; }
  });
  var toggleLang = function() { setLang(function(prev) { var next = prev === "en" ? "he" : "en"; try { localStorage.setItem("fixmate_lang", next); } catch(e) {} return next; }); };
  var dir = lang === "he" ? "rtl" : "ltr";
  var translate = function(key) { return (T[key] && T[key][lang]) || (T[key] && T[key].en) || key; };

  /* Set dir and lang on the root html element so the ENTIRE site flips */
  useEffect(function() {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
    document.body.style.textAlign = dir === "rtl" ? "right" : "left";
    document.body.style.direction = dir;
    document.body.style.fontFamily = lang === "he"
      ? "'Heebo', 'DM Sans', sans-serif"
      : "'DM Sans', 'Inter', sans-serif";

    /* Inject global style to override ALL font-family when Hebrew */
    var styleId = "fixmate-rtl-style";
    var existing = document.getElementById(styleId);
    if (existing) existing.remove();

    /* Make sure Heebo font is always loaded */
    var fontId = "fixmate-heebo-font";
    if (!document.getElementById(fontId)) {
      var link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }

    if (lang === "he") {
      var style = document.createElement("style");
      style.id = styleId;
      style.textContent = [
        "* { font-family: 'Heebo', 'DM Sans', sans-serif !important; }",
        "h1, h2, h3, h4, h5, h6, button, input, select, textarea, label, span, p, a, div {",
        "  font-family: 'Heebo', 'DM Sans', sans-serif !important;",
        "}",
        "body { direction: rtl !important; text-align: right !important; }",
      ].join("\n");
      document.head.appendChild(style);
    }
  }, [lang, dir]);
  return (
    <LangContext.Provider value={{ lang: lang, dir: dir, toggleLang: toggleLang, t: translate }}>
      {children}
    </LangContext.Provider>
  );
}

/* --- HOOK --- */
export function useLang() {
  var ctx = useContext(LangContext);
  if (!ctx) {
    /* Fallback: read language from localStorage even without Provider */
    var savedLang = "en";
    try { savedLang = localStorage.getItem("fixmate_lang") || "en"; } catch(e) {}
    var savedDir = savedLang === "he" ? "rtl" : "ltr";
    return {
      lang: savedLang,
      dir: savedDir,
      toggleLang: function() {
        var next = savedLang === "en" ? "he" : "en";
        try { localStorage.setItem("fixmate_lang", next); } catch(e) {}
        window.location.reload();
      },
      t: function(key) { return (T[key] && T[key][savedLang]) || (T[key] && T[key].en) || key; },
    };
  }
  return ctx;
}

/* --- TOGGLE BUTTON --- */
export function LangToggle() {
  var ctx = useLang();
  return (
    <button
      onClick={ctx.toggleLang}
      title={ctx.lang === "en" ? "Switch to Hebrew" : "Switch to English"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 10,
        border: "1.5px solid #E2E8F0",
        background: "#F8FAFC",
        color: "#475569",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all .2s",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: 0.5,
      }}
    >
      <span style={{ fontSize: 15 }}>{ctx.lang === "en" ? "\ud83c\uddee\ud83c\uddf1" : "\ud83c\uddec\ud83c\udde7"}</span>
      {ctx.lang === "en" ? "\u05e2\u05d1" : "EN"}
    </button>
  );
}

/* --- STANDALONE helpers (work WITHOUT Provider) --- */
export function getLang() {
  try { return localStorage.getItem("fixmate_lang") || "en"; } catch(e) { return "en"; }
}
export function getDir() {
  return getLang() === "he" ? "rtl" : "ltr";
}
export function translate(key) {
  var lang = getLang();
  return (T[key] && T[key][lang]) || (T[key] && T[key].en) || key;
}