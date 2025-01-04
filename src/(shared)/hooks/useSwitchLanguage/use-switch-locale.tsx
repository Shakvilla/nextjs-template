import { Locale } from "@/app/(features)/(internationlization)/i18n-config";
import { usePathname } from "next/navigation";

export function useSwitchLocaleHref() {
  const pathName = usePathname();

  const getSwitchLocaleHref = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };
  return getSwitchLocaleHref;
}
