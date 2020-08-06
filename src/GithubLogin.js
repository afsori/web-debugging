import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import PopupWindow from "./popup";
import { toQuery } from "./utils";

class GitHubLogin extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    clientId: PropTypes.string.isRequired,
    onRequest: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    redirectUri: PropTypes.string,
    scope: PropTypes.string,
  };

  static defaultProps = {
    buttonText: "Sign in with GitHub",
    redirectUri: "",
    scope: "user:email",
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
  };

  onBtnClick = () => {
    const { clientId, scope, redirectUri } = this.props;
    const search = toQuery({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    });
    const popup = (this.popup = PopupWindow.open(
      "github-oauth-authorize",
      `https://github.com/login/oauth/authorize?${search}`,
      { height: 1000, width: 600 }
    ));

    this.onRequest();
    popup.then(
      (data) => this.onSuccess(data),
      (error) => this.onFailure(error)
    );
  };

  onRequest = () => {
    this.props.onRequest();
  };

  onSuccess = (data) => {
    if (!data.code) {
      return this.onFailure(new Error("'code' not found"));
    }

    this.onGetAccessToken(data);
  };

  onFailure = (error) => {
    this.props.onFailure(error);
  };

  onGetAccessToken = (code) => {
    const { clientId, clientSecret } = this.props;
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    };
    const options = { headers: { accept: "application/json" } };
    axios
      .post(`https://github.com/login/oauth/access_token`, body, options)
      .then((access_token) => {
        this.onGetProfile(access_token);
      })
      .catch((err) => this.onFailure(err.message));
  };

  onGetProfile = (token) => {
    axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + token,
      },
    }).then((response) => {
      this.props.onSuccess(response.data);
    });
  };

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: this.onBtnClick };

    if (className) {
      attrs.className = className;
    }

    return <button {...attrs}>{children || buttonText}</button>;
  }
}

export default GitHubLogin;
