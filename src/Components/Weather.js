import Day from "./Day";

export default function Weather({ displayLocation = "", weather = {} }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;

  return (
    <div>
      <h2>Weather for {displayLocation}</h2>

      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            key={date}
            date={date}
            max={max.at(i)}
            min={min.at(i)}
            code={codes.at(i)}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}
