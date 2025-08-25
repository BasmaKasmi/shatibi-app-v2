import { useState, useEffect } from "react";

const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      if (typeof window !== "undefined") {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobile =
          /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
          );

        const tablet =
          /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
            userAgent
          );

        setIsMobile(mobile && !tablet);
        setIsLoading(false);
      }
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  return { isMobile, isLoading };
};

export default useDeviceDetect;
