// import { getDictionary } from '@/features/internationalization/get-dictionaries';
// import { Locale } from '@/features/internationalization/i18n-config';

import { getDictionary } from "../(features)/(internationlization)/get-dictionaries";
import { Locale } from "../(features)/(internationlization)/i18n-config";

// import { CounterComponent } from './counter-component';

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex w-full h-screen gap-x-1 items-center justify-center">
      {/* <p>Current locale: {lang}</p> */}
      <p className="text-2xl "> {dictionary.landing.welcome}</p>
      <p className="text-2xl  ">{dictionary.landing.description}</p>
      {/* <CounterComponent dictionary={dictionary.counter} /> */}
    </div>
  );
}