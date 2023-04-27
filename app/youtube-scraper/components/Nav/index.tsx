import { getFirstVideoScrapeInstance } from "services/prisma-service/video-scrape-instance";
import clsx from "clsx";
import { getDays, years } from "utils/path-utils";
import { daysInMonth, monthNames } from "utils/time-utils";
import { useRouter } from "next/router";

const Nav = () => {
  const { query = {} } = useRouter();
  const { year, month, day } = query;
  return (
    <nav className="flex flex-wrap bg-red-700 text-sm">
      <div className="flex flex-col w-full">
        <div className="p-2">
          {years.map((yr) => (
            <a
              key={yr}
              href={`/year/${yr}`}
              className={clsx("text-red-200 hover:text-white p-2", {
                "font-bold border rounded": yr === parseInt(year as string),
              })}
            >
              {yr}
            </a>
          ))}
          <a
            href="/"
            className={clsx("text-red-200 hover:text-white p-2", {
              "font-bold border rounded": !year,
            })}
          >
            All Time
          </a>
        </div>
        {year && (
          <div className="bg-red-800 p-2 w-full">
            {monthNames.map((m, i) => (
              <a
                key={m}
                href={`/year/${year}/month/${i + 1}`}
                className={clsx("text-red-200 hover:text-white  p-2", {
                  "font-bold border rounded": i + 1 === parseInt(month as string),
                })}
              >
                {m}
              </a>
            ))}
          </div>
        )}
        {/* <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-red-500 hover:bg-white mt-4 lg:mt-0"
          >
            Download
          </a>
        </div> */}
      </div>
    </nav>
  );
};

export default Nav;