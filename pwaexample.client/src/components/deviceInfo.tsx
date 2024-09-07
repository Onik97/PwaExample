import { useState, useEffect } from "react";

export default function DeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    platform: "",
    browser: "",
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      let platform = "Unknown";
      let browser = "Unknown";

      // Detect platform using the userAgent string
      if (/android/.test(userAgent)) {
        platform = "Android";
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        platform = "iOS";
      } else if (/win/.test(userAgent)) {
        platform = "Windows";
      } else if (/mac/.test(userAgent)) {
        platform = "MacOS";
      } else if (/linux/.test(userAgent)) {
        platform = "Linux";
      }

      // Detect browser using the userAgent string
      if (/chrome|crios|crmo/.test(userAgent)) {
        browser = "Chrome";
      } else if (/firefox|fxios/.test(userAgent)) {
        browser = "Firefox";
      } else if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
        browser = "Safari";
      } else if (/msie|trident/.test(userAgent)) {
        browser = "Internet Explorer";
      } else if (/edg/.test(userAgent)) {
        browser = "Edge";
      }

      setDeviceInfo({
        userAgent: navigator.userAgent,
        platform,
        browser,
      });
    };

    detectDevice();
  }, []);

  return (
    <div>
      <h2>Device Information</h2>
      <p>
        <strong>User Agent:</strong> {deviceInfo.userAgent}
      </p>
      <p>
        <strong>Platform:</strong> {deviceInfo.platform}
      </p>
      <p>
        <strong>Browser:</strong> {deviceInfo.browser}
      </p>
    </div>
  );
}
