import React from 'react';
import { Heading, Paragraph } from '~/components2/Article';
import Link from '~/components2/Link';
import { AnchorButton } from '~/components2/Button';
import ButtonWrapper from '../components/ButtonWrapper';
import DownloadInfo from '~/pages/Research/components/DownloadInfo';

const SectionDataset = ({ toc }) => (
  <>
    <Heading as="h2" toc={toc}>
      Datensatz der Ergebnisse zum Download
    </Heading>
    <Paragraph>
      FixMyCity stellt die Daten offen zur Verfügung (&ldquo;open data&rdquo;),
      unter der Bedingung, dass abgeleitete Werke auch veröffentlicht werden
      (&ldquo;share-alike&rdquo;). Details zur Lizenz können Sie auf den Seiten
      der <Link
        href="https://www.opendatacommons.org/licenses/odbl/summary/index.html"
      >Open Knowledge Foundation
      </Link> nachlesen. Die Erklärung zu den Spalten in
      dem JSON-Datensatz finden Sie in <Link
        href="/uploads/kataster-ki/Spezifikation_Ausgabeformat_des_Strassenchecks.pdf"
      >diesem PDF zu den Spezifikationen</Link>.
      Laden Sie sich die Ergebnisse der Umfrage über den folgenden Button als
      JSON-Datensatz herunter.
    </Paragraph>
    <ButtonWrapper>
      <AnchorButton
        flat
        href="https://raw.githubusercontent.com/FixMyBerlin/fixmy.data/master/SurveyResults_200414.json"
        target="_blank"
        rel="noopener noreferrer"
      >Datensatz herunterladen</AnchorButton>
     <DownloadInfo>
       (Format: JSON, Größe: ~41 MB,Format: ODbL)
     </DownloadInfo>
    </ButtonWrapper>
  </>
);

export default SectionDataset;