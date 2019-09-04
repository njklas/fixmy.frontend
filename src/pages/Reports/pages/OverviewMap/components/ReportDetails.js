import React, { PureComponent } from 'react';
import styled from 'styled-components';
import BikestandsIcon from '~/images/reports/bikestands-icon.svg';
import ShareIcon from '~/images/reports/share.svg';

import detailWrapped from '~/pages/Map/components/DetailView/detailWrapped';
import PlanningLike from '~/pages/Map/components/DetailView/PlanningDetail/PlanningLike';
import DetailFooter from '~/pages/Map/components/DetailView/DetailFooter';
import { getReportStatusCaption } from '~/pages/Reports/apiservice';

import SubHeading from '~/pages/Reports/pages/SubmitReport/components/SubHeading';
import HorizontalRuler from '~/pages/Reports/pages/SubmitReport/components/HorizontalRuler';
import Heading from '~/pages/Reports/pages/SubmitReport/components/Heading';

// TODO: split up in subcomponents (Topbar etc.) just like Reports/Landing

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const Main = styled.div`
  padding: 16px 16px 180px 16px;
`;

const SocialFooter = styled(DetailFooter)`
  width: 100%;
  position: fixed;
  bottom: 0;
`;

const ReportImage = styled.img`
  width: 100%;
`;

const HeadlineSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BikeStandsCountSection = styled.div`
  margin-left: 16px;
`;

const BikeStandsCount = styled.p`
  margin-top: 4px;
  margin-bottom: 0;
  text-align: center;
  font-size: 14px;
  color: #999999;
`;

const StatusIndicator = styled.p`
  font-size: 22px;
  font-weight: 300;
  line-height: 1.32;
  color: ${config.colors.black};
`;

const Text = styled.p`
  color: ${config.colors.darkgrey};
  font-size: 16px;
`;

const IndicatorSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IndicatorTitle = styled.p`
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: 300;
  line-height: 1.32;
  color: ${config.colors.black};
  flex-flow: 2;
`;

const IndicatorValue = styled(Text)`
  flex-flow: 1;
  text-align: center;
  white-space: pre-wrap;
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
        title: `${reportItem.details.number} neue Fahrradbügel gewünscht`,
        text: `${reportItem.description} Eine Meldung auf FixMyBerlin.`,
        url: window.location
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error)); // TODO: show error feedback
    }
  }

  formatDate = dateString => new Date(dateString)
    .toLocaleDateString('de-DE', {month: '2-digit', day: '2-digit', year: 'numeric'})

  render() {
    const { reportItem } = this.props;

    if (typeof reportItem === 'undefined') {
      return null;
    }

    const { photo, details, description, id, status, created_date } = reportItem;

    return (
      <Wrapper>
        {photo && photo.src && (<ReportImage src={photo.src} />)}

        <Main>

          <HeadlineSection>
            <Heading alignLeft>{details.number} neue Fahrradbügel gewünscht</Heading>
            <BikeStandsCountSection>
              <BikestandsIcon />
              <BikeStandsCount>x{details.number}</BikeStandsCount>
            </BikeStandsCountSection>
          </HeadlineSection>

          <StatusIndicator>Status: {getReportStatusCaption(status)}</StatusIndicator>

          <HorizontalRuler className="light " />

          {
            description && (
              <>
                <SubHeading alignLeft>Hinweise an die Verwaltung</SubHeading>
                <Text>{description}</Text>
              </>
            )
          }

          <IndicatorSection>
            <IndicatorTitle>Bedarf Fahrradparkhaus</IndicatorTitle>
            <IndicatorValue>{details.fee_acceptable ? 'ja' : 'nein'}
            </IndicatorValue>
          </IndicatorSection>

          <HorizontalRuler className="light" />

          {created_date && (<Text>Meldung vom: {this.formatDate(created_date)}</Text>)}

        </Main>

        <SocialFooter>
          <Fill />
          <PlanningLike
            token={this.props.token}
            url={`${config.apiUrl}/reports/${id}`}
            id={id}
          />
          {navigator.share ? (
            <ShareButtonWrapper>
              <ShareButton onClick={this.shareReport} />
              <LikeButtonCaption>
                Teilen
              </LikeButtonCaption>
            </ShareButtonWrapper>
          ) : <Fill />}
        </SocialFooter>

      </Wrapper>
    );
  }
}

export default detailWrapped(ReportDetails);
