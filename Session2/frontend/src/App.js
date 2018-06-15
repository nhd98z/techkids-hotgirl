import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "./axios";

import NavBar from "./components/NavBar";
import MainContent from "./components/MainContent";

class App extends Component {
  state = {
    images: [],
    searchString: ""
  };

  componentDidMount() {
    axios
      .get("/api/images")
      .then(data => {
        console.log(data.data);
        this.setState({
          images: data.data
        });
      })
      .catch(err => console.error(err));
  }

  _onSearchChanged = text => this.setState({ searchString: text });

  _onLogin = () => {
    axios
      .post("/api/auth", {
        username: "admin",
        password: "123456"
      })
      .then(response =>
        this.setState({
          username: response.data.username,
          id: response.data.id
        })
      )
      .catch(err => console.error(err));
  };

  render() {
    const displayedImages = this.state.images.filter(
      img =>
        img.title.includes(this.state.searchString) ||
        img.description.includes(this.state.searchString)
    );

    return (
      <div className="App">
        <NavBar
          onSearchChanged={this._onSearchChanged}
          username={this.state.username}
          onLogin={this._onLogin}
        />
        <MainContent images={displayedImages} />
      </div>
    );
  }
}

export default App;
