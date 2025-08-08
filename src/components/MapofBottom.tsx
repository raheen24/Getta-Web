"use client";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "140px",
  borderRadius: '10px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const markers = [
  { id: 1, lat: 40.7128, lng: -74.006, icon: "/images/marker-vector.png", name: "Yummy Pizza", phone: "123-456-7890", email: "business1@example.com" },
  { id: 2, lat: 34.0522, lng: -118.2437, icon: "/images/marker-vector.png", name: "Yummy Pizza", phone: "234-567-8901", email: "business2@example.com" },
  { id: 3, lat: 41.8781, lng: -87.6298, icon: "/images/marker-vector.png", name: "Yummy Pizza", phone: "345-678-9012", email: "business3@example.com" },
  { id: 4, lat: 29.7604, lng: -95.3698, icon: "/images/marker-vector.png", name: "Yummy Pizza", phone: "456-789-0123", email: "business4@example.com" },
  { id: 5, lat: 37.8080, lng: -122.4177, icon: "/images/marker-vector.png", name: "Yummy Pizza", phone: "456-789-0123", email: "business5@example.com" },

];

const MapofBottomProf = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  // const [selectedMarker, setSelectedMarker] = useState<any>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,    
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div className="relative">
      {/* <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button className="p-4 bg-blue-600 text-white rounded-full shadow hover:bg-gray-700 transition" onClick={handlePushToListPage}>
          <Image src="/images/list-vector.png" width={25} height={50} alt="list Icon" />
        </button>
        <button className="p-4 bg-blue-600 text-white rounded-full shadow hover:bg-gray-700 transition">
          <Image src="/images/pointer-vector.png" width={25} height={50} alt="list Icon" />
        </button>
      </div> */}

      <LoadScript googleMapsApiKey="AIzaSyBmaS0B0qwokES4a_CiFNVkVJGkimXkNsk" onLoad={() => setIsLoaded(true)}>
        {isLoaded && (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={
                  window.google
                    ? {
                        url: marker.icon,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }
                    : undefined
                }
                // onClick={() => setSelectedMarker(marker)}
              />
            ))}
            {currentLocation && (
              <Marker
                position={currentLocation}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>

    </div>
  );
};

export default MapofBottomProf;
