import React, { PureComponent } from 'react';
import styled from 'styled-components';
import BikestandsIcon from '~/images/reports/bikestands-icon.svg';
import ShareIcon from '~/images/reports/share.svg';

import detailWrapped from '~/pages/Map/components/DetailView/detailWrapped';
import PlanningLike from '~/pages/Map/components/DetailView/PlanningDetail/PlanningLike';
import DetailFooter from '~/pages/Map/components/DetailView/DetailFooter';

// TODO: split up in subcomponents (Topbar etc.) just like Reports/Landing

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReportImage = styled.img`
  width: 100%;
`;

const HeadlineSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

// TODO: copied, de-dupe
const Heading = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: ${config.colors.black};
  line-height: 1.32;
  margin: 0;
`;

const BikeStandsCountSection = styled.div`
  margin-left: 16px;
`;

const BikeStandsCount = styled.p`
  margin-top: 4px;
  margin-bottom: 0;
  text-align: center;
  font-size: 10px;
  color: #999999;
`;

const Description = styled.p`
  padding: 16px;
  color: rgba(0, 0, 0, 0.54);
  line-height: 1.71;
  font-size: 14px;
  margin: 20px 0;
  flex:1;
  overflow:auto;
`;

// using an invisible item to align the LikeButton in the middle and the share button right using justify-content: space-between;
const Fill = styled.div`
  width: 20%;
  height: 20%;
`;

const LikeButtonCaption = styled.p`
  font-size: 11px;
  letter-spacing: 0.2px;
  color: ${config.colors.black};
  text-align: center;
  margin-bottom: 0;
`;

const ShareButtonWrapper = styled.div`
  cursor: pointer;
`;

const ShareButton = styled(ShareIcon)`
  display: block;
  cursor: pointer;
  margin: 0 25px 30px 25px;
`;


class ReportDetails extends PureComponent {
  /**
   * Shares Report using the Share API. TODO: discuss how a shared post looks like
   * Will only work when app is served over HTTPs https://developers.google.com/web/updates/2016/09/navigator-share
   * TODO: test
   */
  shareReport = () => {
    const { reportItem } = this.props;

    if (!navigator.share) {
      console.warn('Share API not present');
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: `${reportItem.details.number} neue Fahrradbügel benötigt`,
        text: `${reportItem.description} Eine Meldung auf FixMyBerlin.`,
        url: window.location
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error)); // TODO: show error feedback
    }
  }

  render() {
    const { reportItem } = this.props;

    if (typeof reportItem === 'undefined') {
      return null;
    }

    const { photo, details, description, id } = reportItem;

    return (
      <Wrapper>
        {photo && photo.src && (<ReportImage src={photo.src} />)}

        <HeadlineSection>
          <Heading>{details.number} neue Fahrradbügel benötigt</Heading>
          <BikeStandsCountSection>
            <BikestandsIcon />
            <BikeStandsCount>x{details.number}</BikeStandsCount>
          </BikeStandsCountSection>
        </HeadlineSection>
        <Description>{description}</Description>

        <DetailFooter>
          <Fill />
          <PlanningLike token={this.props.token} url={""} id={id} />
          {navigator.share ? (
            <ShareButtonWrapper>
              <ShareButton onClick={this.shareReport} />
              <LikeButtonCaption>
                Teilen
              </LikeButtonCaption>
            </ShareButtonWrapper>
          ) : <Fill />}
        </DetailFooter>
      </Wrapper>
    );
  }
}

export default detailWrapped(ReportDetails);
