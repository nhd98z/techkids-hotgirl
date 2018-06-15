import React, { Component } from "react";
import GirlImage from "./GirlImage";

class MainContent extends Component {
  render() {
    const allImages = this.props.images.map(img => (
      <GirlImage key={img._id} img={img} />
    ));
    return (
      <div className="container main_content">
        <div className="row">{allImages}</div>
      </div>
    );
  }
}

export default MainContent;
