import React, { useEffect, useMemo, useState } from "react";
import toast, { ToastPosition, Toaster } from "react-hot-toast";

import {
  DataProvider,
  GlobalActionsProvider,
  GlobalContextMeta,
} from "@plasmicapp/host";
import axios from "axios";
import moment from "jalali-moment";
import Cookies from "js-cookie";

type FragmentProps = React.PropsWithChildren<{
  previewApiConfig: Record<string, any>;
  apiConfig: Record<string, any>;
  rtl: boolean;
  primaryColor: string;
}>;

export const Fragment = ({
  children,
  previewApiConfig,
  apiConfig,
  rtl,
  primaryColor,
}: FragmentProps) => {
  useEffect(() => {
    changeTheme(primaryColor);
  }, [primaryColor]);

  const changeTheme = (color: string) => {
    document.documentElement.style.setProperty("--primary", color);
  };

  const actions = useMemo(
    () => ({
    showToast: (
          type: "success" | "error" | "custom",
          message: string,
          placement: ToastPosition = "top-right",
          duration: number = 3000
        ) => {
          if (type === "custom") {
            toast.custom((t) => (
              <div
                   className={`custom-toast-info ${t.visible ? "animate-enter" : "animate-leave"}`}
                  style={{
                    transition: "all 0.3s ease",
                    maxWidth: "300px",
                    margin: "0.5rem",
                  }}
                >
                    <span className="font-semibold mr-2"><svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21.5C17.1086 21.5 21.25 17.3586 21.25 12.25C21.25 7.14137 17.1086 3 12 3C6.89137 3 2.75 7.14137 2.75 12.25C2.75 17.3586 6.89137 21.5 12 21.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.9309 8.15005C12.9256 8.39231 12.825 8.62272 12.6509 8.79123C12.4767 8.95974 12.2431 9.05271 12.0008 9.05002C11.8242 9.04413 11.6533 8.98641 11.5093 8.884C11.3652 8.7816 11.2546 8.63903 11.1911 8.47415C11.1275 8.30927 11.1139 8.12932 11.152 7.95675C11.19 7.78419 11.278 7.6267 11.405 7.50381C11.532 7.38093 11.6923 7.29814 11.866 7.26578C12.0397 7.23341 12.2192 7.25289 12.3819 7.32181C12.5446 7.39072 12.6834 7.506 12.781 7.65329C12.8787 7.80057 12.9308 7.97335 12.9309 8.15005ZM11.2909 16.5301V11.1501C11.2882 11.0556 11.3046 10.9615 11.3392 10.8736C11.3738 10.7857 11.4258 10.7057 11.4922 10.6385C11.5585 10.5712 11.6378 10.518 11.7252 10.4822C11.8126 10.4464 11.9064 10.4286 12.0008 10.43C12.094 10.4299 12.1863 10.4487 12.272 10.4853C12.3577 10.5218 12.4352 10.5753 12.4997 10.6426C12.5642 10.7099 12.6143 10.7895 12.6472 10.8767C12.6801 10.9639 12.6949 11.0569 12.6908 11.1501V16.5301C12.6908 16.622 12.6727 16.713 12.6376 16.7979C12.6024 16.8828 12.5508 16.96 12.4858 17.025C12.4208 17.09 12.3437 17.1415 12.2588 17.1767C12.1738 17.2119 12.0828 17.23 11.9909 17.23C11.899 17.23 11.8079 17.2119 11.723 17.1767C11.6381 17.1415 11.5609 17.09 11.4959 17.025C11.4309 16.96 11.3793 16.8828 11.3442 16.7979C11.309 16.713 11.2909 16.622 11.2909 16.5301Z" fill="#ffffff"></path> </g></svg></span>
                    {message}
                </div>
                ), {
                  duration,
                  position: placement,
                });
              } else {
                toast[type ?? "success"](message, {
                  duration,
                  position: placement,
                });
              }
            },
      apiRequest: async (
        method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
        url: string,
        params: Record<string, string | string[]> = {},
        body?: Record<string, any>,
        config?: Record<string, any>
      ) => {
        try {
          let result;
          if (method === "GET") {
            result = await axios.get(url, {
              params,
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          }
          if (method !== "GET") {
            result = await axios[
              method.toLowerCase() as "post" | "delete" | "put" | "patch"
            ](url, body, {
              params,
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          }
          return result;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return error.response;
          }
        }
      },
      wait: (duration: number = 1000) => {
        return new Promise((resolve) => setTimeout(resolve, duration));
      },
      convertJalaliToGregorian: (year: number | string, month: number | string, day: number | string) => {
        const jalaliDate = `${year}/${month}/${day}`;
        return moment(jalaliDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
      },
      formatDate: (
          dateStr: string,
          type: "jalali" | "gregorian",
          format: string = "dddd D MMMM YYYY"
        ) => {
          const date = type === "jalali"
            ? moment(dateStr, "jYYYY/jMM/jDD").locale("fa")
            : moment(dateStr, "YYYY-MM-DD").locale("fa");
        
          return date.format(format);
        },
       cookieManager : (
              action: "get" | "set" | "remove",
              key: string,
              value?: string,
              options?: { days?: number; path?: string }
            ): string | undefined => {
              const cookieOptions = {
                expires: options?.days ?? 7,
                path: options?.path ?? '/',
              };
            
              if (action === "set" && value !== undefined) {
                Cookies.set(key, value, cookieOptions);
                return 'OK';
              }
            
              if (action === "get") {
                return Cookies.get(key);
              }
            
              if (action === "remove") {
                Cookies.remove(key, { path: options?.path ?? '/' });
                return 'OK';
              }
            }
    }),
    []
  );

  return (
    <GlobalActionsProvider contextName="Fragment" actions={actions}>
      <DataProvider
        name="Fragment"
        data={{
          apiConfig: apiConfig ?? {},
          previewApiConfig: previewApiConfig ?? {},
          rtl,
          primaryColor,
        }}
        hidden
      >
        {children}
        <Toaster /><Toaster
          toastOptions={{
            // کلاس‌های عمومی برای تمام toastها
            className: 'custom-toast',
            // کلاس‌های مخصوص برای انواع مختلف toast
            success: {
              className: 'custom-toast-success',
            },
            error: {
              className: 'custom-toast-error',
            },
            custom: { 
              className: 'custom-toast-info' 
            }
          }}
        />
      </DataProvider>
    </GlobalActionsProvider>
  );
};

export const fragmentMeta: GlobalContextMeta<FragmentProps> = {
  name: "Fragment",
  displayName: "Fragment",
  importPath: "@/fragment/fragment",
  props: {
    apiConfig: {
      displayName: "API Config",
      type: "object",
      description: `e.g. { withCredentials: true }`,
      helpText:
        "Read about request configuration options at https://axios-http.com/docs/req_config",
    },
    previewApiConfig: {
      displayName: "Preview API Config",
      type: "object",
      description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
      editOnly: true,
      helpText:
        "Read about request configuration options at https://axios-http.com/docs/req_config",
    },
    rtl: {
      displayName: "RTL",
      type: "boolean",
      description: `Direction`,
    },
    primaryColor: {
      displayName: "Primary Color",
      type: "color",
      defaultValue: "#000000",
      defaultValueHint: "#000000",
    },
  },
  providesData: true,
  globalActions: {
    showToast: {
      displayName: "Show Toast",
      parameters: [
        {
          name: "type",
          type: {
            type: "choice",
            options: ["success", "error", "custom"],
            defaultValueHint: "success",
          },
        },
        {
          name: "message",
          type: {
            type: "string",
            defaultValueHint: "A message for you!",
            required: true,
          },
        },
        {
          name: "placement",
          type: {
            type: "choice",
            options: [
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ],
            defaultValueHint: "top-right",
          },
        },
        {
          name: "duration",
          type: {
            type: "number",
            defaultValueHint: 3000,
          },
        },
      ],
    },
    wait: {
      displayName: "Wait",
      parameters: [
        {
          name: "duration",
          type: {
            type: "number",
            defaultValueHint: 1000,
            defaultValue: 1000,
            helpText: "executes after a specified delay (in milliseconds).",
          },
        },
      ],
    },
    apiRequest: {
      displayName: "API Request",
      parameters: [
        {
          name: "method",
          type: {
            type: "choice",
            options: ["GET", "POST", "DELETE", "PUT", "PATCH"],
            defaultValueHint: "GET",
            defaultValue: "GET",
          },
        },
        {
          name: "url",
          displayName: "URL",
          type: {
            type: "string",
            defaultValueHint: "/api/v1/users",
            required: true,
          },
        },
        {
          displayName: "Query Params",
          name: "params",
          type: {
            type: "object",
            description: `e.g. { id: 20 }`,
            helpText:
              "It will append this to the end of the URL as ?key=value.",
          },
        },
        {
          displayName: "Body",
          name: "body",
          type: {
            type: "object",
            helpText: "It is not applicable for the GET method.",
            description: `e.g. { id: 20 }`,
          },
        },
        {
          name: "config",
          displayName: "Request Config",
          type: {
            type: "object",
            description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
            helpText:
              "Read about request configuration options at https://axios-http.com/docs/req_config",
          },
        },
      ],
    },
    convertJalaliToGregorian: {
      displayName: "Convert Jalali To Gregorian",
      parameters: [
        { name: "year", type: {
            type: "string",
            defaultValueHint: "1403",
            required: true,
          }},
        { name: "month", type: {
            type: "string",
            defaultValueHint: "9",
            required: true,
          }},
        { name: "day", type: {
            type: "string",
            defaultValueHint: "3",
            required: true,
          }}
      ],
    },
    formatDate: {
      displayName: "Format Date (Jalali or Gregorian)",
      parameters: [
        {
          name: "dateStr",
          type: {
            type: "string",
            defaultValueHint: "1403/04/01 or 2025-06-21",
            required: true,
          },
        },
        {
          name: "type",
          type: {
            type: "choice",
            options: ["jalali", "gregorian"],
            defaultValueHint: "jalali",
            required: true,
          },
        },
        {
          name: "format",
          type: {
            type: "string",
            defaultValueHint: "dddd D MMMM YYYY",
            helpText: `Moment.js format (e.g. "jYYYY/jMM/jDD" or "dddd D MMMM YYYY")`,
          },
        },
      ],
    },
    cookieManager: {
        displayName: "Cookie Manager",
        parameters: [
          {
            name: "action",
            type: {
              type: "choice",
              options: ["get", "set", "remove"],
              required: true,
              defaultValueHint: "get",
            },
          },
          {
            name: "key",
            type: {
              type: "string",
              required: true,
              defaultValueHint: "userToken",
            },
          },
          {
            name: "value",
            type: {
              type: "string",
              defaultValueHint: "abc123",
              helpText: "Only used for action = set",
            },
          },
          {
            name: "options",
            type: {
              type: "object",
              helpText: "Optional settings like days and path. Example: { days: 7, path: '/' }",
            },
          },
        ],
      },


  },
};
