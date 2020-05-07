import styled from 'styled-components';
import config from '~/config';

interface Props {
  ghost?: boolean;
  flat?: boolean;
  disabled?: boolean;
}

const getBackgroundColor = ({ ghost, disabled }: Props) => {
  if (ghost) {
    return 'none';
  }
  if (disabled) return config.colors.lightbg;
  return config.colors.interaction;
};

export default styled.button<Props>`
  border-radius: 24px;
  border: ${(props) =>
    props.ghost ? `1.5px solid ${config.colors.interaction}` : 'none'};
  outline: none;
  display: inline-block;
  padding: 15px 25px;
  background: ${getBackgroundColor};
  box-shadow: ${(props) =>
    props.flat ? 'none' : '0 10px 20px 0 rgba(0, 0, 0, 0.2)'};
  color: ${({ disabled }) =>
    disabled ? config.colors.inactivegrey : config.colors.darkbg};
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }

  && a:link,
  && a:visited {
    color: ${config.colors.darkbg};
    border: none;
    text-decoration: none;
  }
`;