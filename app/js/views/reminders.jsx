import React from 'components/react';
import moment from 'components/moment';

export default class Reminders extends React.Component {
  constructor() {
    super();

    moment.locale(navigator.languages || navigator.language || 'en-US');

    let k = 0;

    this.state = {
      reminders: [
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
      ],
    };

    const STARTING_DATE = this.getStartingDate();
    moment(STARTING_DATE).format();
  }

  getStartingDate() {
    return this.state.reminders[0].datetime;
  }

  render() {
    const reminders = this.state.reminders
      .map((reminder) => {
        return (<li key={reminder.id}>
          <div className="reminders__date">
            <div>{moment(reminder.datetime).format('D')}</div>
            <div>{moment(reminder.datetime).format('ddd')}</div>
          </div>
          <div className="reminders__time">
            <div>{moment(reminder.datetime).format('LT')}</div>
          </div>
          <div>
            <strong>{reminder.recipient}</strong>
            <p>{reminder.content}</p>
          </div>
        </li>);
      });

    return (
      <section className="reminders">
        <h1 className="reminders__month">
          {moment(this.getStartingDate()).format('MMMM')}
        </h1>
        <ol className="reminders__list">{reminders}</ol>
      </section>
    );
  }
}
