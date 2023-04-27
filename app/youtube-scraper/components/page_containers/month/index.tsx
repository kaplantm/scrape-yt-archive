import { useRouter } from "next/router";
import VideoCallout from "components/HighlightedVideo";
import { generatePageStaticProps } from "./helpers/page-generation";
import { Fragment, memo } from "react";
import { getWeekDays, monthNames, weekDays } from "utils/time-utils";
import { daysInMonth } from "utils/time-utils";
import { getRange } from "utils/num-utils";
import { chunk } from "utils/array-utils";

const MonthPageContainer = (props: Awaited<ReturnType<typeof generatePageStaticProps>>) => {
  const { calendarArray } = props;
  const router = useRouter();
  const { year, month } = router.query;
  const chunkedCalendarArray = chunk(calendarArray);
  return (
    <div>
      <div className="flex gap-10 mb-10">
        <header>
          <h1 className="text-3xl">Featured Videos</h1>

          <span className="text-9xl font-bold text-red-500">{year}</span>
          <span className="text-4xl font-bold text-red-600 block">{monthNames[parseInt(month as string) - 1]}</span>
        </header>
        {/* {!!mostLeastList.length && (
          <>
            {mostLeastList.map(
              (el) =>
                !!el.value?.length && (
                  <section className="flex flex-col items-start" key={el.label}>
                    <p className="pb-1">{el.label}:</p>
                    <ul className="flex flex-col gap-1 border-l-red-400 border-l-8 border-t-red-400 border-t-8 pl-2">
                      {el.value.map((val) => (
                        <li key={val.name}>{val.name}</li>
                      ))}
                    </ul>
                  </section>
                )
            )}
            {!!mostFeaturedAuthors?.length && (
              <section className="flex flex-col items-start">
                <p className="pb-1">Top Video Authors:</p>
                <ul className="flex flex-col gap-1 border-l-red-400 border-l-8 border-t-red-400 border-t-8 pl-2">
                  {mostFeaturedAuthors.map((el) => (
                    <li key={el.name}>
                      <a target="_blank" href={`https://www.youtube.com/@${el.name}`}>
                        {el.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className="flex flex-col gap-2 items-start">
              {Object.values(counts).map(
                (el) =>
                  !!el?.value && (
                    <p key={el.label}>
                      <span className="text-lg font-bold text-red-400">{parseInt(el.value)}</span> {el.label}
                    </p>
                  )
              )}
            </div>
          </>
        )} */}
      </div>
      <section>
        <table className="w-full">
          <thead>
            <tr>
              {weekDays.map((el, i) => (
                <th className="text-center text-slate-300" key={`${el}-${i}`}>
                  <div className="rounded-full p-2 m-2 bg-slate-800"> {el}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chunkedCalendarArray.map((el, i) => (
              <tr key={i}>
                {el.map((day, i) => (
                  <td className="p-2" key={`${el}-${i}`}>
                    {!!day && (
                      <div className="rounded-full p-2 bg-slate-700 flex">
                        <div className="rounded-full p-2 bg-slate-900 w-10 h-10 flex items-center justify-center text-lg font-bold">
                          {day}
                        </div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default memo(MonthPageContainer);
