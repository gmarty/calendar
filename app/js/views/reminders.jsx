import React from 'components/react';
import _ from 'components/lodash';
import moment from 'components/moment';

import ReminderItem from './reminders/reminder-item';

export default class Reminders extends React.Component {
  constructor(props) {
    super(props);

    this.speechController = props.speechController;

    moment.locale(navigator.languages || navigator.language || 'en-US');

    let k = 0;

    const reminders = [
      {
        id: k++,
        recipient: ['Guillaume'],
        content: 'Get a haircut',
        datetime: Date.now() + 1 * 60 * 60 * 1000,
      },
      {
        id: k++,
        recipient: ['Guillaume'],
        content: 'File a bug',
        datetime: Date.now() + 2.5 * 60 * 60 * 1000,
      },
      {
        id: k++,
        recipient: ['Julien'],
        content: 'Do the laundry',
        datetime: Date.now() + 1 * 60 * 60 * 24 * 1000,
      },
      {
        id: k++,
        recipient: ['Sam'],
        content: 'Attend ping pong competition',
        datetime: Date.now() + 10.5 * 60 * 60 * 24 * 1000,
      },
      {
        id: k++,
        recipient: ['Guillaume'],
        content: 'Attend Swan Lake by the Bolshoi Ballet',
        datetime: Date.now() + 45 * 60 * 60 * 24 * 1000,
      },
    ];

    this.state = { reminders };

    this.speechController.on('wakelistenstart', () => {
      console.log('wakelistenstart');
    });
    this.speechController.on('wakelistenstop', () => {
      console.log('wakelistenstop');
    });
    this.speechController.on('wakeheard', () => {
      console.log('wakeheard');
    });
    this.speechController.on('speechrecognitionstart', () => {
      console.log('speechrecognitionstart');
    });
    this.speechController.on('speechrecognitionstop', () => {
      console.log('speechrecognitionstop');
    });
    this.speechController.on('reminder', (reminder) => {
      console.log('reminder', reminder);
      const reminders = this.state.reminders;
      reminders.push({
        id: reminders.length,
        recipient: reminder.users,
        content: reminder.action,
        datetime: reminder.time,
      });

      this.setState(reminders);
    });
  }

  render() {
    let reminders = this.state.reminders;

    // Sort all the reminders chronologically.
    reminders = reminders.sort((a, b) => {
      return a.datetime - b.datetime;
    });

    // Group the reminders by month.
    reminders = _.groupBy(reminders, (reminder) => {
      return moment(reminder.datetime).format('YYYY/MM');
    });

    // For each month, group the reminders by day.
    Object.keys(reminders).forEach((month) => {
      reminders[month] = _.groupBy(reminders[month], (reminder) => {
        return moment(reminder.datetime).format('YYYY/MM/DD');
      });
    });

    const reminderNodes = Object.keys(reminders).map((key) => {
      const month = moment(key, 'YYYY/MM').format('MMMM');
      const reminderMonth = reminders[key];

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
                    {date.format('DD')}
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

Reminders.propTypes = {
  speechController: React.PropTypes.object.isRequired,
};
