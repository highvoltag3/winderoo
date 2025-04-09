const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock state
let state = {
    batteryLevel: 100,
    db: 0,
    status: "idle",
    rotationsPerDay: "650",
    direction: "clockwise",
    hour: "00",
    minutes: "00",
    startTimeEpoch: Date.now() / 1000,
    currentTimeEpoch: Date.now() / 1000,
    estimatedRoutineFinishEpoch: (Date.now() / 1000) + 3600,
    winderEnabled: 1,
    timerEnabled: 0,
    screenSleep: false,
    screenScheduleEnabled: false,
    screenScheduleStartTime: "00:00",
    screenScheduleEndTime: "00:00",
    screenEquipped: true,
    customWindDuration: 0,
    customWindPauseDuration: 0,
    customDurationInSecondsToCompleteOneRevolution: 8,
    gmtOffset: 0,
    apiVersion: "2.0.0",
    dst: false
};

// GET /api/status
app.get('/api/status', (req, res) => {
    state.currentTimeEpoch = Date.now() / 1000;
    res.json(state);
});

// POST /api/update
app.post('/api/update', (req, res) => {
    const update = req.body;
    
    if (update.action === 'update') {
        // Update state based on the request
        if (update.rotationDirection) state.direction = update.rotationDirection;
        if (update.tpd) state.rotationsPerDay = update.tpd.toString();
        if (update.hour) state.hour = update.hour;
        if (update.minutes) state.minutes = update.minutes;
        if (update.timerEnabled !== undefined) state.timerEnabled = update.timerEnabled;
        if (update.screenSleep !== undefined) state.screenSleep = update.screenSleep;
        if (update.screenScheduleEnabled !== undefined) state.screenScheduleEnabled = update.screenScheduleEnabled;
        if (update.screenScheduleStartTime) state.screenScheduleStartTime = update.screenScheduleStartTime;
        if (update.screenScheduleEndTime) state.screenScheduleEndTime = update.screenScheduleEndTime;
        if (update.customWindDuration) state.customWindDuration = update.customWindDuration;
        if (update.customWindPauseDuration) state.customWindPauseDuration = update.customWindPauseDuration;
        if (update.customDurationInSecondsToCompleteOneRevolution) {
            state.customDurationInSecondsToCompleteOneRevolution = update.customDurationInSecondsToCompleteOneRevolution;
        }
        if (update.rtcGmtOffset) state.gmtOffset = update.rtcGmtOffset;
        if (update.rtcDST !== undefined) state.dst = update.rtcDST;
        
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid action' });
    }
});

// GET /api/time
app.get('/api/time', (req, res) => {
    res.json({
        utc_offset: "+00:00",
        timezone: "UTC",
        day_of_week: new Date().getDay(),
        day_of_year: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000),
        datetime: new Date().toISOString()
    });
});

// Start server
app.listen(port, () => {
    console.log(`Mock backend server running at http://localhost:${port}`);
}); 