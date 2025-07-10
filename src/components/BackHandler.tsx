import { useEffect } from "react";
import { CodeComponentMeta } from "@plasmicapp/host";

type BackHandlerProps = {
  onBack?: () => void;
};

export const BackHandler = ({ onBack }: BackHandlerProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // یک state پایه و سپس state سفارشی اضافه می‌کنیم
    window.history.pushState(null, "");
    window.history.pushState({ isCustom: true }, "");

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.isCustom) {
        const action = onBack || (() => console.log("onBack not provided - default back action"));
        action();

        // چون برگشت خوردیم، دوباره state رو اضافه می‌کنیم
        window.history.pushState({ isCustom: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);

  return null; // چون فقط گوش می‌ده، نیازی به UI نداره
};

export const BackHandlerMeta: CodeComponentMeta<BackHandlerProps> = {
  name: "BackHandler",
  importPath: "@/components/BackHandler",
  props: {
    onBack: {
      type: "eventHandler",
      argTypes: [],
    },
  },
};
