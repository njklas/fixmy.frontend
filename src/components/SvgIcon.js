import { PureComponent } from 'react';

class SvgIcon extends PureComponent {
  state = {
    icon: null
  }

  componentDidMount() {
    import(`~/images/${this.props.type}.svg`).then((Icon) => {
      this.setState({ icon: Icon.default(this.props) });
    });
  }

  render() {
    return this.state.icon;
  }
}

export default SvgIcon;