const fs = require('fs').promises;
const path = require('path');
const got = require('got');
const parse = require('csv-parse');

const csvLocation =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

got(csvLocation)
  .then(res => {
    return new Promise((resolve, reject) => {
      parse(res.body, (err, dataArray) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(dataArray);
      });
    });
  })
  .then(dataArray => {
    const dates = dataArray[0].slice(4);

    const countryData = {};

    for (let data of dataArray.slice(1)) {
      const country = data[1];

      if (countryData[country]) {
        countryData[country] = countryData[country].map(
          (value, i) => value + Number(data[i + 4])
        );
      } else {
        countryData[country] = data.slice(4).map(Number);
      }
    }

    // Change a couple countries so that they fit better
    countryData['UAE'] = countryData['United Arab Emirates'];
    delete countryData['United Arab Emirates'];

    countryData['United States'] = countryData['US'];
    delete countryData['US'];

    return { dates, countryData };
  })
  .then(data =>
    fs.writeFile(
      path.resolve(__dirname, 'country-cases.json'),
      JSON.stringify(data)
    )
  )
  .then(() => console.log('All done!'));
