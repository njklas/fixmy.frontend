import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import history from '~/history';
import Loader from '~/components/PageLoading';
import ProgressBar from '~/pages/KatasterKI/components/ProgressBar';
import Info from '~/pages/KatasterKI/components/SectionTypes/Info';
import MultiChoice from '~/pages/KatasterKI/components/SectionTypes/MultiChoice';
import SingleChoice from '~/pages/KatasterKI/components/SectionTypes/SingleChoice';
import Scene from '~/pages/KatasterKI/components/SectionTypes/Scene';
import { setAnswer, updateProgressBar } from '../state';
import { Answer, Section, RequestState } from '../types';
import { makeSection } from '~/pages/KatasterKI/scene-utils';

const sectionTypes = {
  info: Info,
  multi_choice: MultiChoice,
  single_choice: SingleChoice,
  scene: Scene
};

// TODO: Replace with function
const isProfileComplete = true;

const getCurrentValue = (section: Section, scenes: Array<Answer>) =>
  section.type === 'scene'
    ? scenes.find((s) => s.sceneID === section.name)
    : null;

const Scenes = ({ match, scenes, perspective, dispatch, profileRequest }) => {
  // we dont redirect when developing. We do so if agbs not accepted or no question param passed
  if ((!config.debug && !isProfileComplete) || !match.params.page) {
    return <Redirect to={config.routes.katasterKI.profileBase} />;
  }

  if (
    profileRequest.state == RequestState.pending ||
    profileRequest.state == RequestState.error
  )
    return <Loader pastDelay={true} error={profileRequest.message} />;

  const page = +match.params.page - 1;
  const sectionConfig = makeSection(scenes, perspective);
  const section = sectionConfig[page];
  const SectionComponent = sectionTypes[section.type];

  useEffect(() => {
    dispatch(updateProgressBar(page, sectionConfig.length));
  }, [page, sectionConfig.length]);

  if (
    typeof section === 'undefined' ||
    typeof SectionComponent === 'undefined'
  ) {
    throw new Error("Error: Section or section type doesn't exist.");
  }

  const onChange = (rating: number, duration: number) =>
    section.type === 'scene'
      ? dispatch(setAnswer(section.name, rating, duration))
      : null;

  const next = () => {
    const isLastSection = page === sectionConfig.length - 1;
    if (isLastSection) {
      history.push(`${config.routes.katasterKI.scenesBase}/1`);
    } else {
      history.push(`${config.routes.katasterKI.scenesBase}/${page + 2}`);
    }
  };

  return (
    <>
      <ProgressBar />
      <SectionComponent
        {...section}
        currentValue={getCurrentValue(section, scenes)}
        next={next}
        handleChange={onChange}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  isTosAccepted: state.KatasterKIState.isTosAccepted,
  scenes: state.KatasterKIState.scenes,
  perspective: state.KatasterKIState.currentPerspective,
  profileRequest: state.KatasterKIState.profileRequest
});

export default connect(mapStateToProps)(Scenes);
