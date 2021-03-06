import React from 'react';
import styled from 'styled-components';
import { media } from '~/styles/utils';

interface QuoteProps {
  sourceText?: string;
  long?: boolean;
  children: React.ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 620px;
  margin: 1em auto 1.8em auto;

  ${media.m`
    margin: 3em auto 3.8em auto;
  `}
`;

const QuoteStyle = styled.div`
  background: white;
  box-shadow: 2px 6px 60px 0 rgba(0, 0, 0, 0.09);
  padding: ${(props: QuoteProps) =>
    props.long && props.sourceText ? '2.5em' : '1.5em'};
  font-size: ${(props: QuoteProps) => (props.long ? '1em' : '1.5em')};
  font-style: italic;
  font-weight: 600;
  line-height: 1.5em;
  border-radius: 6px;
`;

const Attribution = styled.div`
  display: inline;
  background: #cf0a7d;
  font-weight: 700;
  font-size: 0.875em;
  font-style: normal;
  line-height: 1.25;
  padding: 11px 22px;
  border-radius: 3px;
  color: white;
  align-self: center;
  transform: translateY(-50%);
`;

const Quote = (props: QuoteProps) => (
  <Wrapper>
    <QuoteStyle {...props}>{props.children}</QuoteStyle>
    {props.sourceText && (
      <Attribution {...props}>{props.sourceText}</Attribution>
    )}
  </Wrapper>
);

export default Quote;
