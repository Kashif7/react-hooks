import React, { useState, useEffect } from "react";
import Battery from "./Battery";

const useBattery = () => {
  const [battery, setBattery] = useState({
    level: 0,
    charging: false
  });

  useEffect(() => {
    let battery;
    navigator.getBattery().then(bat => {
      battery = bat;

      battery.addEventListener("levelchange", handleChange);
      battery.addEventListener("chargingchange", handleChange);

      handleChange({ target: battery });
    });

    return () => {
      battery.removeEventListener("levelchange", handleChange);
      battery.removeEventListener("chargingchange", handleChange);
    };
  }, []);

  const handleChange = ({ target: { level, charging } }) => {
    setBattery({
      level,
      charging
    });
  };

  return battery;
};

export default function UseEffectPlayground() {
  const battery = useBattery();

  return (
    <section>
      <Battery {...battery} />
    </section>
  );
}
