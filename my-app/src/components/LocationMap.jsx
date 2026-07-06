import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationMarker({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect(e);
        },
    });
    return null;
}

export default function LocationMap({ position, setPosition, setFormData }) {

    const handleClick =async (e) => {
        const { lat, lng } = e.latlng;

        setPosition({ lat, lng });

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        setFormData((prev) => ({
            ...prev,
            location: data.display_name || ""
        }));

    } catch (err) {
        console.error("Failed to get address", err);
    }
};

    return (
        <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <LocationMarker onSelect={handleClick} />

            <Marker position={[position.lat, position.lng]} />
        </MapContainer>
    );
}