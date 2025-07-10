import { useEffect, useRef } from "react";
import { CodeComponentMeta } from "@plasmicapp/host";

type BackHandlerProps = {
  onBack?: () => void;
};

export const BackHandler = ({ onBack }: BackHandlerProps) => {
  const backRef = useRef<() => void>();

  // همیشه آخرین نسخه onBack رو ذخیره کن
  useEffect(() => {
    backRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    // کمی تأخیر برای اطمینان از ثبت history
    const timeoutId = setTimeout(() => {
      window.history.pushState({ isCustom: true }, "");
    }, 100);

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.isCustom) {
        backRef.current?.(); // فراخوانی نسخه فعلی onBack
        window.history.pushState({ isCustom: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
  },
};
