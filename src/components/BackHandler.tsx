import { useEffect } from "react";
import { CodeComponentMeta } from "@plasmicapp/host";

type BackHandlerProps = {
  onBack?: () => void;
  active?: boolean;
};

export const BackHandler = ({ onBack, active = true }: BackHandlerProps) => {
  useEffect(() => {
    if (typeof window === "undefined" || !active) return;

    window.history.pushState(null, "");
    window.history.pushState({ isCustom: true }, "");

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.isCustom) {
        const action = onBack || (() => console.log("onBack not provided - default back action"));
        action();

        window.history.pushState({ isCustom: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack, active]);

  return null;
};

export const BackHandlerMeta: CodeComponentMeta<BackHandlerProps> = {
  name: "BackHandler",
  importPath: "@/components/BackHandler",
  props: {
    onBack: {
      type: "eventHandler",
      argTypes: [],
    },
    active: {
      type: "boolean",
      defaultValue: true,
    },
  },
};
