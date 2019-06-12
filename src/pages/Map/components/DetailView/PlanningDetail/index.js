/* eslint react/no-array-index-key: 0, camelcase: 0 */
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import Title from '~/components/Title';
import SectionTitle from '~/components/SectionTitle';
import Text from '~/components/Text';
import Label from '~/components/Label';
import detailWrapped from '~/pages/Map/components/DetailView/detailWrapped';
import DetailSwitch, { ButtonGroup } from '~/pages/Map/components/DetailView/DetailSwitch';
import ImageSlider from '~/pages/Map/components/DetailView/ImageSlider';

import PlanningStatus from './PlanningStatus';
import PlanningLike from './PlanningLike';
import categoryMapping from './categoryMapping';
import DetailFooter from '~/pages/Map/components/DetailView/DetailFooter';

const DetailHead = styled.div`
  padding: 14px 24px;
  position: relative;
  background: white;
  border-bottom: 1px solid #c4c4c4;
`;

const DetailBody = styled.div`
  padding: 10px 24px;
  background: ${config.colors.lightbg};
  flex-grow: 1;
`;

const ExpandDescriptionButton = styled.div`
  color: ${config.colors.interaction};
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  display: none; // for now we dont want to display the more button
`;

const DetailBodySection = styled.div`
  border-bottom: 1px dashed #c6c6c6;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const DetailItem = styled(Text)`
  margin-bottom: 10px;
`;

const DetailImage = styled.img`
  width: 100%;
`;

const Anchor = styled.a`
  color: ${config.colors.interaction};
  text-decoration: none;

  &:hover {
    color: ${config.colors.interaction};
    text-decoration: underline;
  }

  &:visited, &:active {
    color: ${config.colors.interaction};
  }
`;

const NoDataLabel = styled.div`
  font-weight: 700;
  text-align: center;
  margin-top: 1rem;
`;

class PlanningDetails extends PureComponent {
  state = {
    descriptionExpanded: false,
    sideIndex: 0
  }

  onSwitchSide = sideIndex => () => this.setState({ sideIndex })

  toggleDescription = () => {
    this.setState(prevState => ({ descriptionExpanded: !prevState.descriptionExpanded }));
  }

  render() {
    const { plannings } = this.props.data;
    const { sideIndex } = this.state;

    if (!plannings || plannings.length === 0) {
      return <NoDataLabel>Keine Planung vorhanden</NoDataLabel>;
    }

    const planning = plannings[sideIndex];

    const {
      title, description, construction_completed, external_url, responsible, costs, faq, photos,
      phase, construction_started, draft_submitted, cross_section_photo, url, category
    } = planning;

    const translatedCategory = categoryMapping[category];
    const showFaq = faq && faq.length;
    const showSwitchButton = plannings.length > 1 && (plannings[0].url !== plannings[1].url);

    return (
      <Fragment>
        {showSwitchButton ? (
          <ButtonGroup>
            <DetailSwitch
              activeSideIndex={sideIndex}
              sideIndex={0}
              title="Westseite"
              side="left"
              onClick={this.onSwitchSide}
            />
            <DetailSwitch
              activeSideIndex={sideIndex}
              sideIndex={1}
              title="Ostseite"
              side="right"
              onClick={this.onSwitchSide}
            />
          </ButtonGroup>) : null
        }
        <ImageSlider images={photos} />

        <DetailHead>
          <Title>{title}</Title>
          {construction_completed && (
            <SectionTitle>
              Fertigstellung: {construction_completed}
            </SectionTitle>
          )}
          <Label margin="-12px 0 25px 0">
            {draft_submitted ? `Planungsbeginn: ${draft_submitted}` : null} {construction_started ? `Baubeginn: ${construction_started}` : null}
          </Label>
          {phase && <PlanningStatus phase={phase} />}
        </DetailHead>

        <DetailBody>
          {description && (
            <DetailBodySection>
              <SectionTitle>Ziel & Hintergrund dieser Maßnahme?</SectionTitle>
              <Text>
                {description}
              </Text>
              <ExpandDescriptionButton onClick={this.toggleDescription}>{this.state.descriptionExpanded ? 'Weniger' : 'Mehr >'}</ExpandDescriptionButton>
            </DetailBodySection>
          )}

          <DetailBodySection>
            <SectionTitle>Projektdaten:</SectionTitle>
            {typeof responsible !== 'undefined' && responsible !== null ? <DetailItem>Zuständigkeit: <strong>{responsible}</strong></DetailItem> : null}
            {typeof translatedCategory !== 'undefined' && translatedCategory !== null ? <DetailItem>Art der Maßnahme: <strong>{translatedCategory}</strong></DetailItem> : null}
            {typeof costs !== 'undefined' && costs !== null ? <DetailItem>Projektvolumen: <strong>{costs}</strong></DetailItem> : null}
            {external_url ? <DetailItem>Link zur Planung: <Anchor target="_blank" href={external_url}>{external_url}</Anchor></DetailItem> : null}
            {cross_section_photo ? <DetailImage src={cross_section_photo} /> : null}
          </DetailBodySection>

          {showFaq ? (
            <DetailBodySection>
              <SectionTitle>Häufige Fragen:</SectionTitle>
              {faq.map((f, i) => (
                <div key={`FAQ_Item_${i}`}>
                  <Text><strong>{f.text}</strong></Text>
                  <Text>{f.answer}</Text>
                </div>
              ))}
            </DetailBodySection>
          ) : null}
        </DetailBody>
        {config.showLikeButton && (
          <DetailFooter>
           <PlanningLike token={this.props.token} url={url} id={this.props.match.params.id} />}
          </DetailFooter>
        )}
      </Fragment>
    );
  }
}

export default detailWrapped(PlanningDetails);
