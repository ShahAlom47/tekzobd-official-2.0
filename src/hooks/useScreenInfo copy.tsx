import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down";

interface ScreenInfo {
  width: number;
  height: number;
  scrollY: number;
  scrollDirection: ScrollDirection;
}

const useScreenInfo = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    width: 0,
    height: 0,
    scrollY: 0,
    scrollDirection: "up",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastScrollY = window.scrollY;

    const handleResize = () => {
      setScreenInfo((prev) => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction: ScrollDirection = currentScrollY > lastScrollY ? "down" : "up";

      setScreenInfo((prev) => ({
        ...prev,
        scrollY: currentScrollY,
        scrollDirection: direction,
      }));

      lastScrollY = currentScrollY;
    };

    // Initial setup
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return screenInfo;
};

export default useScreenInfo;
