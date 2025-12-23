import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function BubbleParticles({ className = "" }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0"],
        },
        move: {
          direction: "top",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 30,
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 5, max: 25 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 5,
          },
        },
        wobble: {
          enable: true,
          distance: 10,
          speed: 5,
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="bubbleParticles"
      options={options}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
