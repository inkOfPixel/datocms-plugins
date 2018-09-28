import React, { Component, render } from 'preact-compat';
import Rating from 'react-star-rating-component';
import rgbHex from 'rgb-hex';

function getStateFromExtension(extension) {
  return {
    starCount: extension.parameters.instance.maxRating,
    starColor: extension.parameters.instance.color,
    value: extension.getFieldValue(extension.fieldPath),
  };
}

window.DatoCmsExtension.init().then((extension) => {
  extension.startAutoResizer();

  class Input extends Component {
    constructor(props) {
      super(props);

      this.state = getStateFromExtension(extension);
    }

    componentDidMount() {
      this.unsubscribe = extension.addFieldChangeListener(extension.fieldPath, () => {
        this.setState(getStateFromExtension(extension));
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const { starCount, value, starColor } = this.state;
      return (
        <Rating
          name="star"
          onStarClick={newValue => extension.setFieldValue(extension.fieldPath, newValue)}
          value={value}
          starCount={starCount}
          starColor={starColor ? `#${rgbHex(
            starColor.red, starColor.green, starColor.blue, starColor.alpha / 255,
          )}` : '#ffb400'}
        />
      );
    }
  }

  render(<Input />, document.body);
});