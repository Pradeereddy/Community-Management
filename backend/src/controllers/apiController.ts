import { Request, Response } from 'express';
import pool from '../config/database';


// Function to create a complaint
export const createComplaint = async (req: Request, res: Response) => {
    const { resident_id, unit_number, complaint_type, description } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO Complaints (resident_id, unit_number, complaint_type, description, status)
             VALUES ($1, $2, $3, $4, 'Submitted') RETURNING *`,
            [resident_id, unit_number, complaint_type, description]
        );
        res.status(201).json({ message: 'Complaint created', complaint: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get complaints
export const getComplaints = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Complaints');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Function to update the status of a complaint
export const updateComplaintStatus = async (req: Request, res: Response) : Promise<any> => {
    const complaintId = req.params.id; // Get complaint ID from request parameters
    const { status } = req.body; // Get the new status from the request body

    // Validate the status
    const validStatuses = ['In_progress', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either In_progress or Completed.' });
    }

    try {
        // Check if the complaint exists
        const complaint = await pool.query(
            `SELECT * FROM Complaints WHERE complaint_id = $1`,
            [complaintId]
        );

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
        const result = await pool.query(
            `UPDATE Complaints SET status = $1, date_resolved = CASE WHEN $1 = 'Completed' THEN CURRENT_TIMESTAMP ELSE NULL END
             WHERE complaint_id = $2 RETURNING *`,
            [status, complaintId]
        );

        res.json({ message: 'Complaint status updated', complaint: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to create a maintenance request
export const createMaintenanceRequest = async (req: Request, res: Response) => {
    const { resident_id, unit_number, request_description } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO MaintenanceRequests (resident_id, unit_number, request_description, status)
             VALUES ($1, $2, $3, 'Open') RETURNING *`,
            [resident_id, unit_number, request_description]
        );
        res.status(201).json({ message: 'Maintenance request created', request: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get maintenance requests
export const getMaintenanceRequests = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM MaintenanceRequests');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Function to update the status of a maintenance request
export const updateMaintenanceRequestStatus = async (req: Request, res: Response) : Promise<any> => {
    const requestId = req.params.id; // Get request ID from request parameters
    const { status } = req.body; // Get the new status from the request body

    // Validate the status (you can adjust valid statuses based on your enum)
    const validStatuses = ['In_progress', 'Completed']; // Example statuses
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either In_progress or Completed.' });
    }

    try {
        // Check if the maintenance request exists
        const request = await pool.query(
            `SELECT * FROM MaintenanceRequests WHERE request_id = $1`,
            [requestId]
        );

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
        const result = await pool.query(
            `UPDATE MaintenanceRequests SET status = $1, date_resolved = CASE WHEN $1 = 'Completed' THEN CURRENT_TIMESTAMP ELSE NULL END
             WHERE request_id = $2 RETURNING *`,
            [status, requestId]
        );

        res.json({ message: 'Maintenance request status updated', request: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Function to get events
export const getEvents = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Events');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to register for an event
export const registerForEvent = async (req: Request, res: Response) => {
    const { resident_id, unit_number } = req.body;
    const eventId = req.params.id;
    try {
        const result = await pool.query(
            `INSERT INTO EventRegistrations (event_id, resident_id, unit_number, attendance_status)
             VALUES ($1, $2, $3, 'Registered') RETURNING *`,
            [eventId, resident_id, unit_number]
        );
        res.status(201).json({ message: 'Registered for event', registration: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Function to cancel registration for an event
export const cancelEventRegistration = async (req: Request, res: Response) : Promise<any> => {
    const registrationId = req.params.id; // Get registration ID from request parameters
    const userId = req.body.user_id; // Replace with actual user ID from auth context

    try {
        // Check if the registration exists and is associated with the user
        const registration = await pool.query(
            `SELECT * FROM EventRegistrations WHERE registration_id = $1 AND resident_id = $2`,
            [registrationId, userId]
        );

        if (registration.rows.length === 0) {
            return res.status(404).json({ message: 'Registration not found or not associated with you' });
        }

        // Delete the registration
        await pool.query(
            `DELETE FROM EventRegistrations WHERE registration_id = $1`,
            [registrationId]
        );

        res.json({ message: 'Registration canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Function to get facilities
export const getFacilities = async (req: Request, res: Response) => {
    // Assuming you have a Facilities table, otherwise adjust accordingly
    try {
        const result = await pool.query('SELECT * FROM FacilityBookings');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to book a facility
export const bookFacility = async (req: Request, res: Response) => {
    const { resident_id, unit_number, booking_date, start_time, end_time } = req.body;
    const facilityId = req.params.id; // Assuming you have a way to identify the facility
    try {
        const result = await pool.query(
            `INSERT INTO FacilityBookings (facility_name, resident_id, unit_number, booking_date, start_time, end_time, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
            [facilityId, resident_id, unit_number, booking_date, start_time, end_time]
        );
        res.status(201).json({ message: 'Facility booked', booking: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to cancel a facility booking
export const cancelFacilityBooking = async (req: Request, res: Response) : Promise<any> => {
    const bookingId = req.params.id; // Get booking ID from request parameters
    const userId = req.body.user_id; // Replace with actual user ID from auth context

    try {
        // Check if the booking exists and is associated with the user
        const booking = await pool.query(
            `SELECT * FROM FacilityBookings WHERE booking_id = $1 AND resident_id = $2`,
            [bookingId, userId]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found or not associated with you' });
        }

        // Delete the booking
        await pool.query(
            `DELETE FROM FacilityBookings WHERE booking_id = $1`,
            [bookingId]
        );

        res.json({ message: 'Booking canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to approve or reject a facility booking
export const updateFacilityBookingStatus = async (req: Request, res: Response) :Promise<any> => {
    const bookingId = req.params.id; // Get booking ID from request parameters
    const { status } = req.body; // Get the new status from the request body

    // Validate the status
    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either Approved or Rejected.' });
    }

    try {
        // Check if the booking exists
        const booking = await pool.query(
            `SELECT * FROM FacilityBookings WHERE booking_id = $1`,
            [bookingId]
        );

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
        const result = await pool.query(
            `UPDATE FacilityBookings SET status = $1
             WHERE booking_id = $2 RETURNING *`,
            [status, bookingId]
        );

        res.json({ message: 'Booking status updated', booking: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get visitors
export const getVisitors = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Visitors');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to approve a visitor
export const approveVisitor = async (req: Request, res: Response) : Promise<any> => {
    const visitorId = req.params.id; // Get visitor ID from request parameters
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    const unitNumber = req.body.unit_number; // Replace with actual unit number from auth context

    try {
        // Check if the visitor exists and is visiting the user's unit
        const visitor = await pool.query(
            `SELECT * FROM Visitors WHERE visitor_id = $1 AND unit_number = $2`,
            [visitorId, unitNumber]
        );

        if (visitor.rows.length === 0) {
            return res.status(404).json({ message: 'Visitor not found or not visiting your unit' });
        }
       

        // Update the visitor's approved_by field
        const result = await pool.query(
            `UPDATE Visitors SET approved_by = $1 WHERE visitor_id = $2 RETURNING *`,
            [userId, visitorId]
        );

        res.json({ message: 'Visitor approved', visitor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to mark exit time for a visitor
export const markExitTime = async (req: Request, res: Response) : Promise<any> => {
    const visitorId = req.params.id; // Get visitor ID from request parameters
    const currentUserRole = req.body.user_role; // Replace with actual user role from auth context

    try {
        // Check if the visitor exists and is approved
        const visitor = await pool.query(
            `SELECT * FROM Visitors WHERE visitor_id = $1 AND approved_by IS NOT NULL`,
            [visitorId]
        );

        if (visitor.rows.length === 0) {
            return res.status(404).json({ message: 'Visitor not found or not approved' });
        }

        // Allow marking exit time only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to mark exit time' });
        }

        // Update the exit time
        const result = await pool.query(
            `UPDATE Visitors SET exit_time = CURRENT_TIMESTAMP WHERE visitor_id = $1 RETURNING *`,
            [visitorId]
        );

        res.json({ message: 'Exit time marked', visitor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to view Announcements
export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Announcements');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to create a new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
    const { title, description, is_urgent, posted_by, unit_number, expiry_date } = req.body; // Updated to include new fields
    try {
        const result = await pool.query(
            `INSERT INTO Announcements (title, description, is_urgent, posted_by, unit_number, expiry_date)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description, is_urgent, posted_by, unit_number, expiry_date]
        );
        res.status(201).json({ message: 'Announcement created', announcement: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to edit an announcement
export const editAnnouncement = async (req: Request, res: Response) : Promise<any> => {
    const announcementId = req.params.id; // Get announcement ID from request parameters
    const { title, description, is_urgent, posted_by, unit_number, expiry_date } = req.body; // Updated fields
    try {
        // Check if the announcement exists and if the user is allowed to edit it
        const announcement = await pool.query(
            `SELECT * FROM Announcements WHERE announcement_id = $1`,
            [announcementId]
        );

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

        const result = await pool.query(
            `UPDATE Announcements SET title = $1, description = $2, is_urgent = $3, unit_number = $4, expiry_date = $5
             WHERE announcement_id = $6 RETURNING *`,
            [title, description, is_urgent, unit_number, expiry_date, announcementId]
        );

        res.json({ message: 'Announcement updated', announcement: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to delete an announcement
export const deleteAnnouncement = async (req: Request, res: Response) : Promise<any> => {
    const announcementId = req.params.id; // Get announcement ID from request parameters
    try {
        // Check if the announcement exists
        const announcement = await pool.query(
            `SELECT * FROM Announcements WHERE announcement_id = $1`,
            [announcementId]
        );

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

        await pool.query(
            `DELETE FROM Announcements WHERE announcement_id = $1`,
            [announcementId]
        );

        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get parking slots
export const getParkingSlots = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM ParkingSlots');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to assign a parking slot
export const assignParkingSlot = async (req: Request, res: Response) : Promise<any> => {
    const { slot_number } = req.body; // Get the slot number from the request body
    const userId = req.body.user_id; // Replace with actual user ID from auth context
    const unitNumber = req.body.unit_number; // Replace with actual unit number from auth context

    try {
        // Check if the parking slot exists and is vacant
        const slot = await pool.query(
            `SELECT * FROM ParkingSlots WHERE slot_number = $1 AND status = 'vacant'`,
            [slot_number]
        );

        if (slot.rows.length === 0) {
            return res.status(404).json({ message: 'Parking slot not found or not vacant' });
        }

        // Assign the parking slot to the user
        await pool.query(
            `UPDATE ParkingSlots SET assigned_to_resident = $1, assigned_to_unit = $2, status = 'assigned'
             WHERE parking_slot_id = $3`,
            [userId, unitNumber, slot.rows[0].parking_slot_id]
        );

        res.json({ message: 'Parking slot assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to unassign a parking slot
export const unassignParkingSlot = async (req: Request, res: Response) : Promise<any> => {
    const { slot_number } = req.body; // Get the slot number from the request body
    const userId = req.body.user_id; // Replace with actual user ID from auth context

    try {
        // Check if the parking slot exists and is assigned to the user
        const slot = await pool.query(
            `SELECT * FROM ParkingSlots WHERE slot_number = $1 AND assigned_to_resident = $2`,
            [slot_number, userId]
        );

        if (slot.rows.length === 0) {
            return res.status(404).json({ message: 'Parking slot not found or not assigned to you' });
        }

        // Unassign the parking slot
        await pool.query(
            `UPDATE ParkingSlots SET assigned_to_resident = NULL, assigned_to_unit = NULL, status = 'vacant'
             WHERE parking_slot_id = $1`,
            [slot.rows[0].parking_slot_id]
        );

        res.json({ message: 'Parking slot unassigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get all apartments
export const getAllApartments = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Apartments');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to add a new apartment
export const addNewApartment = async (req: Request, res: Response) :Promise<any> => {
    const { building_name, unit_number, floor_number, number_of_rooms, status } = req.body; // Get apartment details from request body

    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context

        // Allow addition only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to add apartments' });
        }

        const result = await pool.query(
            `INSERT INTO Apartments (building_name, unit_number, floor_number, number_of_rooms, status)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [building_name, unit_number, floor_number, number_of_rooms, status]
        );
        res.status(201).json({ message: 'Apartment added', apartment: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to update an apartment
export const updateApartment = async (req: Request, res: Response) : Promise<any> => {
    const apartmentId = req.params.id; // Get apartment ID from request parameters
    const { building_name, unit_number, floor_number, number_of_rooms, status } = req.body; // Get updated details from request body

    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context

        // Allow update only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to update apartments' });
        }

        const result = await pool.query(
            `UPDATE Apartments SET building_name = $1, unit_number = $2, floor_number = $3, number_of_rooms = $4, status = $5
             WHERE apartment_id = $6 RETURNING *`,
            [building_name, unit_number, floor_number, number_of_rooms, status, apartmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        res.json({ message: 'Apartment updated', apartment: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to delete an apartment
export const deleteApartment = async (req: Request, res: Response) : Promise<any> => {
    const apartmentId = req.params.id; // Get apartment ID from request parameters

    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context

        // Allow deletion only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to delete apartments' });
        }

        const result = await pool.query(
            `DELETE FROM Apartments WHERE apartment_id = $1 RETURNING *`,
            [apartmentId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        res.json({ message: 'Apartment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to register a visitor
export const registerVisitor = async (req: Request, res: Response) : Promise<any> => {
    const { visitor_name, contact_number, purpose_of_visit, visiting_unit_id, unit_number } = req.body; // Get visitor details from request body

    try {
        // Assuming you have a way to get the current user's role
        const currentUserRole = req.body.user_role; // Replace with actual user role from auth context

        // Allow registration only if the user is staff
        if (currentUserRole !== 'staff') {
            return res.status(403).json({ message: 'Not authorized to register visitors' });
        }

        const result = await pool.query(
            `INSERT INTO Visitors (visitor_name, contact_number, purpose_of_visit, visiting_unit_id, unit_number, approved_by, entry_time)
             VALUES ($1, $2, $3, $4, $5, NULL, CURRENT_TIMESTAMP) RETURNING *`,
            [visitor_name, contact_number, purpose_of_visit, visiting_unit_id, unit_number]
        );

        res.status(201).json({ message: 'Visitor registered', visitor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to create a new event
export const createEvent = async (req: Request, res: Response) : Promise<any> => {
    const { event_name, description, event_date, start_time, end_time, location, organized_by, max_participants } = req.body;

    // Check if the user is staff
    const currentUserRole = req.body.user_role; // Replace with actual user role from auth context
    if (currentUserRole !== 'staff') {
        return res.status(403).json({ message: 'Not authorized to create events' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO Events (event_name, description, event_date, start_time, end_time, location, organized_by, max_participants, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Upcoming') RETURNING *`,
            [event_name, description, event_date, start_time, end_time, location, organized_by, max_participants]
        );
        res.status(201).json({ message: 'Event created', event: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

