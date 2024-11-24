import { Router } from 'express';
import { getParkingSlots, createComplaint, getComplaints, createMaintenanceRequest, getMaintenanceRequests, getEvents, registerForEvent, cancelEventRegistration, createEvent, getFacilities, bookFacility, getVisitors, approveVisitor, getAnnouncements, createAnnouncement, editAnnouncement, deleteAnnouncement, updateComplaintStatus, updateMaintenanceRequestStatus, cancelFacilityBooking, updateFacilityBookingStatus, markExitTime, assignParkingSlot, unassignParkingSlot, getAllApartments, addNewApartment, updateApartment, deleteApartment, registerVisitor } from '../controllers/apiController';
import { login } from '../controllers/authController';

const router = Router();

router.post('/login',login);
router.post('/complaints', createComplaint);
router.get('/complaints', getComplaints);
router.put('/complaints/:id',updateComplaintStatus);
router.post('/maintenance-requests', createMaintenanceRequest);
router.get('/maintenance-requests', getMaintenanceRequests);
router.put('/maintenance-requests/:id', updateMaintenanceRequestStatus);
router.get('/events', getEvents);
router.post('/events', createEvent);
router.post('/events/:id/register', registerForEvent);
router.delete('/events/:id', cancelEventRegistration);
router.get('/facilities', getFacilities);
router.post('/facilities/:id/book', bookFacility);
router.put('/facilities/:id/cancel',cancelFacilityBooking);
router.put('/facilities/:id/updateStatus',updateFacilityBookingStatus);
router.get('/visitors', getVisitors);
router.post('/visitor',registerVisitor);
router.put('/visitors/:id/approve' , approveVisitor);
router.put('/visitors/:id' , markExitTime);
router.get("/announcements" , getAnnouncements);
router.post("/create-announcement" , createAnnouncement);
router.put("/edit-announcement",editAnnouncement);
router.delete("delete-announcement",deleteAnnouncement);
router.get('/parking-slots', getParkingSlots);
router.post('/parking-slots/assign' , assignParkingSlot);
router.post('/parking-slots/unassign' , unassignParkingSlot);
router.get('/apartments' , getAllApartments);
router.post('/apartments',addNewApartment);
router.put('/apartments/:id' , updateApartment);
router.delete('/apartments/:id' , deleteApartment);


export default router;
