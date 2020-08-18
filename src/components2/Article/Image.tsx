/* eslint-disable import/prefer-default-export, react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';

import FeelSafe, {
  FeelsafeSize,
  FeelsafeIcon
} from '~/pages/Research/components/FeelSafe';
import { media } from '~/styles/utils';
import config from '~/config';

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3em -10px;

  ${media.m`
    flex-direction: row;
    margin: 3em -10px;
  `}
`;

const ImageSpacer = styled.div`
  position: relative;
  padding: 10px;
  flex: 1 1 100%;

  .feelsafe {
    position: absolute;
    top: 12px;
    right: 12px;
  }
`;

const Img = styled.img`
  width: 100%;
`;

const ImageWrapperFull = styled.div`
  margin: 0 auto;
  position: relative;

  .feelsafe {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  ${media.m`
    margin: 3em auto;
  `}
`;

const ImageWrapperSimple = styled(ImageWrapperFull)`
  max-width: 520px;
`;

const Subtitle = styled.div`
  color: ${config.colors.darkgrey};
  font-size: 0.75rem;
  margin-top: 5px;
  padding: 0 0.5em;
`;

/**
 * Return a srcSet attribute given an image file
 *
 * Assumes a naming scheme for the scaled versions of [base_path]@2x.[extension]
 *
 * @example
 * getSrcSet('picture.jpeg');
 * // => `picture.jpeg 1x, picture@2x.jpeg 2x, picture@3x.jpeg 3x`
 *
 * @param src image file path including extension
 */
const getSrcSet = (src: string) => {
  const base = src.match(/(.+)\.(.+)/)[1];
  const ext = src.match(/(.+)\.(.+)/)[2];
  return `${src} 1x, ${base}@2x.${ext} 2x, ${base}@3x.${ext} 3x`;
};

interface InnerImageProps extends ImageProps {
  feelsafeSize?: FeelsafeSize;
  feelsafeIcon?: FeelsafeIcon;
  children?: React.ReactNode;
  hasSrcSet?: boolean;
}

const InnerImg = ({
  source,
  alt,
  hasSrcSet = false,
  role = null,
  feelsafe = null,
  subtitle = null,
  feelsafeSize = 'small',
  feelsafeIcon = 'bike',
  children = null
}: InnerImageProps) => (
  <>
    <Img
      src={source}
      srcSet={!hasSrcSet ? null : getSrcSet(source)}
      alt={alt}
      role={role}
    />
    {feelsafe && (
      <FeelSafe value={feelsafe} size={feelsafeSize} icon={feelsafeIcon} />
    )}
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
    {children}
  </>
);

export const ImageMulti = ({ children }) => (
  <ImageWrapper>{children}</ImageWrapper>
);

interface ImageMultiInnerProps {
  source: string;
  alt?: string;
  role?: string;
  children: React.ReactNode | React.ReactNode[];
}

const ImageMultiInner = ({
  source,
  alt,
  role = null,
  children
}: ImageMultiInnerProps) => (
  <ImageSpacer>
    <InnerImg source={source} alt={alt} role={role}>
      {children}
    </InnerImg>
  </ImageSpacer>
);

ImageMulti.Inner = ImageMultiInner;
ImageMulti.Subtitle = Subtitle;

interface ImageProps {
  source: string;
  alt?: string; // required for accessibility
  role?: string; // for purely decorative images set alt="" role="presentation"
  feelsafe?: number;
  feelsafeIcon?: FeelsafeIcon;
  subtitle?: string;
  hasSrcSet?: boolean;
}

export const Image = ({
  source,
  alt,
  hasSrcSet = false,
  role = null,
  feelsafe = null,
  subtitle = null
}: ImageProps) => (
  <ImageWrapperSimple>
    <InnerImg
      source={source}
      hasSrcSet={hasSrcSet}
      alt={alt}
      role={role}
      feelsafe={feelsafe || null}
      subtitle={subtitle || null}
    />
  </ImageWrapperSimple>
);

export const ImageFull = ({
  source,
  alt,
  hasSrcSet = false,
  role = null,
  feelsafe = null,
  subtitle = null
}: ImageProps) => (
  <ImageWrapperFull>
    <InnerImg
      source={source}
      hasSrcSet={hasSrcSet}
      alt={alt}
      role={role}
      feelsafe={feelsafe || null}
      subtitle={subtitle || null}
      feelsafeSize="big"
    />
  </ImageWrapperFull>
);
