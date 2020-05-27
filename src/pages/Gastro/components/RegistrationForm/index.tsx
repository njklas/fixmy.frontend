import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { TextField, CheckboxWithLabel, Select } from 'formik-material-ui';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import styled from 'styled-components';

import Button from '~/components2/Button';
import { Form } from '~/components2/Form';
import StaticMap from '~/components2/StaticMap';
import AreaPicker from '~/components2/AreaPicker';
import logger from '~/utils/logger';
import config from '~/pages/Gastro/config';
import { GastroRegistration } from '~/pages/Gastro/types';
import api from '~/pages/Gastro/api';
import validate from './validate';
import parseLength from '../../parseLength';

/* eslint-disable camelcase */
export interface FormData {
  shop_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  category?: string;
  email?: string;
  address?: string;
  location?: [number, number];
  shopfront_length?: string;
  usage?: string;
  certificate?: string;
  opening_hours?: string;
  agreement_accepted?: boolean | '';
  tos_accepted?: boolean | '';
}
/* eslint-enable camelcase */

const initialValues: FormData = {
  shop_name: '',
  first_name: '',
  last_name: '',
  phone: '',
  category: '',
  email: '',
  address: '',
  location: null,
  shopfront_length: '',
  usage: '',
  certificate: null,
  agreement_accepted: '',
  tos_accepted: ''
};

const FormError = styled(FormHelperText)`
  && {
    font-size: 1em;
    line-height: normal;
    margin: 2em auto;
  }
`;

const StyledForm = styled(Form)`
  section {
    margin-bottom: 2em;
  }

  .MuiTextField-root,
  .dropdown {
    margin-bottom: 1em;
  }
`;

// Return true if usage for the signup's category is allowed on week days
const usageWeekday = ({ category }) =>
  ['retail', 'workshop'].includes(category);

// Return true if usage for the signup's category is allowed on weekends
const usageWeekend = ({ category }) =>
  ['restaurant', 'social', 'other'].includes(category);

