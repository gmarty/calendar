import React from 'components/react';
import _ from 'components/lodash';
import moment from 'components/moment';

import ReminderItem from './reminders/reminder-item';

export default class Reminders extends React.Component {
  constructor() {
    super();

    moment.locale(navigator.languages || navigator.language || 'en-US');

    let k = 0;

    let reminders = [
      {
        id: k++,
        recipient: 'Guillaume',
        content: 'Get a haircut',
        datetime: Date.now() + 1 * 60 * 60 * 1000,
      },
      {
        id: k++,
        recipient: 'Guillaume',
        content: 'File a bug',
        datetime: Date.now() + 2 * 60 * 60 * 1000,
      },
      {
        id: k++,
        recipient: 'Julien',
        content: 'Do the laundry',
        datetime: Date.now() + 1 * 60 * 60 * 24 * 1000,
      },
      {
        id: k++,
        recipient: 'Sam',
        content: 'Attend ping pong competition',
        datetime: Date.now() + 15 * 60 * 60 * 24 * 1000,
      },
      {
        id: k++,
        recipient: 'Guillaume',
        content: 'Attend Swan Lake by the Bolshoi Ballet',
        datetime: Date.now() + 45 * 60 * 60 * 24 * 1000,
      },
    ];
    // Cluster reminders by month, then by date.
    reminders = _.groupBy(reminders, (r) => {
      return moment(r.datetime).format('YYYY/MM');
    });

    Object.keys(reminders).forEach((key) => {
      reminders[key] = _.groupBy(reminders[key], (r) => {
        return moment(r.datetime).format('YYYY/MM/DD');
      });
    });

    console.log(reminders);

    this.state = { reminders };
  }

  render() {
    const reminderNodes = Object.keys(this.state.reminders).map((key) => {
      const month = moment(key, 'YYYY/MM').format('MMMM');
      const reminderMonth = this.state.reminders[key];

      return (
        <div key={key}>
          <h2 className="reminders__month">{month}</h2>
          {Object.keys(reminderMonth).map((key) => {
            const date = moment(key, 'YYYY/MM/DD');
            const remindersDay = reminderMonth[key];

            return (
              <div key={key} className="reminders__day">
                <div className="reminders__day-date">
                  <div className="reminders__day-mday">
                    {date.format('D')}
                  </div>
                  <div className="reminders__day-wday">
                    {date.format('ddd')}
                  </div>
                </div>
                <ol className="reminders__list">
                  {remindersDay.map((reminder) => {
                    return (<ReminderItem key={reminder.id}
                                          reminder={reminder}
                    />);
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      );
    });

    return (
      <section className="reminders">
        {reminderNodes}
      </section>
    );
  }
}
