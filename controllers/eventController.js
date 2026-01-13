// controllers/eventController.js
const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        const { title, date, venue, capacity } = req.body;
        
        const newEvent = new Event({
            title,
            date,
            venue,
            capacity,
            organizer: req.user.id 
        });

        await newEvent.save();
        res.status(201).json({ message: "Event Created Successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 2. Book an Event (User Logic)
exports.bookEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Logic Check: Date in past?
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({ message: "Cannot book past events" });
        }

        // Logic Check: Capacity full?
        if (event.attendees.length >= event.capacity) {
            return res.status(400).json({ message: "Event is fully booked" });
        }

        // Logic Check: Already booked?
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already booked this event" });
        }

        event.attendees.push(req.user.id);
        await event.save();
        res.status(200).json({ message: "Booking successful", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Get Upcoming Events (Date Filtering)
exports.getUpcomingEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gt: new Date() } }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};