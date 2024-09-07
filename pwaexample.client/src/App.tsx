import DeviceInfo from "./components/deviceInfo";
import ErrorDisplay from "./components/errorDisplay";
import Loading from "./components/loading";
import { Button } from "./components/ui/button";
import { useHelloWorld } from "./hooks/helloworldHooks";
import { useState, useEffect, useRef } from "react";

// Extend TypeScript types for navigator
interface NavigatorExtended extends Navigator {
  connection?: NetworkInformation;
  getBattery?: () => Promise<BatteryManager>;
  bluetooth?: {
    requestDevice: (
      options: BluetoothRequestDeviceOptions
    ) => Promise<BluetoothDevice>;
  };
}

// Network Information API interface
interface NetworkInformation {
  downlink: number;
  effectiveType: string;
  rtt: number;
  saveData: boolean;
  onchange?: (() => void) | undefined; // Event handler for network change
}

// Battery Manager API interface
interface BatteryManager {
  level: number;
  charging: boolean;
  onlevelchange: (() => void) | null;
  onchargingchange: (() => void) | null;
}

// Bluetooth Device interface
interface BluetoothDevice {
  id: string;
  name?: string;
}

// Bluetooth Request Options interface
interface BluetoothRequestDeviceOptions {
  filters?: Array<{
    services?: string[];
    name?: string;
    namePrefix?: string;
  }>;
}

const navigatorExtended = navigator as NavigatorExtended;

export default function App() {
  const [trigger, setTrigger] = useState(false);
  const { data, error, isLoading } = useHelloWorld(trigger);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [battery, setBattery] = useState<BatteryManager | null>(null); // Explicitly typing battery
  const [networkInfo, setNetworkInfo] = useState<NetworkInformation | null>(
    navigatorExtended.connection || null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleClick = () => {
    setTrigger(true);
  };

  const handleNotificationClick = () => {
    if (Notification.permission === "granted") {
      new Notification("Hello! This is your notification after 5 seconds!");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setTimeout(() => {
            new Notification(
              "Hello! This is your notification after 5 seconds!"
            );
          });
        }
      });
    } else {
      alert("Notification has been denied");
    }
  };

  // Geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to retrieve your location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Vibration
  const handleVibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]); // Vibrate for 200ms, pause 100ms, vibrate again 200ms
    } else {
      alert("Vibration is not supported by your device.");
    }
  };

  // Battery Status
  useEffect(() => {
    if (navigatorExtended.getBattery) {
      navigatorExtended.getBattery().then((batteryData) => {
        setBattery(batteryData);
        batteryData.onlevelchange = () => setBattery(batteryData);
        batteryData.onchargingchange = () => setBattery(batteryData);
      });
    } else {
      console.log("Battery API is not supported by your browser.");
    }
  }, []);

  // Network Info
  useEffect(() => {
    const updateNetworkInfo = () => {
      setNetworkInfo(navigatorExtended.connection || null);
    };

    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    if (navigatorExtended.connection) {
      navigatorExtended.connection.onchange = updateNetworkInfo;
    }

    return () => {
      if (navigatorExtended.connection) {
        navigatorExtended.connection.onchange = undefined; // Set to undefined instead of null
      }
    };
  }, []);

  // Bluetooth
  const handleBluetooth = async () => {
    if (!navigatorExtended.bluetooth) {
      alert("Bluetooth is not supported by your browser.");
      return;
    }

    try {
      const device = await navigatorExtended.bluetooth.requestDevice({
        filters: [{ services: ["battery_service"] }],
      });
      console.log("Bluetooth Device: ", device);
    } catch (error) {
      console.error("Bluetooth error: ", error);
      alert("Bluetooth connection failed. Please try again.");
    }
  };

  // Voice Recording - Press to start/stop recording
  const handleRecordToggle = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support audio recording.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          setAudioUrl(URL.createObjectURL(audioBlob));
          audioChunks.current = []; // Clear the chunks for future recordings
        };

        mediaRecorder.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Recording error: ", error);
        alert("Recording failed. Please check your microphone permissions.");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <Button onClick={handleClick}>Click me</Button>
        <Button onClick={handleNotificationClick}>Send Notification</Button>
        <Button onClick={handleGetLocation}>Get Location</Button>
        <Button onClick={handleVibrate}>Vibrate</Button>
        <Button onClick={handleBluetooth}>Connect Bluetooth</Button>
        <Button onClick={handleRecordToggle}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <hr />
        {isLoading && <Loading />}
        {error && <ErrorDisplay error={error} />}
        {data && <>{data.message}</>}

        <p style={{ color: isOnline ? "green" : "red" }}>
          {isOnline ? "Device is online" : "Device is offline"}
        </p>

        {location && (
          <p>
            Location: Latitude {location.coords.latitude}, Longitude{" "}
            {location.coords.longitude}
          </p>
        )}

        {battery && (
          <p>
            Battery: {Math.round(battery.level * 100)}% -{" "}
            {battery.charging ? "Charging" : "Not Charging"}
          </p>
        )}

        {networkInfo && (
          <p>Network Type: {networkInfo.effectiveType || "Unknown"}</p>
        )}

        {audioUrl && (
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        )}

        <DeviceInfo />
      </div>
    </>
  );
}
