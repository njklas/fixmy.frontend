import React from 'react';
import { connect } from 'react-redux';
import { withRouter, generatePath } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import { TextField, CheckboxWithLabel, RadioGroup } from 'formik-material-ui';
import { FormControlLabel, Radio, FormHelperText } from '@material-ui/core';
import styled from 'styled-components';
import slugify from 'slugify';

import Button from '~/components2/Button';
import { Form } from '~/components2/Form';
import config from '~/config';
import { SignupData } from '../../types';
import api from '../../api';
import logger from '~/utils/logger';
import validate from './validate';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  tos_accepted: false,
  captain: null,
  message: '',
};

const FormError = styled(FormHelperText)`
  && {
    font-size: 1em;
    line-height: normal;
    margin: 2em auto;
  }
`;

const StyledForm = styled(Form)`
  .lastsectionheading {
    margin: 2em 0 0.5em 0;
  }

  .messageField {
    margin-bottom: 2em;
  }
`;

const SignupForm = ({ street, history, district }) => (
  <Formik
    initialValues={initialValues}
    validate={validate}
    onSubmit={async (values, { setSubmitting, setStatus }) => {
      const signupData: SignupData = {
        ...values,
        captain: values.captain === 'yes',
        campaign: district.name,
        street,
      };
      logger(JSON.stringify(signupData, null, 2));
      try {
        await api.signup(signupData, district);
        history.push(
          generatePath(config.routes.spielstrassen.thanks, {
            slug: slugify(street, { lower: true }),
          })
        );
      } catch (e) {
        logger(e);
        setStatus(
          'Es gab leider einen Fehler bei deiner Anmeldung. Bitte versuche es später noch einmal.'
        );
      }
      setSubmitting(false);
    }}
  >
    {({ status, isSubmitting }) => (
      <StyledForm>
        <Field
          name="first_name"
          component={TextField}
          label="Vorname"
          fullWidth
        />
        <Field
          name="last_name"
          component={TextField}
          label="Nachname"
          fullWidth
        />
        <Field
          type="email"
          name="email"
          component={TextField}
          label="E-Mail-Adresse"
          placeholder="beispiel@domain.de"
          fullWidth
        />

        <ErrorMessage
          name="tos_accepted"
          render={(msg) => <FormError error>{msg}</FormError>}
        />
        <div className="checkboxFieldGroup">
          <Field
            component={CheckboxWithLabel}
            name="tos_accepted"
            type="checkbox"
            Label={{
              label:
                'Ich willige ein, dass meine Daten an das Bezirksamt zum Zwecke einer Terminabspache und der Vernetzung mit anderen Bürger:innen übermittelt werden.',
            }}
          />
        </div>
        <h4>Teamkapitän:in</h4>
        <p>
          Wären Sie auch bereit, die Hauptverantwortung für die Betreuung der
          Spielstraße zu übernehmen und dafür eine{' '}
          <a
            className="external"
            href="/uploads/spielstrassen/2020_Vereinbarung_tempSpielstraße.pdf"
          >
            Kooperationsvereinbarung (PDF)
          </a>{' '}
          mit dem Bezirksamt zu unterzeichnen?
        </p>
        <ErrorMessage
          name="captain"
          render={(msg) => <FormError error>{msg}</FormError>}
        />
        <Field component={RadioGroup} name="captain">
          <FormControlLabel
            value="yes"
            control={<Radio disabled={isSubmitting} />}
            label="Ja, das mache ich gerne"
            disabled={isSubmitting}
          />
          <FormControlLabel
            value="no"
            control={<Radio disabled={isSubmitting} />}
            label="Nein, das ist mir zu viel Verantworung"
            disabled={isSubmitting}
          />
        </Field>
        <h4 className="lastsectionheading">
          Ihre Nachricht an das Bezirksamt (optional):
        </h4>
        <Field
          component={TextField}
          className="messageField"
          name="message"
          multiline
          rows={4}
          fullWidth
          InputProps={{ notched: true }}
        />
        {status && <FormError error>{status}</FormError>}
        <Button flat type="submit">
          Formular absenden
        </Button>
      </StyledForm>
    )}
  </Formik>
);

const mapStateToProps = ({ AppState }) => ({
  district: AppState.district,
});

// Typescript insists that using withRouter means that
// the component cannot have any other props.
// @ts-ignore
export default withRouter(connect(mapStateToProps)(SignupForm));
