"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = exports.registerVisitor = exports.deleteApartment = exports.updateApartment = exports.addNewApartment = exports.getAllApartments = exports.unassignParkingSlot = exports.assignParkingSlot = exports.getParkingSlots = exports.deleteAnnouncement = exports.editAnnouncement = exports.createAnnouncement = exports.getAnnouncements = exports.markExitTime = exports.approveVisitor = exports.getVisitors = exports.updateFacilityBookingStatus = exports.cancelFacilityBooking = exports.bookFacility = exports.getFacilities = exports.cancelEventRegistration = exports.registerForEvent = exports.getEvents = exports.updateMaintenanceRequestStatus = exports.getMaintenanceRequests = exports.createMaintenanceRequest = exports.updateComplaintStatus = exports.getComplaints = exports.createComplaint = void 0;
const database_1 = __importDefault(require("../config/database"));
// Function to create a complaint
const createComplaint = async (req, res) => {
    const { resident_id, unit_number, complaint_type, description } = req.body;
    try {
        const result = await database_1.default.query(`INSERT INTO Complaints (resident_id, unit_number, complaint_type, description, status)
             VALUES ($1, $2, $3, $4, 'Submitted') RETURNING *`, [resident_id, unit_number, complaint_type, description]);
        res.status(201).json({ message: 'Complaint created', complaint: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createComplaint = createComplaint;
// Function to get complaints
const getComplaints = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM Complaints');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getComplaints = getComplaints;
// Function to update the status of a complaint
const updateComplaintStatus = async (req, res) => {
    const complaintId = req.params.id; // Get complaint ID from request parameters
    const { status } = req.body; // Get the new status from the request body
    // Validate the status
    const validStatuses = ['In_progress', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either In_progress or Completed.' });
    }
    try {
        // Check if the complaint exists
        const complaint = await database_1.default.query(`SELECT * FROM Complaints WHERE complaint_id = $1`, [complaintId]);
        if (complaint.rows.length === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow update only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to update complaint status' });
        }
        // Update the complaint status
        const result = await database_1.default.query(`UPDATE Complaints SET status = $1, date_resolved = CASE WHEN $1 = 'Completed' THEN CURRENT_TIMESTAMP ELSE NULL END
             WHERE complaint_id = $2 RETURNING *`, [status, complaintId]);
        res.json({ message: 'Complaint status updated', complaint: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
// Function to create a maintenance request
const createMaintenanceRequest = async (req, res) => {
    const { resident_id, unit_number, request_description } = req.body;
    try {
        const result = await database_1.default.query(`INSERT INTO MaintenanceRequests (resident_id, unit_number, request_description, status)
             VALUES ($1, $2, $3, 'Open') RETURNING *`, [resident_id, unit_number, request_description]);
        res.status(201).json({ message: 'Maintenance request created', request: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createMaintenanceRequest = createMaintenanceRequest;
// Function to get maintenance requests
const getMaintenanceRequests = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM MaintenanceRequests');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMaintenanceRequests = getMaintenanceRequests;
// Function to update the status of a maintenance request
const updateMaintenanceRequestStatus = async (req, res) => {
    const requestId = req.params.id; // Get request ID from request parameters
    const { status } = req.body; // Get the new status from the request body
    // Validate the status (you can adjust valid statuses based on your enum)
    const validStatuses = ['In_progress', 'Completed']; // Example statuses
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either In_progress or Completed.' });
    }
    try {
        // Check if the maintenance request exists
        const request = await database_1.default.query(`SELECT * FROM MaintenanceRequests WHERE request_id = $1`, [requestId]);
        if (request.rows.length === 0) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow update only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to update maintenance request status' });
        }
        // Update the maintenance request status
        const result = await database_1.default.query(`UPDATE MaintenanceRequests SET status = $1, date_resolved = CASE WHEN $1 = 'Completed' THEN CURRENT_TIMESTAMP ELSE NULL END
             WHERE request_id = $2 RETURNING *`, [status, requestId]);
        res.json({ message: 'Maintenance request status updated', request: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateMaintenanceRequestStatus = updateMaintenanceRequestStatus;
// Function to get events
const getEvents = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM Events');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getEvents = getEvents;
// Function to register for an event
const registerForEvent = async (req, res) => {
    const { resident_id, unit_number } = req.body;
    const eventId = req.params.id;
    try {
        const result = await database_1.default.query(`INSERT INTO EventRegistrations (event_id, resident_id, unit_number, attendance_status)
             VALUES ($1, $2, $3, 'Registered') RETURNING *`, [eventId, resident_id, unit_number]);
        res.status(201).json({ message: 'Registered for event', registration: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.registerForEvent = registerForEvent;
// Function to cancel registration for an event
const cancelEventRegistration = async (req, res) => {
    const registrationId = req.params.id; // Get registration ID from request parameters
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    try {
        // Check if the registration exists and is associated with the user
        const registration = await database_1.default.query(`SELECT * FROM EventRegistrations WHERE registration_id = $1 AND resident_id = $2`, [registrationId, userId]);
        if (registration.rows.length === 0) {
            return res.status(404).json({ message: 'Registration not found or not associated with you' });
        }
        // Delete the registration
        await database_1.default.query(`DELETE FROM EventRegistrations WHERE registration_id = $1`, [registrationId]);
        res.json({ message: 'Registration canceled successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.cancelEventRegistration = cancelEventRegistration;
// Function to get facilities
const getFacilities = async (req, res) => {
    // Assuming you have a Facilities table, otherwise adjust accordingly
    try {
        const result = await database_1.default.query('SELECT * FROM FacilityBookings');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getFacilities = getFacilities;
// Function to book a facility
const bookFacility = async (req, res) => {
    const { resident_id, unit_number, booking_date, start_time, end_time } = req.body;
    const facilityId = req.params.id; // Assuming you have a way to identify the facility
    try {
        const result = await database_1.default.query(`INSERT INTO FacilityBookings (facility_name, resident_id, unit_number, booking_date, start_time, end_time, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`, [facilityId, resident_id, unit_number, booking_date, start_time, end_time]);
        res.status(201).json({ message: 'Facility booked', booking: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.bookFacility = bookFacility;
// Function to cancel a facility booking
const cancelFacilityBooking = async (req, res) => {
    const bookingId = req.params.id; // Get booking ID from request parameters
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    try {
        // Check if the booking exists and is associated with the user
        const booking = await database_1.default.query(`SELECT * FROM FacilityBookings WHERE booking_id = $1 AND resident_id = $2`, [bookingId, userId]);
        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found or not associated with you' });
        }
        // Delete the booking
        await database_1.default.query(`DELETE FROM FacilityBookings WHERE booking_id = $1`, [bookingId]);
        res.json({ message: 'Booking canceled successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.cancelFacilityBooking = cancelFacilityBooking;
// Function to approve or reject a facility booking
const updateFacilityBookingStatus = async (req, res) => {
    const bookingId = req.params.id; // Get booking ID from request parameters
    const { status } = req.body; // Get the new status from the request body
    // Validate the status
    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either Approved or Rejected.' });
    }
    try {
        // Check if the booking exists
        const booking = await database_1.default.query(`SELECT * FROM FacilityBookings WHERE booking_id = $1`, [bookingId]);
        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow update only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to update booking status' });
        }
        // Update the booking status
        const result = await database_1.default.query(`UPDATE FacilityBookings SET status = $1
             WHERE booking_id = $2 RETURNING *`, [status, bookingId]);
        res.json({ message: 'Booking status updated', booking: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateFacilityBookingStatus = updateFacilityBookingStatus;
// Function to get visitors
const getVisitors = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM Visitors');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVisitors = getVisitors;
// Function to approve a visitor
const approveVisitor = async (req, res) => {
    const visitorId = req.params.id; // Get visitor ID from request parameters
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    const unitNumber = req.body.unit_number; // Replace with actual unit number from auth context
    try {
        // Check if the visitor exists and is visiting the user's unit
        const visitor = await database_1.default.query(`SELECT * FROM Visitors WHERE visitor_id = $1 AND unit_number = $2`, [visitorId, unitNumber]);
        if (visitor.rows.length === 0) {
            return res.status(404).json({ message: 'Visitor not found or not visiting your unit' });
        }
        // Update the visitor's approved_by field
        const result = await database_1.default.query(`UPDATE Visitors SET approved_by = $1 WHERE visitor_id = $2 RETURNING *`, [userId, visitorId]);
        res.json({ message: 'Visitor approved', visitor: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.approveVisitor = approveVisitor;
// Function to mark exit time for a visitor
const markExitTime = async (req, res) => {
    const visitorId = req.params.id; // Get visitor ID from request parameters
    const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
    try {
        // Check if the visitor exists and is approved
        const visitor = await database_1.default.query(`SELECT * FROM Visitors WHERE visitor_id = $1 AND approved_by IS NOT NULL`, [visitorId]);
        if (visitor.rows.length === 0) {
            return res.status(404).json({ message: 'Visitor not found or not approved' });
        }
        // Allow marking exit time only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to mark exit time' });
        }
        // Update the exit time
        const result = await database_1.default.query(`UPDATE Visitors SET exit_time = CURRENT_TIMESTAMP WHERE visitor_id = $1 RETURNING *`, [visitorId]);
        res.json({ message: 'Exit time marked', visitor: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markExitTime = markExitTime;
// Function to view Announcements
const getAnnouncements = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM Announcements');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAnnouncements = getAnnouncements;
// Function to create a new announcement
const createAnnouncement = async (req, res) => {
    const { title, description, is_urgent, posted_by, unit_number, expiry_date } = req.body; // Updated to include new fields
    try {
        const result = await database_1.default.query(`INSERT INTO Announcements (title, description, is_urgent, posted_by, unit_number, expiry_date)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [title, description, is_urgent, posted_by, unit_number, expiry_date]);
        res.status(201).json({ message: 'Announcement created', announcement: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createAnnouncement = createAnnouncement;
// Function to edit an announcement
const editAnnouncement = async (req, res) => {
    const announcementId = req.params.id; // Get announcement ID from request parameters
    const { title, description, is_urgent, posted_by, unit_number, expiry_date } = req.body; // Updated fields
    try {
        // Check if the announcement exists and if the user is allowed to edit it
        const announcement = await database_1.default.query(`SELECT * FROM Announcements WHERE announcement_id = $1`, [announcementId]);
        if (announcement.rows.length === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        // Assuming you have a way to get the current user's ID and role
        const currentUserId = req.body.user_id; // Replace with actual user ID from auth context
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow edit if the announcement was created by the user or if the user is staff
        if (announcement.rows[0].posted_by !== currentUserId && currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to edit this announcement' });
        }
        const result = await database_1.default.query(`UPDATE Announcements SET title = $1, description = $2, is_urgent = $3, unit_number = $4, expiry_date = $5
             WHERE announcement_id = $6 RETURNING *`, [title, description, is_urgent, unit_number, expiry_date, announcementId]);
        res.json({ message: 'Announcement updated', announcement: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.editAnnouncement = editAnnouncement;
// Function to delete an announcement
const deleteAnnouncement = async (req, res) => {
    const announcementId = req.params.id; // Get announcement ID from request parameters
    try {
        // Check if the announcement exists
        const announcement = await database_1.default.query(`SELECT * FROM Announcements WHERE announcement_id = $1`, [announcementId]);
        if (announcement.rows.length === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        // Assuming you have a way to get the current user's ID and role
        const currentUserId = req.body.user_id; // Replace with actual user ID from auth context
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow delete if the announcement was created by the user or if the user is staff
        if (announcement.rows[0].posted_by !== currentUserId && currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to delete this announcement' });
        }
        await database_1.default.query(`DELETE FROM Announcements WHERE announcement_id = $1`, [announcementId]);
        res.json({ message: 'Announcement deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
// Function to get parking slots
const getParkingSlots = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM ParkingSlots');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getParkingSlots = getParkingSlots;
// Function to assign a parking slot
const assignParkingSlot = async (req, res) => {
    const { slot_number } = req.body; // Get the slot number from the request body
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    const unitNumber = req.body.unit_number; // Replace with actual unit number from auth context
    try {
        // Check if the parking slot exists and is vacant
        const slot = await database_1.default.query(`SELECT * FROM ParkingSlots WHERE slot_number = $1 AND status = 'vacant'`, [slot_number]);
        if (slot.rows.length === 0) {
            return res.status(404).json({ message: 'Parking slot not found or not vacant' });
        }
        // Assign the parking slot to the user
        await database_1.default.query(`UPDATE ParkingSlots SET assigned_to_resident = $1, assigned_to_unit = $2, status = 'assigned'
             WHERE parking_slot_id = $3`, [userId, unitNumber, slot.rows[0].parking_slot_id]);
        res.json({ message: 'Parking slot assigned successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.assignParkingSlot = assignParkingSlot;
// Function to unassign a parking slot
const unassignParkingSlot = async (req, res) => {
    const { slot_number } = req.body; // Get the slot number from the request body
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    try {
        // Check if the parking slot exists and is assigned to the user
        const slot = await database_1.default.query(`SELECT * FROM ParkingSlots WHERE slot_number = $1 AND assigned_to_resident = $2`, [slot_number, userId]);
        if (slot.rows.length === 0) {
            return res.status(404).json({ message: 'Parking slot not found or not assigned to you' });
        }
        // Unassign the parking slot
        await database_1.default.query(`UPDATE ParkingSlots SET assigned_to_resident = NULL, assigned_to_unit = NULL, status = 'vacant'
             WHERE parking_slot_id = $1`, [slot.rows[0].parking_slot_id]);
        res.json({ message: 'Parking slot unassigned successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.unassignParkingSlot = unassignParkingSlot;
// Function to get all apartments
const getAllApartments = async (req, res) => {
    try {
        const result = await database_1.default.query('SELECT * FROM Apartments');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllApartments = getAllApartments;
// Function to add a new apartment
const addNewApartment = async (req, res) => {
    const { building_name, unit_number, floor_number, number_of_rooms, status } = req.body; // Get apartment details from request body
    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow addition only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to add apartments' });
        }
        const result = await database_1.default.query(`INSERT INTO Apartments (building_name, unit_number, floor_number, number_of_rooms, status)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`, [building_name, unit_number, floor_number, number_of_rooms, status]);
        res.status(201).json({ message: 'Apartment added', apartment: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addNewApartment = addNewApartment;
// Function to update an apartment
const updateApartment = async (req, res) => {
    const apartmentId = req.params.id; // Get apartment ID from request parameters
    const { building_name, unit_number, floor_number, number_of_rooms, status } = req.body; // Get updated details from request body
    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow update only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to update apartments' });
        }
        const result = await database_1.default.query(`UPDATE Apartments SET building_name = $1, unit_number = $2, floor_number = $3, number_of_rooms = $4, status = $5
             WHERE apartment_id = $6 RETURNING *`, [building_name, unit_number, floor_number, number_of_rooms, status, apartmentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Apartment not found' });
        }
        res.json({ message: 'Apartment updated', apartment: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateApartment = updateApartment;
// Function to delete an apartment
const deleteApartment = async (req, res) => {
    const apartmentId = req.params.id; // Get apartment ID from request parameters
    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow deletion only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to delete apartments' });
        }
        const result = await database_1.default.query(`DELETE FROM Apartments WHERE apartment_id = $1 RETURNING *`, [apartmentId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Apartment not found' });
        }
        res.json({ message: 'Apartment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteApartment = deleteApartment;
// Function to register a visitor
const registerVisitor = async (req, res) => {
    const { visitor_name, contact_number, purpose_of_visit, visiting_unit_id, unit_number } = req.body; // Get visitor details from request body
    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
        // Allow registration only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to register visitors' });
        }
        const result = await database_1.default.query(`INSERT INTO Visitors (visitor_name, contact_number, purpose_of_visit, visiting_unit_id, unit_number, approved_by, entry_time)
             VALUES ($1, $2, $3, $4, $5, NULL, CURRENT_TIMESTAMP) RETURNING *`, [visitor_name, contact_number, purpose_of_visit, visiting_unit_id, unit_number]);
        res.status(201).json({ message: 'Visitor registered', visitor: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.registerVisitor = registerVisitor;
// Function to create a new event
const createEvent = async (req, res) => {
    const { event_name, description, event_date, start_time, end_time, location, organized_by, max_participants } = req.body;
    // Check if the user is staff
    const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
    if (currentUserRole !== 'staff') {
        return res.status(403).json({ message: 'Not authorized to create events' });
    }
    try {
        const result = await database_1.default.query(`INSERT INTO Events (event_name, description, event_date, start_time, end_time, location, organized_by, max_participants, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Upcoming') RETURNING *`, [event_name, description, event_date, start_time, end_time, location, organized_by, max_participants]);
        res.status(201).json({ message: 'Event created', event: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createEvent = createEvent;
