// ============================================================
// CUSTOMER DASHBOARD – FINAL STABLE (NO DRAG, NO BREAKAGE)
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import LocationSearch from '../components/LocationSearch';

const CAB_COLORS = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
    '#FFD733', '#33FFF5', '#F53333', '#33FFB5', '#F5A133'
];
const CAB_ICONS = ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐'];

const CAB_DATA = [
    { id:1, model:'Toyota Etios', plate:'MH12AB1234', capacity:4, mileage:18, speed:60, baseFare:50, color: CAB_COLORS[0], icon: CAB_ICONS[0] },
    { id:2, model:'Hyundai i20', plate:'MH14XY5678', capacity:4, mileage:20, speed:65, baseFare:55, color: CAB_COLORS[1], icon: CAB_ICONS[1] },
    { id:3, model:'Kia Sonet', plate:'MH20U1234', capacity:5, mileage:22, speed:70, baseFare:60, color: CAB_COLORS[2], icon: CAB_ICONS[2] },
    { id:4, model:'Mahindra XUV300', plate:'MH01EF3456', capacity:5, mileage:19, speed:62, baseFare:65, color: CAB_COLORS[3], icon: CAB_ICONS[3] },
    { id:5, model:'Tata Tigor', plate:'MH48GH7890', capacity:4, mileage:21, speed:68, baseFare:52, color: CAB_COLORS[4], icon: CAB_ICONS[4] },
    { id:6, model:'Honda City', plate:'MH15KL5678', capacity:4, mileage:23, speed:75, baseFare:58, color: CAB_COLORS[5], icon: CAB_ICONS[5] },
    { id:7, model:'Hyundai Creta', plate:'MH04MN9012', capacity:5, mileage:20, speed:66, baseFare:62, color: CAB_COLORS[6], icon: CAB_ICONS[6] },
    { id:8, model:'Maruti Suzuki Brezza', plate:'MH12OP1111', capacity:5, mileage:24, speed:72, baseFare:57, color: CAB_COLORS[7], icon: CAB_ICONS[7] },
    { id:9, model:'Toyota Innova', plate:'MH14QR2222', capacity:7, mileage:16, speed:55, baseFare:75, color: CAB_COLORS[8], icon: CAB_ICONS[8] },
    { id:10, model:'Maruti Suzuki Dzire', plate:'MH03CD9012', capacity:4, mileage:22, speed:70, baseFare:53, color: CAB_COLORS[9], icon: CAB_ICONS[9] },
];

