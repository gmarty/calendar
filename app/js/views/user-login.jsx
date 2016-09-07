import React from 'components/react';

export default class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: 'mozilla',
    };

    this.server = props.server;
    this.analytics = props.analytics;

    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onChange(evt) {
    const login = evt.target.value;
    this.setState({ login });
  }

  onFormSubmit(evt) {
    evt.preventDefault(); // Avoid redirection to /?.

    this.server.login(this.state.login, 'password')
      .then(() => {
        this.analytics.event('user', 'login');
        location.hash = 'reminders';
      });
  }

  render() {
    return (
      <form className="user-login" onSubmit={this.onFormSubmit}>
        <input value={this.state.login}
               placeholder="Family name"
               className="user-login__name-field"
               onChange={this.onChange}/>
        <button className="user-login__login-button">
          <img src="css/icons/next.svg"/>
        </button>
      </form>
    );
  }
}

UserLogin.propTypes = {
  server: React.PropTypes.object.isRequired,
  analytics: React.PropTypes.object.isRequired,
};
