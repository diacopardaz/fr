import { useEffect, useRef, useState } from "react";
import { CodeComponentMeta } from "@plasmicapp/host";

type BackHandlerProps = {
  onBack?: () => void;
};

export const BackHandler = ({ onBack }: BackHandlerProps) => {
  const onBackRef = useRef<() => void>();
  const [isReady, setIsReady] = useState(false);

  // نگه داشتن آخرین مقدار onBack
  useEffect(() => {
    if (onBack) {
      onBackRef.current = onBack;
      setIsReady(true);
    }
  }, [onBack]);

  useEffect(() => {
    if (!isReady) return;

    // تاخیر خیلی کوتاه تا بعد از render کامل مودال
    const timeoutId = setTimeout(() => {
      window.history.pushState({ isCustom: true }, "");
    }, 50);

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.isCustom) {
        onBackRef.current?.();
        window.history.pushState({ isCustom: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isReady]);

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
