import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useStores";
import throttle from "lodash/throttle";
import { toast } from "sonner";
import posthog from "posthog-js";

const RESET_CLICK_TIME = 1000;

const RAGE_CLICK_THRESHOLD = 10;

let clickCount = 0;
let resetClickTimeout: NodeJS.Timeout | null = null;

export const useAntiRageClick = () => {
  const settings = useSettings();

  useEffect(() => {
    const globalClickEvent = (e: MouseEvent) => {
      clickCount++;

      if (resetClickTimeout) {
        clearTimeout(resetClickTimeout);
      }

      resetClickTimeout = setTimeout(() => {
        clickCount = 0;
      }, RESET_CLICK_TIME);

      if (clickCount > RAGE_CLICK_THRESHOLD) {
        clickCount = 0;
        posthog.capture("rage_click");
        throttle(() => {
          console.log("show toast");
          toast.info("All the links are disabled", {
            duration: 3000,
            description:
              "You have disabled all the links in the app in order to force you to use shortcuts! (⌘ + k > links to reenable links)"
          });
        }, 10000)();
      }
    };

    document.addEventListener("click", globalClickEvent);

    return () => {
      document.removeEventListener("click", globalClickEvent);
    };
  }, []);
};