const RegistrationForm = ({
  id,
  // eslint-disable-next-line camelcase
  access_key,
  onSuccess,
  signupData,
  regulation
}) => (
  <Formik
    initialValues={{ ...initialValues, ...signupData }}
    validate={validate}
    onSubmit={async (values, { setSubmitting, setStatus }) => {
      // @ts-ignore
      const registrationData: GastroRegistration = {
        ...signupData,
        ...values,
        id,
        access_key,
        shopfront_length: parseLength(values.shopfront_length),
        opening_hours: 'weekend',
        campaign: config.gastro.campaign
      };
      try {
        const response = await api.register(registrationData);
        onSuccess(response);
      } catch (e) {
        logger(e);
        setStatus(
          'Es gab leider einen Fehler bei Ihrer Anmeldung. Bitte versuchen Sie es später noch einmal.'
        );
      }
      setSubmitting(false);
    }}
  >
    {({ status, values, handleChange, isSubmitting }) => (
      <StyledForm>
        <section>
          <h4>
            Bitte vervollständigen Sie die Angaben zu Ihrem Betrieb{' '}
            <em>{values.shop_name}</em>:
          </h4>

          <ErrorMessage
            name="category"
            render={(msg) => <FormError error>{msg}</FormError>}
          />
          <div className="dropdown">
            <FormControl fullWidth>
              <InputLabel htmlFor="category">
                Art des Betriebs wählen
              </InputLabel>
              <Field
                component={Select}
                name="category"
                inputProps={{
                  id: 'category'
                }}
              >
                <MenuItem value="restaurant">Restaurant</MenuItem>
                <MenuItem value="retail">Einzelhandel mit Auslage</MenuItem>
                <MenuItem value="workshop">Werkstatt</MenuItem>
                <MenuItem value="social">Soziales Projekt</MenuItem>
                <MenuItem value="other">Sonstiger Bedarf</MenuItem>
              </Field>
            </FormControl>
          </div>
          <Field
            name="first_name"
            component={TextField}
            label="Vorname der Inhaber:in"
            fullWidth
          />
          <Field
            name="last_name"
            component={TextField}
            label="Nachname der Inhaber:in"
            fullWidth
          />
          <Field
            name="phone"
            component={TextField}
            label="Telefonnummer (tagsüber erreichbar)"
            fullWidth
            variant="filled"
          />
        </section>
        <section>
          <Field
            name="address"
            component={TextField}
            label="Addresse des Ladengeschäfts"
            disabled
            fullWidth
          />
          <StaticMap location={signupData?.geometry?.coordinates} />
        </section>

        {regulation && regulation.zone === 'Parkplatz' && (
          <section>
            <h3>Bestimmung der Sondernutzungsfläche</h3>
            <p>
              <p>
                Für Ihren Betrieb / Verein kann grundsätzlich eine
                Sondernutzungsfläche{' '}
                <strong>im Bereich der derzeitigen Parkflächen</strong> zur
                Verfügung gestellt werden.
              </p>
            </p>
            {usageWeekday(values) && (
              <p>
                Die Sondernutzungsfläche kann nach Einrichtung Montags bis
                Freitags, jeweils von 10 bis 20 Uhr genutzt werden.
              </p>
            )}
            {usageWeekend(values) && (
              <p>
                Die Sondernutzungsfläche kann nach Einrichtung Freitags,
                Samstags und Sonntags, jeweils von 11 bis 22 Uhr genutzt werden.
              </p>
            )}
            <p>
              Die späteren Anordnungen werden nach folgenden Regelplänen
              getroffen:
            </p>
            <ul>
              <li>
                <a href="/" className="internal">
                  Regelplan für Gehweg [PDF]
                </a>
              </li>
              <li>
                <a href="/" className="internal">
                  Regelplan für Parkraum [PDF]
                </a>
              </li>
            </ul>
            <p>
              <strong>
                Bitte zeichnen Sie auf der untenstehenden Karte ein, wo genau
                Sie die Sonderfläche nutzen möchten:
              </strong>
            </p>
            <p>Bitte beachten Sie beim Einzeichnen folgende Punkte:</p>
            <ul>
              <li>
                Es können keine Flächen auf Einfahrten, Behindertenparkplätzen,
                Bushaltestellen, Schaltschränken, Baumscheiben oder Baustellen
                beantragt werden.
              </li>
              <li>
                Die eingezeichnete Fläche muss sich im Bereich der Straßenfront
                Ihres Ladenlokals befinden.
              </li>
            </ul>

            <AreaPicker
              center={signupData?.geometry?.coordinates}
              onSelect={(value) => {
                handleChange({
                  target: {
                    name: 'area',
                    value
                  }
                });
              }}
            />
          </section>
        )}

        {regulation && regulation.zone !== 'Parkplatz' && (
          <section>
            <p>
              <strong>
                Ihr Betrieb liegt im Bereich der {regulation?.street}, hier wird
                es eine Gesamt-Anordnung für den Bereich {regulation?.street}{' '}
                {regulation?.from} bis {regulation?.to} geben. Wenn Sie sich
                registrieren, können Sie in diesem Bereich teilnehmen.
              </strong>
            </p>
            <p>
              <a href="/" className="internal">
                Karte der anzuordnenden Fläche
              </a>
            </p>
            <p>
              Die Sondernutzungsfläche kann nach Einrichtung Freitags, Samstags
              und Sonntags, jeweils von 11 bis 22 Uhr genutzt werden.
            </p>
          </section>
        )}

        <section>
          <p>
            <strong>
              Wie breit ist die Straßenfront ihres Ladenlokals (falls
              vorhanden)?
            </strong>
          </p>
          <p>
            Auf Grundlage der Straßenfront-Breite kann das Bezirksamt
            entscheiden welcher Raum im Straßenland genutzt werden kann. Sofern
            sie kein Ladenlokal haben bitte 0 angeben.
          </p>
          <Field
            name="shopfront_length"
            type="text"
            inputMode="numeric"
            pattern="[0-9]+(,[0-9]+)?"
            component={TextField}
            label="Angabe in Metern z.B. 4,8"
            fullWidth
          />
        </section>
        <section>
          <p>
            <strong>
              Bitte formulieren Sie kurze Angaben zum Nutzungszweck der
              beantragten Fläche:
            </strong>
          </p>
          <Field
            name="usage"
            type="text"
            component={TextField}
            label="Nutzungszweck"
            placeholder="z.B. Schankvorgarten, Warenauslagen, Werkstatt, oder anderer Zweck"
            multiline
            rows={4}
            fullWidth
            variant="filled"
          />
        </section>
        {/* <section>
          <p>
            <strong>
              Bitte laden Sie hier die erste Seite Ihrer Gewerbeanmeldung /
              Ihres Vereinsregisters als Scan oder Foto hoch (Schrift muss
              lesbar sein).
            </strong>
          </p>
          <Field
            component={SimpleFileUpload}
            name="certificate"
            type="file"
            inputProps={{
              id: 'certificate',
              accept: 'image/*,application/pdf,application/vnd.ms-excel',
              capture: 'environment'
            }}
          />
        </section> */}
        <section>
          <p>
            <strong>Zustimmung Kooperationsvereinbarung</strong>
          </p>
          <p>
            Damit Sie die Sonderfläche nutzen können, müssen Sie der{' '}
            <a href="/" className="internal">
              Kooperationsvereinbarung
            </a>{' '}
            mit dem Bezirksamt Friedrichshain-Kreuzberg zustimmen, damit sichern
            Sie folgende Punkte zu:
          </p>
          <ul>
            <li>
              Eigenverantwortliche Durchführung der verkehrsrechtlichen
              Anordnung, inkl. Stellung von Sperren, Schildern und ggf. Personal
              (inkl. Kostenübernahme für das Stellen der Schilder)
            </li>

            <li>
              Verpflichtung zur Einführung eines Pfandsystems für Einweggebinde
              bei der Herausgabe von Speisen nach Maßgabe des Bezirksamtes{' '}
            </li>

            <li>
              Freihaltung von ausreichend breiten Gehwegen (Mindestens 2 Meter)
            </li>
          </ul>
          <div className="checkboxFieldGroup">
            <ErrorMessage
              name="agreement_accepted"
              render={(msg) => <FormError error>{msg}</FormError>}
            />
            <Field
              component={CheckboxWithLabel}
              name="agreement_accepted"
              type="checkbox"
              Label={{
                label: (
                  <span>
                    Ich habe die{' '}
                    <a
                      href="/"
                      target="_blank"
                      rel="noreferrer nofollow"
                      className="internal"
                    >
                      Kooperationsvereinbarung
                    </a>{' '}
                    für die Nutzung der Sonderfläche gelesen und stimme Ihr zu.
                  </span>
                )
              }}
            />
          </div>
        </section>

        <section>
          <h4>Ihre E-Mail-Adresse</h4>
          <p className="subline">
            Ihre Daten werden für Durchführung des Verfahrens gespeichert, der
            Name Ihres Betriebes kann im Zuge der Aktion{' '}
            <em>Offene Terrassen für Friedrichshain-Kreuzberg</em>{' '}
            veröffentlicht werden.
          </p>
          <Field
            name="email"
            component={TextField}
            label="Ihre E-Mail-Adresse"
            fullWidth
          />
        </section>
        <div className="checkboxFieldGroup">
          <ErrorMessage
            name="tos_accepted"
            render={(msg) => <FormError error>{msg}</FormError>}
          />
          <Field
            component={CheckboxWithLabel}
            name="tos_accepted"
            type="checkbox"
            Label={{
              label: (
                <span>
                  Ich habe die{' '}
                  <a
                    href="/datenschutz"
                    target="_blank"
                    rel="noreferrer nofollow"
                    className="internal"
                  >
                    Datenschutzvereinbarung
                  </a>{' '}
                  gelesen und willige in die Speicherung meiner Daten zur
                  Kommunikation im Zuge der Nutzung der Sonderflächen ein.
                </span>
              )
            }}
          />
        </div>
        <p>
          Klicken Sie auf &quot;Antrag absenden&quot; um Ihren Antrag formal
          beim Bezirksamt einzureichen.
        </p>
        <Button flat type="submit">
          Antrag absenden
        </Button>
      </StyledForm>
    )}
  </Formik>
);

export default RegistrationForm;