function TextMarker({ position, text, bgColor = '#3b82f6' }) {
    const icon = L.divIcon({
        className: 'bg-transparent',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
                <div style="background:${bgColor};color:white;font-weight:bold;padding:2px 10px;border-radius:12px;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.3);white-space:nowrap;border:1px solid white;">
                    ${text}
                </div>
                <div style="width:14px;height:14px;background:${bgColor};border-radius:50%;border:2px solid white;margin-top:-6px;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
            </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
    return <Marker position={position} icon={icon} />;
}

function CompassControl({ bearing }) {
    const map = useMap();
    const controlRef = useRef(null);
    useEffect(() => {
        if (!controlRef.current) {
            const control = L.control({ position: 'bottomleft' });
            control.onAdd = function() {
                const div = L.DomUtil.create('div', 'compass-control');
                div.style.backgroundColor = 'rgba(255,255,255,0.92)';
                div.style.padding = '6px';
                div.style.borderRadius = '50%';
                div.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
                div.style.width = '52px';
                div.style.height = '52px';
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.justifyContent = 'center';
                div.style.fontSize = '13px';
                div.style.fontWeight = 'bold';
                div.style.color = '#1e293b';
                div.style.border = '2px solid #3b82f6';
                div.style.transition = 'transform 0.1s';
                div.id = 'compass-element';
                updateCompass(div, 0);
                return div;
            };
            control.addTo(map);
            controlRef.current = control;
        }
        const el = document.getElementById('compass-element');
        if (el) updateCompass(el, bearing);
        return () => {
            if (controlRef.current) {
                map.removeControl(controlRef.current);
                controlRef.current = null;
            }
        };
    }, [map, bearing]);

    const updateCompass = (el, b) => {
        if (!el) return;
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const idx = Math.round(b / 45) % 8;
        const label = dirs[idx];
        el.innerHTML = `<span style="transform:rotate(${b}deg);display:inline-block;font-size:18px;">🧭</span><br><span style="font-size:10px;">${label}</span>`;
        el.style.transform = `rotate(${-b}deg)`;
    };
    return null;
}

const getOffsetPosition = (pos, bearing, meters) => {
    const rad = bearing * Math.PI / 180;
    const latOffset = (meters / 111320) * Math.cos(rad);
    const lngOffset = (meters / (111320 * Math.cos(pos[0] * Math.PI / 180))) * Math.sin(rad);
    return [pos[0] + latOffset, pos[1] + lngOffset];
};

function ChangeMapView({ center }) {
    const map = useMap();
    if (center) map.setView(center);
    return null;
}

// ─── FIXED TABLES (Leaflet Controls, No Drag) ────────────────
function CustomerTable({ details, visible }) {
    const map = useMap();
    useEffect(() => {
        if (!visible || !details) {
            const existing = document.querySelector('.customer-table');
            if (existing) existing.remove();
            return;
        }
        const control = L.control({ position: 'topleft' });
        control.onAdd = function() {
            const div = L.DomUtil.create('div', 'customer-table');
            div.style.backgroundColor = 'rgba(255,255,255,0.95)';
            div.style.padding = '8px 12px';
            div.style.borderRadius = '10px';
            div.style.boxShadow = '0 4px 15px rgba(0,0,0,0.25)';
            div.style.border = '2px solid #2563eb';
            div.style.fontSize = '12px';
            div.style.maxWidth = '220px';
            div.innerHTML = `
                <div style="font-weight:bold;font-size:14px;color:#2563eb;margin-bottom:4px;">👤 Customer</div>
                <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #000;">
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">ID</td><td style="border:1px solid #000;padding:2px 6px;">${details.customerId || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Username</td><td style="border:1px solid #000;padding:2px 6px;">${details.username || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Email</td><td style="border:1px solid #000;padding:2px 6px;">${details.email || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Name</td><td style="border:1px solid #000;padding:2px 6px;">${details.fullName || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Pickup</td><td style="border:1px solid #000;padding:2px 6px;">${details.pickup || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Dropoff</td><td style="border:1px solid #000;padding:2px 6px;">${details.dropoff || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Vehicle</td><td style="border:1px solid #000;padding:2px 6px;">${details.vehicle || 'N/A'}</td></tr>
                </table>
            `;
            return div;
        };
        control.addTo(map);
        return () => {
            const existing = document.querySelector('.customer-table');
            if (existing) existing.remove();
        };
    }, [map, details, visible]);
    return null;
}

function DriverTable({ details, visible }) {
    const map = useMap();
    useEffect(() => {
        if (!visible || !details) {
            const existing = document.querySelector('.driver-table');
            if (existing) existing.remove();
            return;
        }
        const control = L.control({ position: 'topright' });
        control.onAdd = function() {
            const div = L.DomUtil.create('div', 'driver-table');
            div.style.backgroundColor = 'rgba(255,255,255,0.95)';
            div.style.padding = '8px 12px';
            div.style.borderRadius = '10px';
            div.style.boxShadow = '0 4px 15px rgba(0,0,0,0.25)';
            div.style.border = '2px solid #16a34a';
            div.style.fontSize = '12px';
            div.style.maxWidth = '220px';
            div.innerHTML = `
                <div style="font-weight:bold;font-size:14px;color:#16a34a;margin-bottom:4px;">🚗 Driver</div>
                <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #000;">
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">ID</td><td style="border:1px solid #000;padding:2px 6px;">${details.driverId || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Username</td><td style="border:1px solid #000;padding:2px 6px;">${details.username || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Email</td><td style="border:1px solid #000;padding:2px 6px;">${details.email || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Name</td><td style="border:1px solid #000;padding:2px 6px;">${details.fullName || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Vehicle</td><td style="border:1px solid #000;padding:2px 6px;">${details.cabModel || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Plate</td><td style="border:1px solid #000;padding:2px 6px;">${details.cabPlate || 'N/A'}</td></tr>
                    <tr><td style="border:1px solid #000;padding:2px 6px;font-weight:600;">Start</td><td style="border:1px solid #000;padding:2px 6px;">${details.startLocation || 'N/A'}</td></tr>
                </table>
            `;
            return div;
        };
        control.addTo(map);
        return () => {
            const existing = document.querySelector('.driver-table');
            if (existing) existing.remove();
        };
    }, [map, details, visible]);
    return null;
}

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function CustomerDashboard() {
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Guest';
    const userFullName = localStorage.getItem('fullName') || 'Rajesh Patil';
    const userEmail = localStorage.getItem('email') || 'rajesh@mail.com';
    const userId = localStorage.getItem('userId') || '1';

    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [position, setPosition] = useState(null);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [driverPos, setDriverPos] = useState(null);
    const [driverStartPos, setDriverStartPos] = useState(null);
    const [isRideBooked, setIsRideBooked] = useState(false);
    const [driverAccepted, setDriverAccepted] = useState(false);
    const stompClientRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const driverMoveIntervalRef = useRef(null);

    const [phase, setPhase] = useState('IDLE');
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeDistance, setRouteDistance] = useState(0);
    const [etaSeconds, setEtaSeconds] = useState(0);
    const [driverDetails, setDriverDetails] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [isDriverAtPickup, setIsDriverAtPickup] = useState(false);
    const [isAtDestination, setIsAtDestination] = useState(false);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [cabBearing, setCabBearing] = useState(0);
    const [driverStartLocationName, setDriverStartLocationName] = useState('');

    const pickupRef = useRef('');
    const dropoffRef = useRef('');
    const selectedCabRef = useRef(null);

    const [availableCabs, setAvailableCabs] = useState([]);
    const [selectedCab, setSelectedCab] = useState(null);
    const [showCabsList, setShowCabsList] = useState(false);
    const [searchingCabs, setSearchingCabs] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CASH');
    const [processingPayment, setProcessingPayment] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptData, setReceiptData] = useState({});
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const [showHistory, setShowHistory] = useState(false);
    const [customerBookings, setCustomerBookings] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setLocationLoaded(true);
                },
                () => {
                    toast.error('Could not get your location. Using default.');
                    setLocationLoaded(true);
                }
            );
        } else {
            setLocationLoaded(true);
        }
    }, []);

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const geocodeAddress = async (address) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
            const data = await res.json();
            if (!data.length) return null;
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } catch {
            return null;
        }
    };

    const fetchRoute = async (fromLat, fromLng, toLat, toLng) => {
        try {
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&overview=full`
            );
            const data = await res.json();
            if (!data.routes || !data.routes.length) {
                const coords = [];
                const steps = 30;
                for (let i = 0; i <= steps; i++) {
                    const frac = i / steps;
                    coords.push([fromLat + (toLat - fromLat) * frac, fromLng + (toLng - fromLng) * frac]);
                }
                const distance = getDistanceFromLatLonInKm(fromLat, fromLng, toLat, toLng);
                const duration = Math.max(1, distance * 4);
                return { coords, distance, duration };
            }
            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            const distance = data.routes[0].distance / 1000;
            const duration = Math.max(1, distance * 4);
            return { coords, distance, duration };
        } catch {
            const coords = [];
            const steps = 30;
            for (let i = 0; i <= steps; i++) {
                const frac = i / steps;
                coords.push([fromLat + (toLat - fromLat) * frac, fromLng + (toLng - fromLng) * frac]);
            }
            const distance = getDistanceFromLatLonInKm(fromLat, fromLng, toLat, toLng);
            const duration = Math.max(1, distance * 4);
            return { coords, distance, duration };
        }
    };

    const startTimer = (initialSeconds) => {
        setEtaSeconds(initialSeconds);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
            setEtaSeconds(prev => {
                if (prev <= 1) { clearInterval(timerIntervalRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const resetState = () => {
        setIsRideBooked(false);
        setDriverAccepted(false);
        setDriverPos(null);
        setDriverStartPos(null);
        setRouteCoordinates([]);
        setRouteDistance(0);
        setEtaSeconds(0);
        setPhase('IDLE');
        setIsDriverAtPickup(false);
        setIsAtDestination(false);
        setDriverDetails(null);
        setCustomerDetails(null);
        setCurrentBookingId(null);
        setPaymentAmount(0);
        setCabBearing(0);
        setPickupCoords(null);
        setDropoffCoords(null);
        setDriverStartLocationName('');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (driverMoveIntervalRef.current) clearInterval(driverMoveIntervalRef.current);
    };

    const simulateDriverMovementAlongRoute = (routeCoords, callback) => {
        if (!routeCoords || routeCoords.length < 2) { callback(); return; }
        let step = 0;
        const totalSteps = routeCoords.length - 1;
        if (driverMoveIntervalRef.current) clearInterval(driverMoveIntervalRef.current);
        const distance = getDistanceFromLatLonInKm(
            routeCoords[0][0], routeCoords[0][1],
            routeCoords[totalSteps][0], routeCoords[totalSteps][1]
        );
        const totalDuration = Math.max(1, distance * 4);
        const intervalMs = Math.max((totalDuration / totalSteps) * 1000, 100);

        driverMoveIntervalRef.current = setInterval(() => {
            step++;
            if (step >= totalSteps) {
                clearInterval(driverMoveIntervalRef.current);
                setDriverPos(routeCoords[totalSteps]);
                if (totalSteps >= 2) {
                    const p1 = routeCoords[totalSteps - 1];
                    const p2 = routeCoords[totalSteps];
                    const bearing = getBearing(p1[0], p1[1], p2[0], p2[1]);
                    setCabBearing(bearing);
                }
                callback();
                return;
            }
            const pos = routeCoords[step];
            setDriverPos(pos);
            if (step < totalSteps) {
                const p1 = routeCoords[step];
                const p2 = routeCoords[step + 1];
                const bearing = getBearing(p1[0], p1[1], p2[0], p2[1]);
                setCabBearing(bearing);
            }
        }, intervalMs);
    };

    const getBearing = (lat1, lon1, lat2, lon2) => {
        const dLon = lon2 - lon1;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        let brng = Math.atan2(y, x);
        brng = brng * 180 / Math.PI;
        return (brng + 360) % 360;
    };

    // ─── WebSocket ──────────────────────────────────────────────────
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('✅ Customer WebSocket connected');

                client.subscribe('/topic/booking', async (message) => {
                    const update = JSON.parse(message.body);
                    console.log('📡 Booking update:', update);

                    if (update.status === 'ACCEPTED') {
                        setDriverAccepted(true);
                        setCurrentBookingId(update.bookingId);

                        const driverData = update.driver;
                        if (driverData) {
                            setDriverDetails({
                                driverId: update.driverId || 'N/A',
                                username: driverData.username || 'N/A',
                                email: driverData.email || 'N/A',
                                fullName: driverData.fullName || 'Unknown Driver',
                                cabModel: driverData.cabModel || 'N/A',
                                cabPlate: driverData.cabPlate || 'N/A',
                                startLocation: driverStartLocationName || 'Driver location',
                            });
                            toast.success(`✅ Driver ${driverData.fullName || 'Unknown'} has accepted your booking!`);
                            toast.success(`📞 ${driverData.phone || 'N/A'} | 🚗 ${driverData.cabModel || 'N/A'}`);
                        } else {
                            toast.success('✅ Driver has accepted your booking!');
                        }

                        const cab = selectedCabRef.current;
                        setCustomerDetails({
                            customerId: userId,
                            username: username,
                            email: userEmail,
                            fullName: userFullName,
                            pickup: pickupRef.current || 'N/A',
                            dropoff: dropoffRef.current || 'N/A',
                            vehicle: cab ? `${cab.model} (${cab.plate})` : 'N/A',
                        });

                        setPhase('DRIVER_TO_PICKUP');

                        const angle = Math.random() * 2 * Math.PI;
                        const radius = 5 + Math.random() * 5;
                        const latOff = (radius / 111) * Math.cos(angle);
                        const lngOff = (radius / (111 * Math.cos(pickupCoords.lat * Math.PI / 180))) * Math.sin(angle);
                        const startPos = { lat: pickupCoords.lat + latOff, lng: pickupCoords.lng + lngOff };
                        setDriverStartPos([startPos.lat, startPos.lng]);
                        setDriverPos([startPos.lat, startPos.lng]);

                        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${startPos.lat}&lon=${startPos.lng}&format=json`)
                            .then(res => res.json())
                            .then(data => {
                                const name = data.display_name || 'Driver Start';
                                setDriverStartLocationName(name);
                                setDriverDetails(prev => ({ ...prev, startLocation: name }));
                            })
                            .catch(() => setDriverStartLocationName('Driver Start'));

                        fetchRoute(startPos.lat, startPos.lng, pickupCoords.lat, pickupCoords.lng)
                            .then(route => {
                                if (route) {
                                    setRouteCoordinates(route.coords);
                                    setRouteDistance(route.distance);
                                    startTimer(Math.round(route.duration));
                                    simulateDriverMovementAlongRoute(route.coords, () => {
                                        setIsDriverAtPickup(true);
                                        setPhase('PICKUP_REACHED');
                                        setRouteCoordinates([]);
                                        setEtaSeconds(0);
                                        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                                        toast.success('🚗 Driver has arrived at your pickup location!');
                                        setTimeout(() => {
                                            setPhase('TRIP_IN_PROGRESS');
                                            setIsDriverAtPickup(false);
                                            toast.success('🚗 Trip started!');
                                            fetchRoute(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng)
                                                .then(route2 => {
                                                    if (route2) {
                                                        setRouteCoordinates(route2.coords);
                                                        setRouteDistance(route2.distance);
                                                        startTimer(Math.round(route2.duration));
                                                        simulateDriverMovementAlongRoute(route2.coords, () => {
                                                            setPhase('DESTINATION_REACHED');
                                                            setIsAtDestination(true);
                                                            setRouteCoordinates([]);
                                                            setEtaSeconds(0);
                                                            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                                                            // Fare calculation
                                                            if (selectedCabRef.current) {
                                                                const cab = selectedCabRef.current;
                                                                const baseFare = cab.baseFare || 50;
                                                                const perKmRate = 12;
                                                                const seatFactor = cab.capacity / 4;
                                                                const mileageFactor = 20 / (cab.mileage || 20);
                                                                const speedFactor = 60 / (cab.speed || 60);
                                                                const dist = route2.distance || 5.0;
                                                                const calculatedFare = baseFare + (perKmRate * dist) * seatFactor * mileageFactor * speedFactor;
                                                                setPaymentAmount(Math.round(calculatedFare * 100) / 100);
                                                            } else {
                                                                const baseFare = 50;
                                                                const perKmRate = 12;
                                                                const dist = route2.distance || 5.0;
                                                                setPaymentAmount(Math.round((baseFare + perKmRate * dist) * 100) / 100);
                                                            }
                                                            toast.success(`✅ Trip completed! Total fare: ₹${paymentAmount.toFixed(2)}`);
                                                            setShowPaymentModal(true);
                                                        });
                                                    }
                                                });
                                        }, 2000);
                                    });
                                }
                            });
                    } else if (update.status === 'REJECTED') {
                        toast.error('❌ Driver rejected your ride. Please try again.');
                        resetState();
                    } else if (update.status === 'COMPLETED') {
                        toast.success('✅ Trip completed!');
                    }
                });

                stompClientRef.current = client;
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
            },
        });

        client.activate();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (driverMoveIntervalRef.current) clearInterval(driverMoveIntervalRef.current);
        };
    }, [pickupCoords, dropoffCoords]);

    const searchAvailableCabs = async () => {
        setSearchingCabs(true);
        setShowCabsList(true);
        setSelectedCab(null);
        try {
            const res = await api.get('/cabs/available');
            const cabs = res.data.map((cab, index) => {
                const cabInfo = CAB_DATA.find(c => c.id === cab.cabId) || CAB_DATA[index % CAB_DATA.length];
                return {
                    ...cab,
                    color: cabInfo.color || '#FF5733',
                    icon: cabInfo.icon || '🚗',
                    mileage: cabInfo.mileage || 20,
                    speed: cabInfo.speed || 60,
                    baseFare: cabInfo.baseFare || 50,
                    capacity: cab.capacity || cabInfo.capacity || 4,
                };
            });
            setAvailableCabs(cabs);
            if (!cabs.length) toast('No cabs available.');
            else toast.success(`Found ${cabs.length} cabs!`);
        } catch {
            const mockCabs = CAB_DATA.map((c, index) => ({
                cabId: c.id,
                model: c.model,
                plateNumber: c.plate,
                capacity: c.capacity,
                mileage: c.mileage,
                speed: c.speed,
                baseFare: c.baseFare,
                color: c.color,
                icon: c.icon,
            }));
            setAvailableCabs(mockCabs);
            toast.success('Found 10 cabs!');
        } finally {
            setSearchingCabs(false);
        }
    };

    const selectCab = (cab) => {
        setSelectedCab(cab);
        setShowCabsList(false);
        toast.success(`Selected: ${cab.model} (${cab.plateNumber})`);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedCab) {
            toast.error('Please select a cab first.');
            return;
        }
        if (!pickup || !dropoff) {
            toast.error('Please enter both pickup and dropoff locations.');
            return;
        }
        pickupRef.current = pickup;
        dropoffRef.current = dropoff;
        selectedCabRef.current = selectedCab;

        setDriverAccepted(false);
        const p = await geocodeAddress(pickup);
        const d = await geocodeAddress(dropoff);
        if (p) setPickupCoords(p);
        if (d) setDropoffCoords(d);
        try {
            const pickupTime = new Date(Date.now() + 30 * 60000).toISOString();
            await api.post('/bookings', {
                pickupLocation: pickup,
                dropoffLocation: dropoff,
                pickupTime: pickupTime,
            });
            toast.success('🚖 Ride booked! Waiting for a driver...');
            setIsRideBooked(true);
        } catch {
            toast.success('🚖 Ride booked! Waiting for a driver...');
            setIsRideBooked(true);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!currentBookingId) return;
        setProcessingPayment(true);
        setTimeout(() => {
            toast.success(`✅ Payment of ₹${paymentAmount.toFixed(2)} successful!`);
            setShowPaymentModal(false);
            const receipt = {
                bookingId: currentBookingId,
                amount: paymentAmount,
                method: selectedPaymentMethod,
                date: new Date().toLocaleString(),
                status: 'COMPLETED',
                distance: routeDistance,
                cabModel: selectedCabRef.current?.model || 'N/A',
                seats: selectedCabRef.current?.capacity || 4,
                mileage: selectedCabRef.current?.mileage || 20,
                speed: selectedCabRef.current?.speed || 60,
                baseFare: selectedCabRef.current?.baseFare || 50,
            };
            setReceiptData(receipt);
            setShowReceiptModal(true);
            setDriverDetails(null);
            setCustomerDetails(null);
            setProcessingPayment(false);
        }, 1000);
    };

    const handleFeedbackSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating.');
            return;
        }
        setSubmittingFeedback(true);
        setTimeout(() => {
            toast.success('⭐ Thank you for your feedback!');
            setShowFeedbackModal(false);
            setRating(0);
            setComment('');
            resetState();
            setSubmittingFeedback(false);
        }, 1000);
    };

    const fetchBookingHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await api.get('/bookings/customer');
            setCustomerBookings(res.data);
        } catch {
            setCustomerBookings([
                { bookingId: 1, pickupLocation: 'Shivaji Nagar, Pune', dropoffLocation: 'Baner, Pune', fare: 150, status: 'COMPLETED', bookingTime: new Date().toISOString() },
            ]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const toggleHistory = () => {
        if (!showHistory) fetchBookingHistory();
        setShowHistory(!showHistory);
    };

    const viewReceiptFromHistory = (booking) => {
        setReceiptData({
            bookingId: booking.bookingId,
            amount: booking.fare || 0,
            method: 'CASH',
            date: new Date(booking.bookingTime).toLocaleString(),
            status: booking.status,
            distance: 5.5,
        });
        setShowReceiptModal(true);
    };

    const handleLogout = () => {
        resetState();
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('phone');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        toast.success('Logged out successfully');
        window.location.href = '/';
    };

    const carIcon = selectedCab ? L.divIcon({
        className: 'bg-transparent',
        html: `<div style="font-size: 48px; color: ${selectedCab.color || '#FF5733'}; text-shadow: 0 0 10px rgba(0,0,0,0.3);">${selectedCab.icon || '🚗'}</div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
    }) : L.divIcon({
        className: 'bg-transparent',
        html: '<div class="text-5xl drop-shadow-lg">🚗</div>',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
    });

    const arrowIcon = (bearing) => L.divIcon({
        className: 'bg-transparent',
        html: `<div style="transform: rotate(${bearing}deg); font-size: 16px; color: #3b82f6; text-shadow: 0 0 8px rgba(59,130,246,0.5);">➤</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

    return (
        <div className="flex flex-col h-screen w-full relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000 pointer-events-none"></div>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] z-20 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-4 flex flex-wrap justify-between items-center gap-2 animate-slide-in">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">🚖</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Rental Taxi</h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-semibold hidden sm:block">{username}</span>
                    <button onClick={toggleHistory} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-medium transition">📋 My Rides</button>
                    <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-red-600 border border-red-200 px-4 py-2 rounded-lg transition">Logout</button>
                </div>
            </div>

            <div className="flex-1 z-0 h-screen w-full pt-20 relative">
                {locationLoaded ? (
                    position ? (
                        <MapContainer center={position} zoom={13} scrollWheelZoom={true} dragging={true} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='© OpenStreetMap, CARTO' />
                            {pickupCoords && (
                                <TextMarker position={[pickupCoords.lat, pickupCoords.lng]} text={pickup || 'Pickup'} bgColor="#3b82f6" />
                            )}
                            {dropoffCoords && (phase === 'TRIP_IN_PROGRESS' || phase === 'DESTINATION_REACHED') && (
                                <TextMarker position={[dropoffCoords.lat, dropoffCoords.lng]} text={dropoff || 'Dropoff'} bgColor="#ef4444" />
                            )}
                            {driverStartPos && phase === 'DRIVER_TO_PICKUP' && driverStartLocationName && (
                                <TextMarker position={driverStartPos} text={driverStartLocationName} bgColor="#eab308" />
                            )}
                            {driverAccepted && driverPos && (phase === 'DRIVER_TO_PICKUP' || phase === 'TRIP_IN_PROGRESS') && (
                                <Marker position={driverPos} icon={carIcon}><Popup>🚗 Driver</Popup></Marker>
                            )}
                            {driverAccepted && driverPos && (phase === 'DRIVER_TO_PICKUP' || phase === 'TRIP_IN_PROGRESS') && routeCoordinates.length > 1 && (
                                <Marker position={getOffsetPosition(driverPos, cabBearing, 30)} icon={arrowIcon(cabBearing)} />
                            )}
                            {driverAccepted && routeCoordinates.length > 1 && (phase === 'DRIVER_TO_PICKUP' || phase === 'TRIP_IN_PROGRESS') && (
                                <Polyline positions={routeCoordinates} pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.8 }} />
                            )}
                            <CompassControl bearing={cabBearing} />
                            <ChangeMapView center={position} />
                            
                            {/* ─── MOVED FIXED TABLES INSIDE MAPCONTAINER ─── */}
                            <CustomerTable details={customerDetails} visible={!!customerDetails && !showPaymentModal} />
                            <DriverTable details={driverDetails} visible={!!driverDetails && !showPaymentModal} />

                        </MapContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>📍 Waiting for your location…</p>
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>🔄 Loading map…</p>
                    </div>
                )}
            </div>

            {/* ─── BOTTOM CARD ────────────────────────────────────────────── */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 animate-fade-in-up max-h-[60vh] overflow-y-auto">
                {showHistory ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">📋 My Rides</h2>
                            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        {loadingHistory ? <p className="text-center">Loading...</p> : customerBookings.length === 0 ? <p className="text-center text-gray-500">🚫 No rides found.</p> : (
                            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                                {customerBookings.map(b => (
                                    <div key={b.bookingId} className="bg-white/90 border border-gray-200 p-3 rounded-xl shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-400">#{b.bookingId} • {new Date(b.bookingTime).toLocaleDateString()}</p>
                                                <p className="font-semibold text-sm">{b.pickupLocation} → {b.dropoffLocation}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-sm font-bold">₹ {b.fare || 0}</p>
                                            <button onClick={() => viewReceiptFromHistory(b)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full font-medium">🧾 Receipt</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {isRideBooked ? (
                            <div className="space-y-3 text-center">
                                <h2 className="text-xl font-bold text-green-600 flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                    {phase === 'DRIVER_TO_PICKUP' && 'Driver assigned!'}
                                    {phase === 'PICKUP_REACHED' && '🚗 Driver has arrived!'}
                                    {phase === 'TRIP_IN_PROGRESS' && '🔄 Trip in progress!'}
                                    {phase === 'DESTINATION_REACHED' && '✅ Trip completed!'}
                                </h2>
                                {etaSeconds > 0 && (phase === 'DRIVER_TO_PICKUP' || phase === 'TRIP_IN_PROGRESS') && (
                                    <div className="bg-blue-50 p-2 rounded-xl">
                                        <p className="text-sm font-bold text-blue-700">⏱️ ETA: {Math.floor(etaSeconds/60)}m {etaSeconds%60}s</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1"><div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (etaSeconds/600)*100)}%` }}></div></div>
                                    </div>
                                )}
                                {isDriverAtPickup && phase === 'PICKUP_REACHED' && <p className="text-sm font-bold text-green-600">✅ Driver is here! Starting trip shortly...</p>}
                                {isAtDestination && phase === 'DESTINATION_REACHED' && <p className="text-sm font-bold text-purple-600">✅ You have reached your destination!</p>}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                                    <span>Book a Cab</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ETA: ~5 min</span>
                                </h2>

                                {selectedCab && (
                                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold">SELECTED CAB</p>
                                            <p className="font-bold">{selectedCab.model}</p>
                                            <p className="text-xs text-gray-600">{selectedCab.plateNumber} • {selectedCab.capacity} seats</p>
                                        </div>
                                        <button onClick={() => { setSelectedCab(null); setShowCabsList(true); }} className="text-xs text-blue-600 hover:text-blue-800">Change</button>
                                    </div>
                                )}

                                <form onSubmit={handleBooking} className="space-y-3">
                                    <LocationSearch placeholder="Pickup Location" value={pickup} onChange={setPickup} />
                                    <LocationSearch placeholder="Drop-off" value={dropoff} onChange={setDropoff} />

                                    <button type="button" onClick={searchAvailableCabs} disabled={searchingCabs} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50">
                                        {searchingCabs ? '🔍 Searching...' : '🔍 Search Cabs'}
                                    </button>

                                    {showCabsList && (
                                        <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-2 bg-white/90">
                                            {availableCabs.length === 0 ? <p className="text-center text-gray-500 text-sm py-2">No cabs available.</p> : availableCabs.map(cab => (
                                                <div key={cab.cabId} className={`flex justify-between items-center p-2 rounded-lg border transition cursor-pointer hover:bg-blue-50 ${selectedCab?.cabId === cab.cabId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => { setSelectedCab(cab); setShowCabsList(false); toast.success(`Selected: ${cab.model} (${cab.plateNumber})`); }}>
                                                    <div>
                                                        <p className="font-semibold text-sm">{cab.model}</p>
                                                        <p className="text-xs text-gray-500">{cab.plateNumber} • {cab.capacity} seats</p>
                                                        <span style={{ fontSize: '20px', color: cab.color || '#000' }}>{cab.icon || '🚗'}</span>
                                                    </div>
                                                    <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">Select</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedCab ? (
                                        <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-xl">
                                            🚖 Request Ride
                                        </button>
                                    ) : (
                                        <button type="button" disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3.5 rounded-xl cursor-not-allowed">
                                            Search & Select a Cab first
                                        </button>
                                    )}
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─── MODALS ────────────────────────────────────────── */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-2">💳 Complete Payment</h2>
                        <p className="text-gray-600 text-sm mb-2">Booking ID: #{currentBookingId}</p>
                        <div className="mb-4 p-3 bg-gray-50 rounded-xl text-center">
                            <span className="text-3xl font-bold text-green-600">₹ {paymentAmount.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {['CASH','CARD','ONLINE'].map(m => (
                                <button key={m} onClick={() => setSelectedPaymentMethod(m)} className={`py-2 rounded-xl border-2 ${selectedPaymentMethod === m ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200'}`}>
                                    {m === 'CASH' ? '💵 Cash' : m === 'CARD' ? '💳 Card' : '📱 Online'}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handlePaymentSubmit} disabled={processingPayment} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                                {processingPayment ? 'Processing...' : '✅ Pay Now'}
                            </button>
                            <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showReceiptModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-green-200">
                        <div className="text-center mb-4"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-3xl">🧾</span></div><h2 className="text-2xl font-bold">Payment Receipt</h2></div>
                        <div className="space-y-2 border-t border-b border-gray-100 py-4 my-3">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Booking</span><span className="font-mono font-bold">#{receiptData.bookingId}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Distance</span><span className="font-semibold">{receiptData.distance?.toFixed(1) || 'N/A'} km</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Cab</span><span className="font-semibold">{receiptData.cabModel || 'N/A'}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Seats</span><span className="font-semibold">{receiptData.seats || 4}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Mileage</span><span className="font-semibold">{receiptData.mileage || 20} km/l</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Speed</span><span className="font-semibold">{receiptData.speed || 60} km/h</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Base Fare</span><span className="font-semibold">₹{receiptData.baseFare || 50}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-green-600">₹ {receiptData.amount?.toFixed(2) || '0.00'}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Method</span><span className="font-semibold">{receiptData.method}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="text-green-600 font-bold uppercase">{receiptData.status}</span></div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowReceiptModal(false); setShowFeedbackModal(true); }} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl">⭐ Rate</button>
                            <button onClick={() => { setShowReceiptModal(false); toast.success('Receipt closed.'); }} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-2">⭐ Rate Your Trip</h2>
                        <div className="flex justify-center gap-2 mb-4">
                            {[1,2,3,4,5].map(s => (
                                <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} className="text-4xl focus:outline-none">
                                    <span className={s <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                </button>
                            ))}
                        </div>
                        <textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl mb-4" rows="3" />
                        <div className="flex gap-3">
                            <button onClick={handleFeedbackSubmit} disabled={submittingFeedback || rating===0} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                                {submittingFeedback ? 'Submitting...' : '⭐ Submit'}
                            </button>
                            <button onClick={() => { setShowFeedbackModal(false); setRating(0); setComment(''); }} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">Skip</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}